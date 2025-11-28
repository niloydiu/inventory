const StockMovement = require("../models/StockMovement");
const Item = require("../models/Item");
const { validationResult } = require("express-validator");

// Get all stock movements with pagination and filtering
exports.getAllMovements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      item_id,
      location_id,
      movement_type,
      reference_type,
      start_date,
      end_date,
      sort = "-created_at",
    } = req.query;

    const query = {};

    // Filter by item
    if (item_id) {
      query.item_id = item_id;
    }

    // Filter by location (check both from and to locations for transfers)
    if (location_id) {
      query.$or = [
        { from_location_id: location_id },
        { to_location_id: location_id }
      ];
    }

    // Filter by movement type
    if (movement_type) {
      query.movement_type = movement_type;
    }

    // Filter by reference type
    if (reference_type) {
      query.reference_type = reference_type;
    }

    // Filter by date range (use created_at since movement_date is just an alias)
    if (start_date || end_date) {
      query.created_at = {};
      if (start_date) {
        // Set start of day for start_date
        const startDate = new Date(start_date);
        startDate.setHours(0, 0, 0, 0);
        query.created_at.$gte = startDate;
      }
      if (end_date) {
        // Set end of day for end_date
        const endDate = new Date(end_date);
        endDate.setHours(23, 59, 59, 999);
        query.created_at.$lte = endDate;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [rawMovements, total] = await Promise.all([
      StockMovement.find(query)
        .populate("item_id", "name sku")
        .populate("from_location_id", "name code")
        .populate("to_location_id", "name code")
        .populate("performed_by", "full_name email")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      StockMovement.countDocuments(query),
    ]);

    // Transform data to match frontend expectations
    const movements = rawMovements.map(movement => ({
      ...movement,
      movement_date: movement.created_at,
      quantity_change: movement.quantity,
      quantity_after: movement.balance_after,
      location_id: movement.to_location_id || movement.from_location_id, // For backward compatibility
    }));

    res.json({
      movements,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    console.error(
      "[Stock Movements Controller] Error getting movements:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single movement by ID
exports.getMovementById = async (req, res) => {
  try {
    const movement = await StockMovement.findById(req.params.id)
      .populate("item_id")
      .populate("location_id")
      .populate("created_by", "full_name email");

    if (!movement) {
      return res.status(404).json({ message: "Stock movement not found" });
    }

    res.json(movement);
  } catch (error) {
    console.error(
      "[Stock Movements Controller] Error getting movement:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get movement history for an item
exports.getItemMovementHistory = async (req, res) => {
  try {
    const { item_id } = req.params;
    const { page = 1, limit = 50, sort = "-created_at" } = req.query;

    const query = { item_id };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [movements, total] = await Promise.all([
      StockMovement.find(query)
        .populate("location_id", "name code")
        .populate("created_by", "full_name email")
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      StockMovement.countDocuments(query),
    ]);

    res.json({
      movements,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    console.error(
      "[Stock Movements Controller] Error getting item history:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create manual stock movement (adjustment, damage, expiry, etc.)
exports.createMovement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { item_id, location_id, movement_type, quantity, reason, notes } =
      req.body;

    // Get current item
    const item = await Item.findById(item_id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Update item quantity
    const oldQuantity = item.quantity;
    item.quantity += quantity; // quantity can be negative for reductions

    if (item.quantity < 0) {
      return res.status(400).json({
        message: "Insufficient quantity. Cannot reduce below zero.",
      });
    }

    await item.save();

    // Create movement record
    const movement = new StockMovement({
      item_id,
      location_id,
      movement_type,
      quantity,
      quantity_before: oldQuantity,
      quantity_after: item.quantity,
      reason,
      notes,
      created_by: req.user.user_id,
    });

    await movement.save();

    await movement.populate([
      { path: "item_id", select: "name sku" },
      { path: "location_id", select: "name code" },
      { path: "created_by", select: "full_name email" },
    ]);

    res.status(201).json({
      message: "Stock movement created successfully",
      movement,
    });
  } catch (error) {
    console.error(
      "[Stock Movements Controller] Error creating movement:",
      error
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get movement statistics
exports.getMovementStats = async (req, res) => {
  try {
    const { item_id, location_id, start_date, end_date } = req.query;

    const matchQuery = {};
    if (item_id) matchQuery.item_id = item_id;
    if (location_id) matchQuery.location_id = location_id;
    if (start_date || end_date) {
      matchQuery.created_at = {};
      if (start_date) matchQuery.created_at.$gte = new Date(start_date);
      if (end_date) matchQuery.created_at.$lte = new Date(end_date);
    }

    const [byType, byLocation, recentMovements] = await Promise.all([
      StockMovement.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: "$movement_type",
            count: { $sum: 1 },
            total_quantity: { $sum: "$quantity" },
          },
        },
      ]),
      StockMovement.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: "$location_id",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "locations",
            localField: "_id",
            foreignField: "_id",
            as: "location",
          },
        },
        {
          $project: {
            count: 1,
            location_name: { $arrayElemAt: ["$location.name", 0] },
          },
        },
      ]),
      StockMovement.find(matchQuery)
        .populate("item_id", "name sku")
        .populate("location_id", "name code")
        .sort("-created_at")
        .limit(10)
        .lean(),
    ]);

    res.json({
      stats: {
        by_type: byType,
        by_location: byLocation,
      },
      recent_movements: recentMovements,
    });
  } catch (error) {
    console.error("[Stock Movements Controller] Error getting stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get movement summary (total in/out) for a period
exports.getMovementSummary = async (req, res) => {
  try {
    const { item_id, location_id, start_date, end_date } = req.query;

    const matchQuery = {};
    if (item_id) matchQuery.item_id = item_id;
    if (location_id) matchQuery.location_id = location_id;
    if (start_date || end_date) {
      matchQuery.created_at = {};
      if (start_date) matchQuery.created_at.$gte = new Date(start_date);
      if (end_date) matchQuery.created_at.$lte = new Date(end_date);
    }

    const summary = await StockMovement.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total_in: {
            $sum: {
              $cond: [{ $gt: ["$quantity", 0] }, "$quantity", 0],
            },
          },
          total_out: {
            $sum: {
              $cond: [{ $lt: ["$quantity", 0] }, { $abs: "$quantity" }, 0],
            },
          },
          total_movements: { $sum: 1 },
        },
      },
    ]);

    res.json({
      summary: summary[0] || {
        total_in: 0,
        total_out: 0,
        total_movements: 0,
      },
    });
  } catch (error) {
    console.error("[Stock Movements Controller] Error getting summary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
