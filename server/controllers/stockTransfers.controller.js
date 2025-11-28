const StockTransfer = require("../models/StockTransfer");
const Item = require("../models/Item");
const StockMovement = require("../models/StockMovement");
const { validationResult } = require("express-validator");

// Get all stock transfers with pagination and filtering
exports.getAllTransfers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      from_location,
      to_location,
      start_date,
      end_date,
      sort = "-created_at",
    } = req.query;

    const query = {};

    // Search by transfer number or reference
    if (search) {
      query.$or = [
        { transfer_number: { $regex: search, $options: "i" } },
        { reference: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by locations
    if (from_location) {
      query.from_location_id = from_location;
    }
    if (to_location) {
      query.to_location_id = to_location;
    }

    // Filter by date range
    if (start_date || end_date) {
      query.transfer_date = {};
      if (start_date) query.transfer_date.$gte = new Date(start_date);
      if (end_date) query.transfer_date.$lte = new Date(end_date);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transfers, total] = await Promise.all([
      StockTransfer.find(query)
        .populate("from_location_id", "name code")
        .populate("to_location_id", "name code")
        .populate("items.item_id", "name sku")
        .populate("initiated_by", "full_name email")
        .populate("approved_by", "full_name email")
        .populate("received_by", "full_name email")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      StockTransfer.countDocuments(query),
    ]);

    res.json({
      transfers,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("[Transfers Controller] Error getting transfers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single transfer by ID
exports.getTransferById = async (req, res) => {
  try {
    const transfer = await StockTransfer.findById(req.params.id)
      .populate("from_location_id")
      .populate("to_location_id")
      .populate("items.item_id", "name sku description")
      .populate("initiated_by", "full_name email")
      .populate("approved_by", "full_name email")
      .populate("received_by", "full_name email");

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    res.json(transfer);
  } catch (error) {
    console.error("[Transfers Controller] Error getting transfer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new stock transfer
exports.createTransfer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate from and to locations are different
    if (req.body.from_location_id === req.body.to_location_id) {
      return res.status(400).json({
        message: "From and To locations must be different",
      });
    }

    // Validate item availability at from_location (optional - depends on your business logic)
    // For now, we'll just create the transfer

    const transfer = new StockTransfer({
      ...req.body,
      initiated_by: req.user.userId,
    });

    await transfer.save();

    await transfer.populate([
      { path: "from_location_id", select: "name code" },
      { path: "to_location_id", select: "name code" },
      { path: "items.item_id", select: "name sku" },
    ]);

    res.status(201).json({
      message: "Stock transfer created successfully",
      transfer,
    });
  } catch (error) {
    console.error("[Transfers Controller] Error creating transfer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update transfer
exports.updateTransfer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const transfer = await StockTransfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    // Prevent editing if already received or cancelled
    if (transfer.status === "received" || transfer.status === "cancelled") {
      return res.status(400).json({
        message: `Cannot update transfer with status: ${transfer.status}`,
      });
    }

    Object.assign(transfer, req.body);
    await transfer.save();

    await transfer.populate([
      { path: "from_location_id", select: "name code" },
      { path: "to_location_id", select: "name code" },
      { path: "items.item_id", select: "name sku" },
    ]);

    res.json({
      message: "Transfer updated successfully",
      transfer,
    });
  } catch (error) {
    console.error("[Transfers Controller] Error updating transfer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve transfer
exports.approveTransfer = async (req, res) => {
  try {
    const transfer = await StockTransfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    if (transfer.status !== "pending") {
      return res.status(400).json({
        message: "Only pending transfers can be approved",
      });
    }

    transfer.status = "approved";
    transfer.approved_by = req.user.userId;
    transfer.approved_date = new Date();

    await transfer.save();

    res.json({
      message: "Transfer approved successfully",
      transfer,
    });
  } catch (error) {
    console.error("[Transfers Controller] Error approving transfer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Ship transfer (deduct from source location)
exports.shipTransfer = async (req, res) => {
  try {
    const transfer = await StockTransfer.findById(req.params.id).populate(
      "items.item_id"
    );

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    if (transfer.status !== "approved") {
      return res.status(400).json({
        message: "Only approved transfers can be shipped",
      });
    }

    // Deduct quantities from source location
    // Note: This is a simplified version. In production, you'd need location-specific inventory
    for (const transferItem of transfer.items) {
      const item = await Item.findById(transferItem.item_id);
      if (item) {
        // Check if enough quantity available
        if (item.quantity < transferItem.quantity_sent) {
          return res.status(400).json({
            message: `Insufficient quantity for item: ${item.name}`,
          });
        }

        item.quantity -= transferItem.quantity_sent;
        await item.save();

        // Create stock movement for shipment
        await StockMovement.create({
          item_id: item._id,
          location_id: transfer.from_location_id,
          movement_type: "transfer_out",
          quantity: -transferItem.quantity_sent,
          quantity_after: item.quantity,
          reference_type: "StockTransfer",
          reference_id: transfer._id,
          notes: `Transfer out to ${transfer.to_location_id}: ${transfer.transfer_number}`,
          created_by: req.user.userId,
        });
      }
    }

    transfer.status = "in_transit";
    transfer.shipped_date = new Date();
    await transfer.save();

    res.json({
      message: "Transfer shipped successfully",
      transfer,
    });
  } catch (error) {
    console.error("[Transfers Controller] Error shipping transfer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Receive transfer (add to destination location)
exports.receiveTransfer = async (req, res) => {
  try {
    const { received_items, received_date, notes } = req.body;

    const transfer = await StockTransfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    if (transfer.status !== "in_transit") {
      return res.status(400).json({
        message: "Only in-transit transfers can be received",
      });
    }

    // Update received quantities and add to destination inventory
    for (const receivedItem of received_items) {
      const transferItem = transfer.items.find(
        (item) => item.item_id.toString() === receivedItem.item_id
      );

      if (!transferItem) {
        continue;
      }

      const quantityToReceive = receivedItem.quantity_received || 0;
      transferItem.quantity_received = quantityToReceive;

      // Update item quantity
      const item = await Item.findById(receivedItem.item_id);
      if (item) {
        item.quantity += quantityToReceive;
        await item.save();

        // Create stock movement for receipt
        await StockMovement.create({
          item_id: item._id,
          location_id: transfer.to_location_id,
          movement_type: "transfer_in",
          quantity: quantityToReceive,
          quantity_after: item.quantity,
          reference_type: "StockTransfer",
          reference_id: transfer._id,
          notes: `Transfer in from ${transfer.from_location_id}: ${transfer.transfer_number}`,
          created_by: req.user.userId,
        });
      }
    }

    transfer.status = "received";
    transfer.received_by = req.user.userId;
    transfer.received_date = received_date || new Date();
    if (notes) transfer.notes = (transfer.notes || "") + "\n" + notes;

    await transfer.save();

    res.json({
      message: "Transfer received successfully",
      transfer,
    });
  } catch (error) {
    console.error("[Transfers Controller] Error receiving transfer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel transfer
exports.cancelTransfer = async (req, res) => {
  try {
    const transfer = await StockTransfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    if (transfer.status === "received") {
      return res.status(400).json({
        message: "Cannot cancel a received transfer",
      });
    }

    // If already shipped, need to return items to source location
    if (transfer.status === "in_transit") {
      for (const transferItem of transfer.items) {
        const item = await Item.findById(transferItem.item_id);
        if (item) {
          item.quantity += transferItem.quantity_sent;
          await item.save();

          // Create stock movement for return
          await StockMovement.create({
            item_id: item._id,
            location_id: transfer.from_location_id,
            movement_type: "adjustment",
            quantity: transferItem.quantity_sent,
            quantity_after: item.quantity,
            reference_type: "StockTransfer",
            reference_id: transfer._id,
            notes: `Transfer cancelled, items returned: ${transfer.transfer_number}`,
            created_by: req.user.userId,
          });
        }
      }
    }

    transfer.status = "cancelled";
    if (req.body.notes) {
      transfer.notes =
        (transfer.notes || "") + "\nCancellation: " + req.body.notes;
    }

    await transfer.save();

    res.json({
      message: "Transfer cancelled successfully",
      transfer,
    });
  } catch (error) {
    console.error("[Transfers Controller] Error cancelling transfer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get transfer statistics
exports.getTransferStats = async (req, res) => {
  try {
    const [total, pending, approved, inTransit, received, cancelled] =
      await Promise.all([
        StockTransfer.countDocuments(),
        StockTransfer.countDocuments({ status: "pending" }),
        StockTransfer.countDocuments({ status: "approved" }),
        StockTransfer.countDocuments({ status: "in_transit" }),
        StockTransfer.countDocuments({ status: "received" }),
        StockTransfer.countDocuments({ status: "cancelled" }),
      ]);

    res.json({
      stats: {
        total,
        pending,
        approved,
        in_transit: inTransit,
        received,
        cancelled,
      },
    });
  } catch (error) {
    console.error("[Transfers Controller] Error getting stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
