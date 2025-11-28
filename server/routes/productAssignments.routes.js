const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/productAssignments.controller");
const { authenticate } = require("../middleware/auth");

// All routes require authentication
router.use(authenticate);

// Get all assignments with pagination and filters
router.get("/", assignmentController.getAllAssignments);

// Get assignment statistics
router.get("/stats", assignmentController.getAssignmentStats);

// Get overdue assignments
router.get("/overdue", assignmentController.getOverdueAssignments);

// Get active assignments for specific employee
router.get(
  "/employee/:employeeId",
  assignmentController.getEmployeeAssignments
);

// Get single assignment
router.get("/:id", assignmentController.getAssignmentById);

// Create new assignment
router.post("/", assignmentController.createAssignment);

// Update assignment
router.put("/:id", assignmentController.updateAssignment);

// Employee acknowledgment
router.post("/:id/acknowledge", assignmentController.acknowledgeAssignment);

// Return product
router.post("/:id/return", assignmentController.returnProduct);

// Delete assignment (admin only)
router.delete("/:id", assignmentController.deleteAssignment);

module.exports = router;
