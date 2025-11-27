const { Reservation, Item, User } = require('../models');

// Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const { user_id, item_id, status } = req.query;
    
    const filter = {};
    if (user_id) filter.user_id = user_id;
    if (item_id) filter.item_id = item_id;
    if (status) filter.status = status;

    const reservations = await Reservation.find(filter)
      .populate('item_id', 'name category')
      .populate('user_id', 'username full_name')
      .sort({ start_date: -1 });

    res.json({
      success: true,
      data: reservations
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reservations'
    });
  }
};

// Get single reservation
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id)
      .populate('item_id', 'name category quantity')
      .populate('user_id', 'username full_name email');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reservation'
    });
  }
};

// Create reservation
exports.createReservation = async (req, res) => {
  try {
    const reservationData = req.body;

    // Validate dates
    const startDate = new Date(reservationData.start_date);
    const endDate = new Date(reservationData.end_date);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Check item availability
    const item = await Item.findById(reservationData.item_id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.available_quantity < reservationData.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient quantity available'
      });
    }

    const reservation = await Reservation.create(reservationData);
    
    await reservation.populate([
      { path: 'item_id', select: 'name category' },
      { path: 'user_id', select: 'username full_name' }
    ]);

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reservation'
    });
  }
};

// Update reservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'item_id', select: 'name category' },
      { path: 'user_id', select: 'username full_name' }
    ]);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reservation'
    });
  }
};

// Delete reservation
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reservation'
    });
  }
};
