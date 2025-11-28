const { Feed } = require('../models');

// Helper function to map backend types to frontend types
function getFrontendType(backendType) {
  const reverseMapping = {
    'Grain': 'Cattle Feed',
    'Concentrate': 'Poultry Feed',
    'Supplement': 'Supplement',
    'Other': 'Other',
    'Hay': 'Other',
    'Silage': 'Other',
    'Mineral': 'Supplement'
  };
  return reverseMapping[backendType] || 'Other';
}

// Get all feeds
exports.getAllFeeds = async (req, res) => {
  try {
    const { type } = req.query;
    
    const filter = {};

    if (type) {
      filter.type = type;
    }

    const feeds = await Feed.find(filter).sort({ createdAt: -1 });

    // Transform all feeds to frontend format
    const transformedFeeds = feeds.map(feed => ({
      ...feed.toObject(),
      feed_type: getFrontendType(feed.type),
      unit_type: feed.unit,
      cost_price: feed.cost_per_unit || 0,
      unit_price: 0,
      minimum_level: feed.low_stock_threshold || 0,
      alert_enabled: true,
      description: feed.notes || '',
      supplier_name: feed.supplier || '',
      production_date: feed.purchase_date
    }));

    res.json({
      success: true,
      data: transformedFeeds
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

    // Transform to frontend format
    const transformedFeed = {
      ...feed.toObject(),
      feed_type: getFrontendType(feed.type),
      unit_type: feed.unit,
      cost_price: feed.cost_per_unit || 0,
      unit_price: 0,
      minimum_level: feed.low_stock_threshold || 0,
      alert_enabled: true,
      description: feed.notes || '',
      supplier_name: feed.supplier || '',
      production_date: feed.purchase_date
    };

    res.json({
      success: true,
      data: transformedFeed
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
    const { 
      name, 
      feed_type, 
      quantity, 
      unit_type, 
      cost_price,
      unit_price,
      minimum_level,
      alert_enabled,
      description,
      production_date,
      expiry_date,
      batch_number,
      supplier_name
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Feed name is required'
      });
    }

    // Map frontend feed types to backend types
    const typeMapping = {
      'Cattle Feed': 'Grain',
      'Poultry Feed': 'Concentrate',
      'Goat Feed': 'Grain',
      'Sheep Feed': 'Grain',
      'Pig Feed': 'Concentrate',
      'Fish Feed': 'Concentrate',
      'Supplement': 'Supplement',
      'Other': 'Other'
    };

    const mappedType = typeMapping[feed_type] || 'Other';

    const feedData = {
      name,
      type: mappedType,
      quantity: Number(quantity) || 0,
      unit: unit_type || 'kg',
      cost_per_unit: Number(cost_price) || 0,
      low_stock_threshold: Number(minimum_level) || 0,
      supplier: supplier_name || '',
      notes: description || '',
      batch_number: batch_number || '',
    };

    // Add dates if provided
    if (production_date) {
      feedData.purchase_date = new Date(production_date);
    }
    
    if (expiry_date) {
      feedData.expiry_date = new Date(expiry_date);
    }

    const feed = await Feed.create(feedData);

    res.status(201).json({
      success: true,
      data: feed
    });
  } catch (error) {
    console.error('Create feed error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
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
    const { 
      name, 
      feed_type, 
      quantity, 
      unit_type, 
      cost_price,
      unit_price,
      minimum_level,
      alert_enabled,
      description,
      production_date,
      expiry_date,
      batch_number,
      supplier_name
    } = req.body;

    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    
    if (feed_type !== undefined) {
      // Map frontend feed types to backend types
      const typeMapping = {
        'Cattle Feed': 'Grain',
        'Poultry Feed': 'Concentrate',
        'Goat Feed': 'Grain',
        'Sheep Feed': 'Grain',
        'Pig Feed': 'Concentrate',
        'Fish Feed': 'Concentrate',
        'Supplement': 'Supplement',
        'Other': 'Other'
      };
      updateData.type = typeMapping[feed_type] || 'Other';
    }
    
    if (quantity !== undefined) updateData.quantity = Number(quantity);
    if (unit_type !== undefined) updateData.unit = unit_type;
    if (cost_price !== undefined) updateData.cost_per_unit = Number(cost_price);
    if (minimum_level !== undefined) updateData.low_stock_threshold = Number(minimum_level);
    if (supplier_name !== undefined) updateData.supplier = supplier_name;
    if (description !== undefined) updateData.notes = description;
    if (batch_number !== undefined) updateData.batch_number = batch_number;
    
    if (production_date !== undefined) {
      updateData.purchase_date = production_date ? new Date(production_date) : null;
    }
    
    if (expiry_date !== undefined) {
      updateData.expiry_date = expiry_date ? new Date(expiry_date) : null;
    }

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

    // Transform back to frontend format
    const transformedFeed = {
      ...feed.toObject(),
      feed_type: getFrontendType(feed.type),
      unit_type: feed.unit,
      cost_price: feed.cost_per_unit,
      unit_price: 0,
      minimum_level: feed.low_stock_threshold,
      alert_enabled: true,
      description: feed.notes,
      supplier_name: feed.supplier,
      production_date: feed.purchase_date
    };

    res.json({
      success: true,
      data: transformedFeed
    });
  } catch (error) {
    console.error('Update feed error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
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
