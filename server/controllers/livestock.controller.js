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
    const { 
      name,
      tag_number,
      species,
      breed,
      age,
      gender,
      weight,
      health_status,
      status,
      purchase_price,
      description
    } = req.body;

    // Convert age to birth date if provided
    let date_of_birth = null;
    if (age && !isNaN(age)) {
      const ageInMonths = parseInt(age);
      date_of_birth = new Date();
      date_of_birth.setMonth(date_of_birth.getMonth() - ageInMonths);
    }

    // Map frontend species to backend enum values
    const speciesMapping = {
      "Cow": "Cattle",
      "Cattle": "Cattle",
      "Goat": "Goat", 
      "Sheep": "Sheep",
      "Chicken": "Chicken",
      "Duck": "Duck",
      "Pig": "Other",
      "Buffalo": "Other",
      "Other": "Other"
    };

    const livestockData = {
      name,
      tag_number: tag_number || `LV-${Date.now()}`, // Auto-generate if not provided
      species: speciesMapping[species] || 'Other',
      breed,
      date_of_birth,
      gender: gender ? gender.toLowerCase() : 'male',
      weight: weight ? parseFloat(weight) : undefined,
      health_status: health_status || 'healthy',
      purchase_price: purchase_price ? parseFloat(purchase_price) : undefined,
      notes: description,
      created_by: req.user.user_id
    };

    // Remove undefined fields
    Object.keys(livestockData).forEach(key => {
      if (livestockData[key] === undefined || livestockData[key] === '') {
        delete livestockData[key];
      }
    });

    console.log('Creating livestock with data:', livestockData);

    const livestock = await Livestock.create(livestockData);

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
    const { 
      name,
      tag_number,
      species,
      breed,
      age,
      gender,
      weight,
      health_status,
      status,
      purchase_price,
      description
    } = req.body;

    // Convert age to birth date if provided
    let date_of_birth = undefined;
    if (age && !isNaN(age)) {
      const ageInMonths = parseInt(age);
      date_of_birth = new Date();
      date_of_birth.setMonth(date_of_birth.getMonth() - ageInMonths);
    }

    // Map frontend species to backend enum values
    const speciesMapping = {
      "Cow": "Cattle",
      "Cattle": "Cattle",
      "Goat": "Goat", 
      "Sheep": "Sheep",
      "Chicken": "Chicken",
      "Duck": "Duck",
      "Pig": "Other",
      "Buffalo": "Other",
      "Other": "Other"
    };

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (tag_number !== undefined) updateData.tag_number = tag_number;
    if (species !== undefined) updateData.species = speciesMapping[species] || 'Other';
    if (breed !== undefined) updateData.breed = breed;
    if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth;
    if (gender !== undefined) updateData.gender = gender.toLowerCase();
    if (health_status !== undefined) updateData.health_status = health_status;
    if (weight !== undefined) updateData.weight = parseFloat(weight);
    if (purchase_price !== undefined) updateData.purchase_price = parseFloat(purchase_price);
    if (description !== undefined) updateData.notes = description;

    console.log('Updating livestock with data:', updateData);

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
