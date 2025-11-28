const { Item } = require("../models");
const { paginatedQuery } = require("../utils/queryHelpers");

// Get all items with pagination
exports.getAllItems = async (req, res) => {
  try {
    // Clean the query to remove cache-busting parameters
    const cleanQuery = { ...req.query };
    delete cleanQuery._t; // Remove cache-busting timestamp
    delete cleanQuery._; // Remove other cache-busting parameters

    const result = await paginatedQuery(
      Item,
      cleanQuery,
      ["name", "description", "sku", "barcode"],
      "category"
    );

    // Map database fields to frontend format for each item
    const mappedData = result.data.map((item) => {
      const itemObj = item.toObject ? item.toObject() : item;
      return {
        ...itemObj,
        unit_type: itemObj.unit,
        price: itemObj.purchase_price,
        minimum_level: itemObj.low_stock_threshold,
        asset_tag: itemObj.notes?.startsWith("Asset Tag: ")
          ? itemObj.notes.replace("Asset Tag: ", "")
          : "",
      };
    });

    res.json({
      success: true,
      ...result,
      data: mappedData,
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get items",
      error: error.message,
    });
  }
};

// Get single item
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Map database fields to frontend format
    const mappedItem = {
      ...item.toObject(),
      unit_type: item.unit,
      price: item.purchase_price,
      minimum_level: item.low_stock_threshold,
      asset_tag: item.notes?.startsWith("Asset Tag: ")
        ? item.notes.replace("Asset Tag: ", "")
        : "",
    };

    res.json({
      success: true,
      data: mappedItem,
    });
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get item",
      error: error.message,
    });
  }
};

// Create item
exports.createItem = async (req, res) => {
  try {
    const itemData = req.body;

    if (!itemData.name) {
      return res.status(400).json({
        success: false,
        message: "Item name is required",
      });
    }

    // Map frontend fields to database schema
    const mappedData = {
      name: itemData.name,
      category: itemData.category,
      description: itemData.description || "",
      quantity: itemData.quantity || 0,
      available_quantity: itemData.quantity || 0,
      unit: itemData.unit_type || "units", // Map unit_type to unit
      serial_number: itemData.serial_number || "",
      status: itemData.status || "available",
      low_stock_threshold: itemData.minimum_level || 10, // Map minimum_level to low_stock_threshold
      purchase_price: itemData.price || 0, // Map price to purchase_price
      location_id: itemData.location_id,
      image_url: itemData.image_url,
      notes: itemData.asset_tag ? `Asset Tag: ${itemData.asset_tag}` : "", // Store asset_tag in notes
    };

    // Remove undefined values
    Object.keys(mappedData).forEach(
      (key) => mappedData[key] === undefined && delete mappedData[key]
    );

    const item = await Item.create(mappedData);

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: error.message,
    });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = req.body;

    // Map frontend fields to database schema
    const mappedData = {};

    if (itemData.name !== undefined) mappedData.name = itemData.name;
    if (itemData.category !== undefined)
      mappedData.category = itemData.category;
    if (itemData.description !== undefined)
      mappedData.description = itemData.description;
    if (itemData.quantity !== undefined) {
      mappedData.quantity = itemData.quantity;
      mappedData.available_quantity = itemData.quantity;
    }
    if (itemData.unit_type !== undefined) mappedData.unit = itemData.unit_type;
    if (itemData.serial_number !== undefined)
      mappedData.serial_number = itemData.serial_number;
    if (itemData.status !== undefined) mappedData.status = itemData.status;
    if (itemData.minimum_level !== undefined)
      mappedData.low_stock_threshold = itemData.minimum_level;
    if (itemData.price !== undefined)
      mappedData.purchase_price = itemData.price;
    if (itemData.location_id !== undefined)
      mappedData.location_id = itemData.location_id;
    if (itemData.image_url !== undefined)
      mappedData.image_url = itemData.image_url;
    if (itemData.asset_tag !== undefined) {
      mappedData.notes = itemData.asset_tag
        ? `Asset Tag: ${itemData.asset_tag}`
        : "";
    }

    const item = await Item.findByIdAndUpdate(id, mappedData, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update item",
      error: error.message,
    });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
    });
  }
};

// Get categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Item.distinct("category");

    res.json({
      success: true,
      data: categories.filter((c) => c).sort(),
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get categories",
    });
  }
};

// Get low stock items
exports.getLowStock = async (req, res) => {
  try {
    const items = await Item.find({
      $expr: { $lte: ["$quantity", "$low_stock_threshold"] },
    }).sort({ quantity: 1 });

    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("Get low stock error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get low stock items",
    });
  }
};

// Bulk create items
exports.bulkCreate = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items array is required",
      });
    }

    // Set defaults for each item
    const itemsWithDefaults = items.map((item) => ({
      ...item,
      quantity: item.quantity || 0,
      available_quantity: item.available_quantity || item.quantity || 0,
      low_stock_threshold: item.low_stock_threshold || 10,
      status: item.status || "active",
    }));

    const createdItems = await Item.insertMany(itemsWithDefaults);

    res.status(201).json({
      success: true,
      data: createdItems,
    });
  } catch (error) {
    console.error("Bulk create error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to bulk create items",
    });
  }
};
