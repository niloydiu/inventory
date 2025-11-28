const PurchaseOrder = require("../models/PurchaseOrder");
const Item = require("../models/Item");
const StockMovement = require("../models/StockMovement");
const { validationResult } = require("express-validator");

// Get all purchase orders with pagination and filtering
exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      supplier_id,
      start_date,
      end_date,
      sort = "-created_at",
    } = req.query;

    const query = {};

    // Search by PO number or reference
    if (search) {
      query.$or = [
        { po_number: { $regex: search, $options: "i" } },
        { reference: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by supplier
    if (supplier_id) {
      query.supplier_id = supplier_id;
    }

    // Filter by date range
    if (start_date || end_date) {
      query.order_date = {};
      if (start_date) query.order_date.$gte = new Date(start_date);
      if (end_date) query.order_date.$lte = new Date(end_date);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      PurchaseOrder.find(query)
        .populate("supplier_id", "name supplier_code email phone")
        .populate("location_id", "name code")
        .populate("approved_by", "full_name email")
        .populate("created_by", "full_name email")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      PurchaseOrder.countDocuments(query),
    ]);

    res.json({
      purchase_orders: orders,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("[PO Controller] Error getting purchase orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single purchase order by ID
exports.getPurchaseOrderById = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
      .populate("supplier_id")
      .populate("location_id")
      .populate("items.item_id", "name sku description")
      .populate("approved_by", "full_name email")
      .populate("created_by", "full_name email");

    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("[PO Controller] Error getting purchase order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new purchase order
exports.createPurchaseOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = new PurchaseOrder({
      ...req.body,
      created_by: req.user.userId,
    });

    await order.save();

    // Populate fields for response
    await order.populate([
      { path: "supplier_id", select: "name supplier_code email" },
      { path: "location_id", select: "name code" },
      { path: "items.item_id", select: "name sku" },
    ]);

    res.status(201).json({
      message: "Purchase order created successfully",
      purchase_order: order,
    });
  } catch (error) {
    console.error("[PO Controller] Error creating purchase order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update purchase order
exports.updatePurchaseOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    // Prevent editing if already received or cancelled
    if (order.status === "received" || order.status === "cancelled") {
      return res.status(400).json({
        message: `Cannot update purchase order with status: ${order.status}`,
      });
    }

    Object.assign(order, req.body);
    await order.save();

    await order.populate([
      { path: "supplier_id", select: "name supplier_code email" },
      { path: "location_id", select: "name code" },
      { path: "items.item_id", select: "name sku" },
    ]);

    res.json({
      message: "Purchase order updated successfully",
      purchase_order: order,
    });
  } catch (error) {
    console.error("[PO Controller] Error updating purchase order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve purchase order
exports.approvePurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending purchase orders can be approved",
      });
    }

    order.status = "approved";
    order.approved_by = req.user.userId;
    order.approved_date = new Date();

    await order.save();

    res.json({
      message: "Purchase order approved successfully",
      purchase_order: order,
    });
  } catch (error) {
    console.error("[PO Controller] Error approving purchase order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Receive purchase order (update inventory)
exports.receivePurchaseOrder = async (req, res) => {
  try {
    const { received_items, received_date, notes } = req.body;

    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    if (order.status !== "approved" && order.status !== "partial") {
      return res.status(400).json({
        message: "Only approved purchase orders can be received",
      });
    }

    // Update received quantities and inventory
    for (const receivedItem of received_items) {
      const orderItem = order.items.find(
        (item) => item.item_id.toString() === receivedItem.item_id
      );

      if (!orderItem) {
        continue;
      }

      const quantityToReceive = receivedItem.quantity_received || 0;
      orderItem.quantity_received += quantityToReceive;

      // Update item quantity in inventory
      const item = await Item.findById(receivedItem.item_id);
      if (item) {
        item.quantity += quantityToReceive;
        await item.save();

        // Create stock movement record
        await StockMovement.create({
          item_id: receivedItem.item_id,
          location_id: order.location_id,
          movement_type: "purchase",
          quantity: quantityToReceive,
          quantity_after: item.quantity,
          reference_type: "PurchaseOrder",
          reference_id: order._id,
          notes: `Received from PO: ${order.po_number}`,
          created_by: req.user.userId,
        });
      }
    }

    // Determine if fully or partially received
    const allFullyReceived = order.items.every(
      (item) => item.quantity_received >= item.quantity
    );

    order.status = allFullyReceived ? "received" : "partial";
    order.received_date = received_date || new Date();
    if (notes) order.notes = (order.notes || "") + "\n" + notes;

    await order.save();

    res.json({
      message: "Purchase order received successfully",
      purchase_order: order,
    });
  } catch (error) {
    console.error("[PO Controller] Error receiving purchase order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel purchase order
exports.cancelPurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    if (order.status === "received") {
      return res.status(400).json({
        message: "Cannot cancel a received purchase order",
      });
    }

    order.status = "cancelled";
    if (req.body.notes) {
      order.notes = (order.notes || "") + "\nCancellation: " + req.body.notes;
    }

    await order.save();

    res.json({
      message: "Purchase order cancelled successfully",
      purchase_order: order,
    });
  } catch (error) {
    console.error("[PO Controller] Error cancelling purchase order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get purchase order statistics
exports.getPurchaseOrderStats = async (req, res) => {
  try {
    const [total, pending, approved, partial, received, cancelled] =
      await Promise.all([
        PurchaseOrder.countDocuments(),
        PurchaseOrder.countDocuments({ status: "pending" }),
        PurchaseOrder.countDocuments({ status: "approved" }),
        PurchaseOrder.countDocuments({ status: "partial" }),
        PurchaseOrder.countDocuments({ status: "received" }),
        PurchaseOrder.countDocuments({ status: "cancelled" }),
      ]);

    // Get total value
    const totalValue = await PurchaseOrder.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]);

    res.json({
      stats: {
        total,
        pending,
        approved,
        partial,
        received,
        cancelled,
        total_value: totalValue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("[PO Controller] Error getting stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
