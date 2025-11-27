require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const { User, Item, Feed, Livestock, Assignment, AuditLog } = require('./models');

const seedSampleData = async () => {
  try {
    console.log('🌱 Starting sample database seed...');

    await connectDB();

    // Create users (idempotent)
    const ensureUser = async (username, email, password, role, full_name) => {
      let user = await User.findOne({ username });
      if (user) return user;
      const password_hash = await bcrypt.hash(password, 10);
      user = await User.create({ username, email, password_hash, role, full_name, is_active: true });
      return user;
    };

    const admin = await ensureUser('admin', 'admin@inventory.com', 'admin123', 'admin', 'System Administrator');
    const manager = await ensureUser('manager', 'manager@inventory.com', 'manager123', 'manager', 'Inventory Manager');
    const employee = await ensureUser('jdoe', 'jdoe@inventory.com', 'employee123', 'employee', 'John Doe');

    // Create items
    const itemsToCreate = [
      {
        name: 'Dell Latitude 5430',
        description: 'Work laptop',
        category: 'Hardware',
        quantity: 5,
        available_quantity: 4,
        unit: 'units',
        location: 'Main Office',
        purchase_price: 1200,
        supplier: 'Dell',
        serial_number: 'DL-5430-001',
        low_stock_threshold: 2,
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Adjustable chair',
        category: 'Furniture',
        quantity: 10,
        available_quantity: 9,
        unit: 'units',
        location: 'Storage Room A',
        purchase_price: 150,
        supplier: 'OfficeCo',
        low_stock_threshold: 3,
      },
      {
        name: 'HDMI Cable 2m',
        description: 'High speed HDMI cable',
        category: 'Electronics',
        quantity: 25,
        available_quantity: 25,
        unit: 'units',
        location: 'Storage Room B',
        purchase_price: 8,
        supplier: 'Cables Inc',
      },
      {
        name: 'Stapler',
        description: 'Standard stapler',
        category: 'Office Supplies',
        quantity: 50,
        available_quantity: 50,
        unit: 'units',
        location: 'Stationery Cabinet',
        purchase_price: 4,
        supplier: 'Staples',
      },
      {
        name: 'Printer Toner - Black',
        description: 'Toner cartridge',
        category: 'Office Supplies',
        quantity: 8,
        available_quantity: 8,
        unit: 'units',
        location: 'IT Closet',
        purchase_price: 60,
        supplier: 'PrinterSupply',
        low_stock_threshold: 2,
      },
    ];

    const createdItems = [];
    for (const it of itemsToCreate) {
      let existing = await Item.findOne({ name: it.name });
      if (existing) {
        createdItems.push(existing);
        continue;
      }
      const created = await Item.create(it);
      createdItems.push(created);
    }

    // Create feeds
    const feedsToCreate = [
      { name: 'Alfalfa Hay', type: 'Hay', quantity: 200, unit: 'kg', location: 'Barn', cost_per_unit: 0.5, low_stock_threshold: 50 },
      { name: 'Chicken Starter Mash', type: 'Concentrate', quantity: 500, unit: 'kg', location: 'Feed Store', cost_per_unit: 0.3, low_stock_threshold: 100 },
      { name: 'Mineral Supplement', type: 'Supplement', quantity: 100, unit: 'kg', location: 'Feed Store', cost_per_unit: 1.2, low_stock_threshold: 20 },
    ];

    const createdFeeds = [];
    for (const f of feedsToCreate) {
      let existing = await Feed.findOne({ name: f.name });
      if (existing) { createdFeeds.push(existing); continue; }
      const created = await Feed.create(f);
      createdFeeds.push(created);
    }

    // Create livestock
    const livestockToCreate = [
      { tag_number: 'COW-001', name: 'Bessie', species: 'Cattle', breed: 'Local', date_of_birth: new Date('2020-03-10'), gender: 'female', weight: 450, location: 'North Pasture' },
      { tag_number: 'GOAT-002', name: 'Billy', species: 'Goat', breed: 'Boer', date_of_birth: new Date('2022-06-05'), gender: 'male', weight: 60, location: 'East Pen' },
      { tag_number: 'CHICK-003', name: 'Goldie', species: 'Chicken', breed: 'Layer', date_of_birth: new Date('2024-01-20'), gender: 'female', weight: 2, location: 'Poultry Coop' },
    ];

    const createdLivestock = [];
    for (const l of livestockToCreate) {
      let existing = await Livestock.findOne({ tag_number: l.tag_number });
      if (existing) { createdLivestock.push(existing); continue; }
      const created = await Livestock.create(l);
      createdLivestock.push(created);
    }

    // Create assignments (assign first laptop to employee)
    const assignmentsToCreate = [];
    if (createdItems.length > 0) {
      const laptop = createdItems.find(i => i.name && i.name.toLowerCase().includes('dell')) || createdItems[0];
      if (laptop) {
        const exists = await Assignment.findOne({ item_id: laptop._id, assigned_to_user_id: employee._id });
        if (!exists) {
          assignmentsToCreate.push({ item_id: laptop._id, assigned_to_user_id: employee._id, assigned_by_user_id: admin._id, quantity: 1, expected_return_date: new Date(Date.now() + 30*24*60*60*1000), notes: 'Issued for development work' });
        }
      }
    }

    if (assignmentsToCreate.length > 0) {
      for (const a of assignmentsToCreate) {
        await Assignment.create(a);
      }
    }

    // Create a few audit logs
    const auditExists = await AuditLog.findOne({ action: 'seed_sample_data' });
    if (!auditExists) {
      await AuditLog.create({ user_id: admin._id, username: admin.username, action: 'seed_sample_data', entity_type: 'other', details: { message: 'Sample data inserted' } });
    }

    console.log('✅ Sample data seed completed:');
    console.log(`   Users: admin, manager, jdoe`);
    console.log(`   Items: ${createdItems.length}`);
    console.log(`   Feeds: ${createdFeeds.length}`);
    console.log(`   Livestock: ${createdLivestock.length}`);
    console.log('   Assignments: ', assignmentsToCreate.length);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding sample data:', err);
    process.exit(1);
  }
};

seedSampleData();
