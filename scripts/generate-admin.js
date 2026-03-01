require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../server/config/database");
const {
  upsertAdminUser,
  generateRandomAdminPassword,
} = require("../server/utils/admin-account");

const DEFAULT_EMAIL = "admin@inventory.app";
const DEFAULT_USERNAME = "admin";

const getArg = (index) => {
  const value = process.argv[index];
  return value && value.trim() ? value.trim() : undefined;
};

const main = async () => {
  const username =
    getArg(2) || process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
  const email = getArg(3) || process.env.ADMIN_EMAIL || DEFAULT_EMAIL;
  const fullName =
    getArg(4) || process.env.ADMIN_FULL_NAME || "System Administrator";
  const password = getArg(5) || generateRandomAdminPassword();
  let hadConnection = false;

  try {
    console.log("🔒 Connecting to MongoDB to provision admin user...");
    await connectDB();
    hadConnection = true;

    const result = await upsertAdminUser({
      username,
      password,
      email,
      full_name: fullName,
      resetSecurity: true,
    });

    console.log("\n✅ Admin credentials stored in the database");
    console.log("-----------------------------------------");
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Email: ${email}`);
    console.log(`Status: ${result.isNew ? "created" : "rewritten"}`);
    if (result.updatedFields.length) {
      console.log(`Changes: ${result.updatedFields.join(", ")}`);
    }

    console.log(
      "\n📝 TIP: Copy the credentials to your environment file if you plan to reuse them."
    );
  } catch (error) {
    console.error("❌ Failed to generate admin credentials:", error);
    throw error;
  } finally {
    if (hadConnection && mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));