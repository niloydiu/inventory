const { Maintenance, Item, User } = require('../models');

// Get all maintenance records
exports.getAllMaintenance = async (req, res) => {
  try {
    const { item_id, status, priority } = req.query;
    
    const filter = {};
    if (item_id) filter.item_id = item_id;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const records = await Maintenance.find(filter)
      .populate('item_id', 'name category')
      .populate('technician_id', 'username full_name')
      .sort({ scheduled_date: -1 });

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get maintenance records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get maintenance records'
    });
  }
};

// Get upcoming maintenance
exports.getUpcomingMaintenance = async (req, res) => {
  try {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30); // Next 30 days

    const records = await Maintenance.find({
      status: { $in: ['scheduled', 'in_progress'] },
      scheduled_date: { $gte: now, $lte: futureDate }
    })
      .populate('item_id', 'name category')
      .populate('technician_id', 'username full_name')
      .sort({ scheduled_date: 1 });

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get upcoming maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get upcoming maintenance'
    });
  }
};

// Get single maintenance record
exports.getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Maintenance.findById(id)
      .populate('item_id', 'name category')
      .populate('technician_id', 'username full_name email');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Get maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get maintenance record'
    });
  }
};

// Create maintenance record
exports.createMaintenance = async (req, res) => {
  try {
    const maintenanceData = req.body;

    const record = await Maintenance.create(maintenanceData);
    
    await record.populate([
      { path: 'item_id', select: 'name category' },
      { path: 'technician_id', select: 'username full_name' }
    ]);

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Create maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create maintenance record'
    });
  }
};

// Update maintenance record
exports.updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Auto-set completed date if status is completed
    if (updateData.status === 'completed' && !updateData.completed_date) {
      updateData.completed_date = new Date();
    }

    const record = await Maintenance.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'item_id', select: 'name category' },
      { path: 'technician_id', select: 'username full_name' }
    ]);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Update maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance record'
    });
  }
};

// Delete maintenance record
exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Maintenance.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      });
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Delete maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete maintenance record'
    });
  }
};
