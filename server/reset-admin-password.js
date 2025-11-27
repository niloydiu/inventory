require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/database");
const { User } = require("./models");

const resetAdminPassword = async () => {
  try {
    console.log("🔐 Resetting admin password...");

    // Connect to MongoDB
    await connectDB();

    // Hash new password
    const password_hash = await bcrypt.hash("admin123", 10);

    // Update admin user
    const result = await User.updateOne(
      { username: "admin" },
      {
        $set: {
          password_hash,
          is_active: true,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log("✅ Admin password reset successfully!");
      console.log("   Username: admin");
      console.log("   Password: admin123");
    } else {
      console.log("⚠️  No admin user found or password already correct");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    process.exit(1);
  }
};

resetAdminPassword();
