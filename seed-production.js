require('dotenv').config();
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
    
    const existingAdmin = await User.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('   Username: admin');
      console.log('   Email:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role);
      console.log('\n✅ Database is already seeded.');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log('📝 Creating admin user...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@inventory.com',
      password: hashedPassword,
      role: 'admin',
      full_name: 'System Administrator',
      is_active: true
    });

    console.log('\n✅ Production database seeded successfully!');
    console.log('\n📋 Admin User Details:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@inventory.com');
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
