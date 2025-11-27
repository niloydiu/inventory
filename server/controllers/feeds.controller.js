const { Feed } = require('../models');

// Get all feeds
exports.getAllFeeds = async (req, res) => {
  try {
    const { type } = req.query;
    
    const filter = {};

    if (type) {
      filter.type = type;
    }

    const feeds = await Feed.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: feeds
    });
  } catch (error) {
    console.error('Get feeds error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feeds'
    });
  }
};

// Get single feed
exports.getFeedById = async (req, res) => {
  try {
    const { id } = req.params;

    const feed = await Feed.findById(id);

    if (!feed) {
      return res.status(404).json({
        success: false,
        message: 'Feed not found'
      });
    }

    res.json({
      success: true,
      data: feed
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feed'
    });
  }
};

// Create feed
exports.createFeed = async (req, res) => {
  try {
    const { name, type, quantity, unit, expiry_date, batch_number, supplier, cost_price, selling_price, sku, location } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Feed name is required'
      });
    }

    const feed = await Feed.create({
      name,
      type,
      quantity,
      unit,
      expiry_date,
      batch_number,
      supplier,
      cost_price,
      selling_price,
      sku,
      location
    });

    res.status(201).json({
      success: true,
      data: feed
    });
  } catch (error) {
    console.error('Create feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create feed'
    });
  }
};

// Update feed
exports.updateFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, quantity, unit, expiry_date, batch_number, supplier, cost_price, selling_price, sku, location } = req.body;

    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (unit !== undefined) updateData.unit = unit;
    if (expiry_date !== undefined) updateData.expiry_date = expiry_date;
    if (batch_number !== undefined) updateData.batch_number = batch_number;
    if (supplier !== undefined) updateData.supplier = supplier;
    if (cost_price !== undefined) updateData.cost_price = cost_price;
    if (selling_price !== undefined) updateData.selling_price = selling_price;
    if (sku !== undefined) updateData.sku = sku;
    if (location !== undefined) updateData.location = location;

    const feed = await Feed.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!feed) {
      return res.status(404).json({
        success: false,
        message: 'Feed not found'
      });
    }

    res.json({
      success: true,
      data: feed
    });
  } catch (error) {
    console.error('Update feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feed'
    });
  }
};

// Delete feed
exports.deleteFeed = async (req, res) => {
  try {
    const { id } = req.params;

    const feed = await Feed.findByIdAndDelete(id);

    if (!feed) {
      return res.status(404).json({
        success: false,
        message: 'Feed not found'
      });
    }

    res.json({
      success: true,
      data: feed
    });
  } catch (error) {
    console.error('Delete feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feed'
    });
  }
};
