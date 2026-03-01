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
})();require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Get MongoDB URI from environment or command line argument
const MONGODB_URI = process.argv[2] || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Error: MongoDB URI is required');
  console.log('Usage: node seed-production.js <mongodb-uri>');
  console.log('Example: node seed-production.js "mongodb+srv://user:pass@cluster.mongodb.net/inventory_db"');
  process.exit(1);
}

console.log('🔄 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  full_name: String,
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function seedProductionDatabase() {
  try {
    console.log('🔍 Checking for existing admin user...');

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@inventory.com';

    const existingAdmin = await User.findOne({ username: adminUsername });

    if (existingAdmin) {
      console.log(`⚠️  Admin user already exists! (${adminUsername})`);
      console.log('   Username:', existingAdmin.username);
      console.log('   Email:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role);

      // If an ADMIN_PASSWORD is provided via env, update the stored password to match
      if (process.env.ADMIN_PASSWORD) {
        const newHashed = await bcrypt.hash(adminPassword, 10);
        // Use password_hash to match application schema
        existingAdmin.password_hash = newHashed;
        if (process.env.ADMIN_EMAIL) existingAdmin.email = adminEmail;
        await existingAdmin.save();
        console.log('\n🔄 Admin password updated from environment variable.');
      }

      console.log('\n✅ Database is already seeded.');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log('📝 Creating admin user...');

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await User.create({
      username: adminUsername,
      email: adminEmail,
      password_hash: hashedPassword,
      role: 'admin',
      full_name: 'System Administrator',
      is_active: true
    });

    console.log('\n✅ Production database seeded successfully!');
    console.log('\n📋 Admin User Details:');
    console.log('   Username:', adminUsername);
    if (process.env.ADMIN_PASSWORD) {
      console.log('   Password: (from ADMIN_PASSWORD env)');
    } else {
      console.log('   Password: admin123');
    }
    console.log('   Email:', adminEmail);
    console.log('   Role: admin');
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');

    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedProductionDatabase();
