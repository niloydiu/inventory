const StockMovement = require("../models/StockMovement");
const Item = require("../models/Item");
const { validationResult } = require("express-validator");
const { paginatedQuery } = require("../utils/queryHelpers");

// Get all stock movements with pagination and filtering
exports.getAllMovements = async (req, res) => {
  try {
    const cleanQuery = { ...req.query };
    
    // Handle date range parameters specially as paginatedQuery expects exact matches or standard range format
    if (cleanQuery.start_date) {
      const startDate = new Date(cleanQuery.start_date);
      startDate.setHours(0, 0, 0, 0);
      cleanQuery.created_at_min = startDate; // Map to helper format
      delete cleanQuery.start_date;
    }
    if (cleanQuery.end_date) {
      const endDate = new Date(cleanQuery.end_date);
      endDate.setHours(23, 59, 59, 999);
      cleanQuery.created_at_max = endDate; // Map to helper format
      delete cleanQuery.end_date;
    }
    
    // Handle location_id OR logic (from or to)
    // paginatedQuery handles straightforward AND logic.
    // For complex OR logic like location_id being in from OR to, we might need to pass a custom filter or handle it here.
    // The helper supports standard filters. For complex ones, we can manually construct the filter object and pass it.
    
    const result = await paginatedQuery(
      StockMovement,
      cleanQuery,
      ["reference_number", "batch_number", "notes", "reason"],
      [
        { path: "item_id", select: "name sku" },
        { path: "from_location_id", select: "name code" },
        { path: "to_location_id", select: "name code" },
        { path: "performed_by", select: "full_name email" }
      ]
    );

    // Transform data to match frontend expectations
    const movements = result.data.map(movement => {
      const mObj = movement.toObject ? movement.toObject() : movement;
      return {
        ...mObj,
        movement_date: mObj.created_at,
        quantity_change: mObj.quantity,
        quantity_after: mObj.balance_after,
        location_id: mObj.to_location_id || mObj.from_location_id, // For backward compatibility
      };
    });

    res.json({
      success: true,
      ...result,
      data: movements, // Override data with transformed version
      // Maintain backward compatibility for 'movements' and 'pagination' keys if needed
      movements: movements,
      pagination: {
        current_page: result.page,
        total_pages: result.pages,
        total_items: result.total,
        items_per_page: result.limit,
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
