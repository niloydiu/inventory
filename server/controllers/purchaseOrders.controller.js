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
        .populate("delivery_location_id", "name code")
        .populate("approved_by", "full_name email")
        .populate("created_by", "full_name email")
        .populate("items.item_id", "name sku")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      PurchaseOrder.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders.map(order => ({
        ...order,
        expected_delivery: order.expected_delivery_date
      })),
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
      .populate("delivery_location_id")
      .populate("items.item_id", "name sku description")
      .populate("approved_by", "full_name email")
      .populate("created_by", "full_name email");

    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    // Transform backend data to frontend format
    const transformedOrder = {
      ...order.toObject(),
      expected_delivery: order.expected_delivery_date,
      items: order.items.map(item => ({
        item_id: item.item_id,
        quantity: item.quantity_ordered,
        unit_price: item.unit_price,
        total: item.total
      }))
    };

    res.json({ success: true, data: transformedOrder });
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

    console.log('[PO Controller] Creating purchase order with data:', req.body);

    // Transform frontend data to match model schema
    const orderData = { ...req.body };
    
    // Transform items array to match model schema
    if (orderData.items && Array.isArray(orderData.items)) {
      console.log('[PO Controller] Original items:', orderData.items);
      orderData.items = orderData.items.map(item => {
        const transformedItem = {
          item_id: item.item_id,
          quantity_ordered: Number(item.quantity) || 0,
          unit_price: Number(item.unit_price) || 0,
          total: (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
          quantity_received: 0,
          tax_rate: Number(item.tax_rate) || 0,
          discount: Number(item.discount) || 0
        };
        console.log('[PO Controller] Transformed item:', transformedItem);
        return transformedItem;
      });
      console.log('[PO Controller] All transformed items:', orderData.items);
    }

    // Calculate subtotal and totals
    const subtotal = orderData.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0;
    orderData.subtotal = subtotal;
    
    // If total_amount not provided, calculate it
    if (!orderData.total_amount) {
      orderData.total_amount = subtotal + (orderData.tax_amount || 0) + (orderData.shipping_cost || 0) - (orderData.discount_amount || 0);
    }

    // Map expected_delivery to expected_delivery_date if needed
    if (orderData.expected_delivery && !orderData.expected_delivery_date) {
      orderData.expected_delivery_date = new Date(orderData.expected_delivery);
    }

    // Convert order_date to Date object if it's a string
    if (orderData.order_date && typeof orderData.order_date === 'string') {
      orderData.order_date = new Date(orderData.order_date);
    }

    // Remove the po_number field to let the pre-save hook generate it
    delete orderData.po_number;

    console.log('[PO Controller] Final transformed order data:', JSON.stringify(orderData, null, 2));

    const order = new PurchaseOrder({
      ...orderData,
      created_by: req.user.user_id,
    });

    console.log('[PO Controller] Order object before save:', JSON.stringify(order.toObject(), null, 2));

    await order.save();

    console.log('[PO Controller] Order saved successfully with PO number:', order.po_number);

    // Populate fields for response
    await order.populate([
      { path: "supplier_id", select: "name supplier_code email" },
      { path: "delivery_location_id", select: "name code" },
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

    console.log('[PO Controller] Updating purchase order with data:', req.body);

    // Transform frontend data to match model schema
    const updateData = { ...req.body };
    
    // Transform items array to match model schema
    if (updateData.items && Array.isArray(updateData.items)) {
      updateData.items = updateData.items.map(item => ({
        item_id: item.item_id,
        quantity_ordered: Number(item.quantity) || 0,
        unit_price: Number(item.unit_price) || 0,
        total: (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
        quantity_received: item.quantity_received || 0,
        tax_rate: Number(item.tax_rate) || 0,
        discount: Number(item.discount) || 0
      }));
    }

    // Calculate subtotal and totals
    if (updateData.items) {
      const subtotal = updateData.items.reduce((sum, item) => sum + (item.total || 0), 0);
      updateData.subtotal = subtotal;
      
      // If total_amount not provided, calculate it
      if (!updateData.total_amount) {
        updateData.total_amount = subtotal + (updateData.tax_amount || 0) + (updateData.shipping_cost || 0) - (updateData.discount_amount || 0);
      }
    }

    // Map expected_delivery to expected_delivery_date if needed
    if (updateData.expected_delivery && !updateData.expected_delivery_date) {
      updateData.expected_delivery_date = new Date(updateData.expected_delivery);
    }

    // Convert order_date to Date object if it's a string
    if (updateData.order_date && typeof updateData.order_date === 'string') {
      updateData.order_date = new Date(updateData.order_date);
    }

    Object.assign(order, updateData);
    await order.save();

    await order.populate([
      { path: "supplier_id", select: "name supplier_code email" },
      { path: "delivery_location_id", select: "name code" },
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
    order.approved_by = req.user.user_id;
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
          created_by: req.user.user_id,
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

// Delete purchase order
exports.deletePurchaseOrder = async (req, res) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Purchase order not found" });
    }

    // Only allow deletion of draft or pending orders
    if (order.status === "received" || order.status === "approved" || order.status === "ordered") {
      return res.status(400).json({
        message: `Cannot delete purchase order with status: ${order.status}`,
      });
    }

    await PurchaseOrder.findByIdAndDelete(req.params.id);

    res.json({
      message: "Purchase order deleted successfully",
    });
  } catch (error) {
    console.error("[PO Controller] Error deleting purchase order:", error);
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
