const { Location, User } = require('../models');
const { paginatedQuery } = require('../utils/queryHelpers');

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const result = await paginatedQuery(
      Location,
      req.query,
      ['name', 'code', 'description', 'type'],
      { path: 'manager_id', select: 'username full_name' }
    );

    res.json({
      success: true,
      ...result
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
    console.log('[Locations Controller] Create location called');
    console.log('[Locations Controller] req.user:', req.user);
    console.log('[Locations Controller] req.body:', req.body);
    
    const locationData = { ...req.body };
    
    console.log('[Locations Controller] locationData before code generation:', locationData);
    
    // Auto-generate code from name if not provided
    if (!locationData.code) {
      console.log('[Locations Controller] Generating code for location:', locationData.name);
      
      let baseCode = locationData.name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '') // Remove non-alphanumeric
        .substring(0, 8); // Limit to 8 chars
      
      console.log('[Locations Controller] Base code:', baseCode);
      
      // Ensure uniqueness by appending a number if needed
      let code = baseCode;
      let counter = 1;
      
      while (await Location.findOne({ code })) {
        console.log('[Locations Controller] Code conflict, trying:', code);
        code = baseCode + String(counter).padStart(2, '0');
        counter++;
      }
      
      locationData.code = code;
      console.log('[Locations Controller] Final generated code:', code);
    }

    console.log('[Locations Controller] locationData after code generation:', locationData);

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
