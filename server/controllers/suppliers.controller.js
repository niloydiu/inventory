const Supplier = require("../models/Supplier");
const { validationResult } = require("express-validator");

// Get all suppliers with pagination and filtering
exports.getAllSuppliers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sort = "-created_at",
    } = req.query;

    const query = {};

    // Search by name, code, email, or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { supplier_code: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [suppliers, total] = await Promise.all([
      Supplier.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Supplier.countDocuments(query),
    ]);

    res.json({
      suppliers,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("[Suppliers Controller] Error getting suppliers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single supplier by ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json(supplier);
  } catch (error) {
    console.error("[Suppliers Controller] Error getting supplier:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new supplier
exports.createSupplier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if supplier code already exists
    if (req.body.supplier_code) {
      const existing = await Supplier.findOne({
        supplier_code: req.body.supplier_code,
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Supplier code already exists" });
      }
    }

    const supplier = new Supplier({
      ...req.body,
      created_by: req.user.userId,
    });

    await supplier.save();

    res.status(201).json({
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    console.error("[Suppliers Controller] Error creating supplier:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if supplier code is being changed and if it already exists
    if (req.body.supplier_code) {
      const existing = await Supplier.findOne({
        supplier_code: req.body.supplier_code,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Supplier code already exists" });
      }
    }

    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_by: req.user.userId },
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json({
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error) {
    console.error("[Suppliers Controller] Error updating supplier:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("[Suppliers Controller] Error deleting supplier:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get supplier statistics
exports.getSupplierStats = async (req, res) => {
  try {
    const [total, active, inactive] = await Promise.all([
      Supplier.countDocuments(),
      Supplier.countDocuments({ status: "active" }),
      Supplier.countDocuments({ status: "inactive" }),
    ]);

    const topSuppliers = await Supplier.find({ status: "active" })
      .sort("-rating")
      .limit(5)
      .select("name supplier_code rating email phone")
      .lean();

    res.json({
      stats: {
        total,
        active,
        inactive,
        blocked: total - active - inactive,
      },
      top_suppliers: topSuppliers,
    });
  } catch (error) {
    console.error("[Suppliers Controller] Error getting stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
