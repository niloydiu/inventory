const { Approval, User, Item } = require('../models');

// Get all approval requests
exports.getAllApprovals = async (req, res) => {
  try {
    const { status, request_type } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (request_type) filter.request_type = request_type;

    const approvals = await Approval.find(filter)
      .populate('requested_by', 'username full_name')
      .populate('approved_by', 'username full_name')
      .populate('related_item_id', 'name category')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      data: approvals
    });
  } catch (error) {
    console.error('Get approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get approvals'
    });
  }
};

// Get pending approvals
exports.getPendingApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find({ status: 'pending' })
      .populate('requested_by', 'username full_name')
      .populate('related_item_id', 'name category')
      .sort({ priority: -1, created_at: 1 });

    res.json({
      success: true,
      data: approvals
    });
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get pending approvals'
    });
  }
};

// Get single approval
exports.getApprovalById = async (req, res) => {
  try {
    const { id } = req.params;

    const approval = await Approval.findById(id)
      .populate('requested_by', 'username full_name email')
      .populate('approved_by', 'username full_name email')
      .populate('related_item_id', 'name category');

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    res.json({
      success: true,
      data: approval
    });
  } catch (error) {
    console.error('Get approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get approval'
    });
  }
};

// Create approval request
exports.createApproval = async (req, res) => {
  try {
    const approvalData = req.body;

    const approval = await Approval.create(approvalData);
    
    await approval.populate([
      { path: 'requested_by', select: 'username full_name' },
      { path: 'related_item_id', select: 'name category' }
    ]);

    res.status(201).json({
      success: true,
      data: approval
    });
  } catch (error) {
    console.error('Create approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create approval request'
    });
  }
};

// Approve request
exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision_notes } = req.body;

    const approval = await Approval.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approved_by: req.user.user_id,
        decision_date: new Date(),
        decision_notes
      },
      { new: true }
    ).populate([
      { path: 'requested_by', select: 'username full_name' },
      { path: 'approved_by', select: 'username full_name' },
      { path: 'related_item_id', select: 'name category' }
    ]);

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    res.json({
      success: true,
      data: approval
    });
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve request'
    });
  }
};

// Reject request
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision_notes } = req.body;

    const approval = await Approval.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        approved_by: req.user.user_id,
        decision_date: new Date(),
        decision_notes
      },
      { new: true }
    ).populate([
      { path: 'requested_by', select: 'username full_name' },
      { path: 'approved_by', select: 'username full_name' },
      { path: 'related_item_id', select: 'name category' }
    ]);

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    res.json({
      success: true,
      data: approval
    });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject request'
    });
  }
};

// Delete approval
exports.deleteApproval = async (req, res) => {
  try {
    const { id } = req.params;

    const approval = await Approval.findByIdAndDelete(id);

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found'
      });
    }

    res.json({
      success: true,
      data: approval
    });
  } catch (error) {
    console.error('Delete approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete approval'
    });
  }
};
