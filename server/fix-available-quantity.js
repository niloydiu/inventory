#!/usr/bin/env node

/**
 * Fix available_quantity for existing items in the database
 * This script ensures all items have available_quantity properly set
 */

require("dotenv").config();
const mongoose = require("mongoose");
const { Item } = require("./models");

async function fixAvailableQuantity() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/inventory"
    );
    console.log("Connected to MongoDB");

    // Find all items where available_quantity is not set or is null/undefined
    const itemsToFix = await Item.find({
      $or: [
        { available_quantity: { $exists: false } },
        { available_quantity: null },
      ],
    });

    console.log(`Found ${itemsToFix.length} items to fix`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const item of itemsToFix) {
      try {
        // Calculate available_quantity based on quantity and reserved_quantity
        const reservedQty = item.reserved_quantity || 0;
        const availableQty = (item.quantity || 0) - reservedQty;

        item.available_quantity = Math.max(0, availableQty);
        await item.save();

        console.log(
          `Fixed item ${item._id} (${item.name}): quantity=${item.quantity}, reserved=${reservedQty}, available=${item.available_quantity}`
        );
        fixedCount++;
      } catch (error) {
        console.error(`Failed to fix item ${item._id}:`, error.message);
        skippedCount++;
      }
    }

    // Also fix items where available_quantity is 0 but quantity > 0 and reserved_quantity is 0 or undefined
    const itemsWithZeroAvailable = await Item.find({
      available_quantity: 0,
      quantity: { $gt: 0 },
      $or: [
        { reserved_quantity: 0 },
        { reserved_quantity: { $exists: false } },
        { reserved_quantity: null },
      ],
    });

    console.log(
      `\nFound ${itemsWithZeroAvailable.length} items with zero available but positive quantity`
    );

    for (const item of itemsWithZeroAvailable) {
      try {
        const oldAvailable = item.available_quantity;
        item.available_quantity = item.quantity;
        await item.save();

        console.log(
          `Fixed item ${item._id} (${item.name}): available changed from ${oldAvailable} to ${item.available_quantity}`
        );
        fixedCount++;
      } catch (error) {
        console.error(`Failed to fix item ${item._id}:`, error.message);
        skippedCount++;
      }
    }

    console.log("\n=== Summary ===");
    console.log(`Total items fixed: ${fixedCount}`);
    console.log(`Items skipped due to errors: ${skippedCount}`);

    // Display some statistics
    const stats = await Item.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalAvailable: { $sum: "$available_quantity" },
          totalReserved: { $sum: "$reserved_quantity" },
        },
      },
    ]);

    if (stats.length > 0) {
      console.log("\n=== Inventory Statistics ===");
      console.log(`Total items: ${stats[0].totalItems}`);
      console.log(`Total quantity: ${stats[0].totalQuantity}`);
      console.log(`Total available: ${stats[0].totalAvailable}`);
      console.log(`Total reserved: ${stats[0].totalReserved}`);
    }

    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the fix
fixAvailableQuantity();
