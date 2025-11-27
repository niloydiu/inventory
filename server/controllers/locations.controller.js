const { Location, User } = require('../models');

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const { type, status } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const locations = await Location.find(filter)
      .populate('manager_id', 'username full_name')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get locations'
    });
  }
};

// Get single location
exports.getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findById(id)
      .populate('manager_id', 'username full_name email');

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get location'
    });
  }
};

// Create location
exports.createLocation = async (req, res) => {
  try {
    const locationData = req.body;

    const location = await Location.create(locationData);
    
    await location.populate('manager_id', 'username full_name');

    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create location'
    });
  }
};

// Update location
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const location = await Location.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('manager_id', 'username full_name');

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location'
    });
  }
};

// Delete location
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete location'
    });
  }
};
