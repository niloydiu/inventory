require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const { User } = require('./models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await connectDB();

    // Check if admin user exists
    const existingAdmin = await User.findOne({ username: 'admin' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    // Create admin user
    const password_hash = await bcrypt.hash('admin123', 10);

    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@inventory.com',
      password_hash,
      full_name: 'System Administrator',
      role: 'admin',
      is_active: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@inventory.com');
    console.log('   Role: admin');
    console.log('\n🎉 Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
