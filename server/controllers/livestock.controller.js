const { Livestock } = require('../models');

// Get all livestock
exports.getAllLivestock = async (req, res) => {
  try {
    const { species, health_status } = req.query;
    
    const filter = {};

    if (species) {
      filter.species = species;
    }

    if (health_status) {
      filter.health_status = health_status;
    }

    const livestock = await Livestock.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: livestock
    });
  } catch (error) {
    console.error('Get livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get livestock'
    });
  }
};

// Get single livestock
exports.getLivestockById = async (req, res) => {
  try {
    const { id } = req.params;

    const livestock = await Livestock.findById(id);

    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: 'Livestock not found'
      });
    }

    res.json({
      success: true,
      data: livestock
    });
  } catch (error) {
    console.error('Get livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get livestock'
    });
  }
};

// Create livestock
exports.createLivestock = async (req, res) => {
  try {
    const { tag_number, species, breed, birth_date, gender, health_status, location, weight, notes } = req.body;

    if (!tag_number) {
      return res.status(400).json({
        success: false,
        message: 'Tag number is required'
      });
    }

    const livestock = await Livestock.create({
      tag_number,
      species,
      breed,
      birth_date,
      gender,
      health_status: health_status || 'healthy',
      location,
      weight,
      notes
    });

    res.status(201).json({
      success: true,
      data: livestock
    });
  } catch (error) {
    console.error('Create livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create livestock'
    });
  }
};

// Update livestock
exports.updateLivestock = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag_number, species, breed, birth_date, gender, health_status, location, weight, notes } = req.body;

    const updateData = {};
    if (tag_number !== undefined) updateData.tag_number = tag_number;
    if (species !== undefined) updateData.species = species;
    if (breed !== undefined) updateData.breed = breed;
    if (birth_date !== undefined) updateData.birth_date = birth_date;
    if (gender !== undefined) updateData.gender = gender;
    if (health_status !== undefined) updateData.health_status = health_status;
    if (location !== undefined) updateData.location = location;
    if (weight !== undefined) updateData.weight = weight;
    if (notes !== undefined) updateData.notes = notes;

    const livestock = await Livestock.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: 'Livestock not found'
      });
    }

    res.json({
      success: true,
      data: livestock
    });
  } catch (error) {
    console.error('Update livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update livestock'
    });
  }
};

// Delete livestock
exports.deleteLivestock = async (req, res) => {
  try {
    const { id } = req.params;

    const livestock = await Livestock.findByIdAndDelete(id);

    if (!livestock) {
      return res.status(404).json({
        success: false,
        message: 'Livestock not found'
      });
    }

    res.json({
      success: true,
      data: livestock
    });
  } catch (error) {
    console.error('Delete livestock error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete livestock'
    });
  }
};
