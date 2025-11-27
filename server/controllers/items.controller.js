const { Item } = require('../models');

// Get all items with pagination
exports.getAllItems = async (req, res) => {
  try {
    const { category, status, search, page = 1, limit = 50 } = req.query;
    
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const items = await Item.find(filter)
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Item.countDocuments(filter);

    res.json({
      success: true,
      data: {
        items,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get items'
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
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get item'
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
        message: 'Item name is required'
      });
    }

    // Set defaults
    if (!itemData.quantity) itemData.quantity = 0;
    if (!itemData.available_quantity) itemData.available_quantity = itemData.quantity;
    if (!itemData.low_stock_threshold) itemData.low_stock_threshold = 10;
    if (!itemData.status) itemData.status = 'active';

    const item = await Item.create(itemData);

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create item'
    });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const item = await Item.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item'
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
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item'
    });
  }
};

// Get categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Item.distinct('category');

    res.json({
      success: true,
      data: categories.filter(c => c).sort()
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    });
  }
};

// Get low stock items
exports.getLowStock = async (req, res) => {
  try {
    const items = await Item.find({
      $expr: { $lte: ['$quantity', '$low_stock_threshold'] }
    }).sort({ quantity: 1 });

    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get low stock items'
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
        message: 'Items array is required'
      });
    }

    // Set defaults for each item
    const itemsWithDefaults = items.map(item => ({
      ...item,
      quantity: item.quantity || 0,
      available_quantity: item.available_quantity || item.quantity || 0,
      low_stock_threshold: item.low_stock_threshold || 10,
      status: item.status || 'active'
    }));

    const createdItems = await Item.insertMany(itemsWithDefaults);

    res.status(201).json({
      success: true,
      data: createdItems
    });
  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk create items'
    });
  }
};
