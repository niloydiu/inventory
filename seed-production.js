require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./server/config/database");
const {
  upsertAdminUser,
  generateRandomAdminPassword,
} = require("./server/utils/admin-account");

const DEFAULT_EMAIL = "admin@inventory.app";
const DEFAULT_USERNAME = "admin";

const parseArgument = (index) => {
  const arg = process.argv[index];
  return arg && arg.trim().length ? arg.trim() : undefined;
};

const getAdminInputs = () => {
  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;
  const username = parseArgument(2) || envUsername || DEFAULT_USERNAME;
  const password =
    parseArgument(3) || envPassword || generateRandomAdminPassword();
  const email = parseArgument(4) || process.env.ADMIN_EMAIL || DEFAULT_EMAIL;
  const fullName =
    parseArgument(5) || process.env.ADMIN_FULL_NAME || "System Administrator";

  return { username, password, email, fullName };
};

const summarize = ({ username, password, email, result, fromEnvPassword }) => {
  console.log("\n✅ Production admin seeding complete");
  console.log("----------------------------------");
  console.log(`Username: ${username}`);
  if (fromEnvPassword) {
    console.log("Password: (read from ADMIN_PASSWORD environment variable)");
  } else {
    console.log(`Password: ${password}`);
  }
  console.log(`Email: ${email}`);
  console.log(`Status: ${result.isNew ? "created" : "updated"}`);
  console.log(`Security: ${result.updatedFields.length ? result.updatedFields.join(", ") : "kept"}`);
};

(async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDB();

    const { username, password, email, fullName } = getAdminInputs();
    const fromEnvPassword = Boolean(process.env.ADMIN_PASSWORD) && !parseArgument(3);

    const result = await upsertAdminUser({
      username,
      password,
      email,
      full_name: fullName,
      resetSecurity: true,
    });

    await mongoose.connection.close();

    summarize({ username, password, email, result, fromEnvPassword });
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed production user:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
})();
