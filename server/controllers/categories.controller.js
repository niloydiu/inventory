const Category = require("../models/Category");
const { validationResult } = require("express-validator");
const { paginatedQuery } = require("../utils/queryHelpers");

// Get all categories (hierarchical tree structure)
exports.getAllCategories = async (req, res) => {
  try {
    const { flat = false, parent_id, page, limit } = req.query;

    // If explicit pagination is requested OR it's a flat list, use pagination
    if (page || limit || flat === 'true') {
       // For flat list or paginated view
       const result = await paginatedQuery(
        Category,
        req.query,
        ['name', 'code', 'description'],
        { path: 'parent_id', select: 'name code path' }
      );
      
      // Add child counts
      const categoriesWithCounts = await Promise.all(
        result.data.map(async (category) => {
          const categoryObj = category.toObject ? category.toObject() : category;
          const childCount = await Category.countDocuments({
            parent_id: category._id,
          });
          return { ...categoryObj, child_count: childCount };
        })
      );

      return res.json({
        success: true,
        ...result,
        data: categoriesWithCounts
      });
    }

    // Original tree/list logic for non-paginated requests (backward compatibility or specific tree view)
    let query = {};

    // If parent_id is provided, get children of that parent
    if (parent_id) {
      query.parent_id = parent_id === "null" ? null : parent_id;
    } else if (flat !== 'true') {
      // If flat is false and no parent_id, get only root categories
      query.parent_id = null;
    }

    const categories = await Category.find(query)
      .populate("parent_id", "name code path")
      .sort("name")
      .lean();

    // If hierarchical, build tree structure
    if (flat !== 'true' && !parent_id) {
      const categoriesWithChildren = await Promise.all(
        categories.map(async (category) => {
          const childCount = await Category.countDocuments({
            parent_id: category._id,
          });
          return { ...category, child_count: childCount };
        })
      );
      return res.json({ categories: categoriesWithChildren });
    }

    res.json({ categories });
  } catch (error) {
    console.error("[Categories Controller] Error getting categories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get category tree
exports.getCategoryTree = async (req, res) => {
  try {
    const buildTree = async (parentId = null) => {
      const categories = await Category.find({ parent_id: parentId })
        .sort("name")
        .lean();

      return Promise.all(
        categories.map(async (category) => {
          const children = await buildTree(category._id);
          return {
            ...category,
            children,
            has_children: children.length > 0,
          };
        })
      );
    };

    const tree = await buildTree();
    res.json({ category_tree: tree });
  } catch (error) {
    console.error("[Categories Controller] Error building tree:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parent_id",
      "name code path"
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Get children count
    const childCount = await Category.countDocuments({
      parent_id: category._id,
    });

    // Get items count (you'll need to add this when you integrate with items)
    const Item = require("../models/Item");
    const itemCount = await Item.countDocuments({ category_id: category._id });

    res.json({
      ...category.toObject(),
      child_count: childCount,
      item_count: itemCount,
    });
  } catch (error) {
    console.error("[Categories Controller] Error getting category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if code already exists
    if (req.body.code) {
      const existing = await Category.findOne({ code: req.body.code });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Category code already exists" });
      }
    }

    const category = new Category({
      ...req.body,
      created_by: req.user.user_id,
    });

    await category.save();

    await category.populate("parent_id", "name code path");

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("[Categories Controller] Error creating category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if code is being changed and already exists
    if (req.body.code) {
      const existing = await Category.findOne({
        code: req.body.code,
        _id: { $ne: req.params.id },
      });
      if (existing) {
        return res
          .status(400)
          .json({ message: "Category code already exists" });
      }
    }

    // Prevent setting parent to self or descendant
    if (req.body.parent_id) {
      if (req.body.parent_id === req.params.id) {
        return res
          .status(400)
          .json({ message: "Category cannot be its own parent" });
      }

      // Check if new parent is a descendant
      const checkDescendant = async (categoryId, potentialParentId) => {
        const cat = await Category.findById(potentialParentId);
        if (!cat) return false;
        if (!cat.parent_id) return false;
        if (cat.parent_id.toString() === categoryId) return true;
        return checkDescendant(categoryId, cat.parent_id);
      };

      const isDescendant = await checkDescendant(
        req.params.id,
        req.body.parent_id
      );
      if (isDescendant) {
        return res.status(400).json({
          message: "Cannot set a descendant category as parent",
        });
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_by: req.user.user_id },
      { new: true, runValidators: true }
    ).populate("parent_id", "name code path");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("[Categories Controller] Error updating category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    // Check if category has children
    const childCount = await Category.countDocuments({
      parent_id: req.params.id,
    });
    if (childCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category with child categories. Delete children first.",
      });
    }

    // Check if category has items
    const Item = require("../models/Item");
    const itemCount = await Item.countDocuments({ category_id: req.params.id });
    if (itemCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category with ${itemCount} items. Reassign or delete items first.`,
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("[Categories Controller] Error deleting category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get category statistics
exports.getCategoryStats = async (req, res) => {
  try {
    const Item = require("../models/Item");

    const [totalCategories, rootCategories] = await Promise.all([
      Category.countDocuments(),
      Category.countDocuments({ parent_id: null }),
    ]);

    // Get categories with item counts
    const categoriesWithItems = await Category.aggregate([
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "category_id",
          as: "items",
        },
      },
      {
        $project: {
          name: 1,
          code: 1,
          item_count: { $size: "$items" },
        },
      },
      { $sort: { item_count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      stats: {
        total_categories: totalCategories,
        root_categories: rootCategories,
      },
      top_categories: categoriesWithItems,
    });
  } catch (error) {
    console.error("[Categories Controller] Error getting stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
