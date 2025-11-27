require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const {
  User,
  Item,
  Location,
  Livestock,
  Feed,
  Assignment,
} = require('./models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting comprehensive database seed...\n');

    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      Location.deleteMany({}),
      Livestock.deleteMany({}),
      Feed.deleteMany({}),
      Assignment.deleteMany({}),
    ]);
    console.log('✅ Existing data cleared\n');

    // Create Users
    console.log('👥 Creating users...');
    const password_hash = await bcrypt.hash('password123', 10);

    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@inventory.com',
        password_hash: await bcrypt.hash('admin123', 10),
        full_name: 'System Administrator',
        role: 'admin',
        is_active: true,
      },
      {
        username: 'john_manager',
        email: 'john@inventory.com',
        password_hash,
        full_name: 'John Smith',
        role: 'manager',
        is_active: true,
      },
      {
        username: 'sarah_employee',
        email: 'sarah@inventory.com',
        password_hash,
        full_name: 'Sarah Johnson',
        role: 'employee',
        is_active: true,
      },
      {
        username: 'mike_employee',
        email: 'mike@inventory.com',
        password_hash,
        full_name: 'Mike Davis',
        role: 'employee',
        is_active: true,
      },
      {
        username: 'emma_manager',
        email: 'emma@inventory.com',
        password_hash,
        full_name: 'Emma Wilson',
        role: 'manager',
        is_active: true,
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create Locations
    console.log('📍 Creating locations...');
    const locations = await Location.create([
      {
        name: 'Main Warehouse',
        description: 'Primary storage facility for all inventory',
        type: 'warehouse',
        address: '123 Industrial Blvd, City, State 12345',
        capacity: 10000,
        current_usage: 3500,
        manager_id: users[1]._id,
        status: 'active',
      },
      {
        name: 'Office Building A',
        description: 'Corporate headquarters and administrative offices',
        type: 'office',
        address: '456 Business Ave, City, State 12345',
        capacity: 500,
        current_usage: 200,
        manager_id: users[4]._id,
        status: 'active',
      },
      {
        name: 'Retail Store - Downtown',
        description: 'Main retail location',
        type: 'store',
        address: '789 Main St, City, State 12345',
        capacity: 2000,
        current_usage: 1200,
        manager_id: users[1]._id,
        status: 'active',
      },
      {
        name: 'Distribution Center',
        description: 'Regional distribution hub',
        type: 'warehouse',
        address: '321 Logistics Way, City, State 12345',
        capacity: 15000,
        current_usage: 8500,
        manager_id: users[4]._id,
        status: 'active',
      },
    ]);
    console.log(`✅ Created ${locations.length} locations`);

    // Create Inventory Items
    console.log('📦 Creating inventory items...');
    const items = await Item.create([
      // Electronics
      {
        name: 'Dell Laptop - Latitude 5420',
        description: 'Business laptop with Intel i7, 16GB RAM, 512GB SSD',
        category: 'Electronics',
        quantity: 25,
        available_quantity: 18,
        unit: 'units',
        location: locations[0].name,
        purchase_date: new Date('2024-01-15'),
        purchase_price: 1200,
        warranty_expiry: new Date('2027-01-15'),
        supplier: 'Dell Technologies',
        serial_number: 'DL5420-2024-001',
        barcode: 'DELL5420001',
        low_stock_threshold: 5,
        status: 'active',
      },
      {
        name: 'HP Printer - LaserJet Pro',
        description: 'Black & white laser printer for office use',
        category: 'Electronics',
        quantity: 12,
        available_quantity: 10,
        unit: 'units',
        location: locations[1].name,
        purchase_date: new Date('2024-03-20'),
        purchase_price: 450,
        warranty_expiry: new Date('2026-03-20'),
        supplier: 'HP Inc.',
        serial_number: 'HP-LJ-2024-001',
        barcode: 'HPLJ001',
        low_stock_threshold: 3,
        status: 'active',
      },
      {
        name: 'iPhone 15 Pro',
        description: 'Company mobile device for managers',
        category: 'Electronics',
        quantity: 8,
        available_quantity: 2,
        unit: 'units',
        location: locations[1].name,
        purchase_date: new Date('2024-09-25'),
        purchase_price: 1099,
        warranty_expiry: new Date('2025-09-25'),
        supplier: 'Apple Inc.',
        serial_number: 'IPH15-2024-001',
        barcode: 'APLIPH15001',
        low_stock_threshold: 2,
        status: 'active',
      },

      // Hardware
      {
        name: 'Network Switch - 24 Port',
        description: 'Gigabit ethernet switch for network infrastructure',
        category: 'Hardware',
        quantity: 15,
        available_quantity: 15,
        unit: 'units',
        location: locations[0].name,
        purchase_date: new Date('2024-02-10'),
        purchase_price: 300,
        warranty_expiry: new Date('2029-02-10'),
        supplier: 'Cisco Systems',
        serial_number: 'CSC-SW24-2024',
        barcode: 'CSCSW24001',
        low_stock_threshold: 3,
        status: 'active',
      },
      {
        name: 'UPS Battery Backup - 1500VA',
        description: 'Uninterruptible power supply for server room',
        category: 'Hardware',
        quantity: 20,
        available_quantity: 18,
        unit: 'units',
        location: locations[0].name,
        purchase_date: new Date('2024-04-05'),
        purchase_price: 180,
        warranty_expiry: new Date('2027-04-05'),
        supplier: 'APC by Schneider Electric',
        serial_number: 'APC-UPS-1500-2024',
        barcode: 'APCUPS1500',
        low_stock_threshold: 5,
        status: 'active',
      },

      // Office Supplies
      {
        name: 'Copy Paper - A4 Ream',
        description: 'White 80gsm A4 copy paper, 500 sheets per ream',
        category: 'Office Supplies',
        quantity: 200,
        available_quantity: 200,
        unit: 'reams',
        location: locations[1].name,
        purchase_date: new Date('2024-11-01'),
        purchase_price: 5,
        supplier: 'Office Depot',
        barcode: 'OFDA4001',
        low_stock_threshold: 50,
        status: 'active',
      },
      {
        name: 'Ballpoint Pens - Black',
        description: 'Box of 50 black ballpoint pens',
        category: 'Office Supplies',
        quantity: 30,
        available_quantity: 30,
        unit: 'boxes',
        location: locations[1].name,
        purchase_date: new Date('2024-10-15'),
        purchase_price: 12,
        supplier: 'Staples',
        barcode: 'STPBK50',
        low_stock_threshold: 10,
        status: 'active',
      },
      {
        name: 'Whiteboard Markers - Set of 4',
        description: 'Dry erase markers in assorted colors',
        category: 'Office Supplies',
        quantity: 45,
        available_quantity: 45,
        unit: 'sets',
        location: locations[1].name,
        purchase_date: new Date('2024-10-20'),
        purchase_price: 8,
        supplier: 'Staples',
        barcode: 'STPWBM4',
        low_stock_threshold: 15,
        status: 'active',
      },

      // Furniture
      {
        name: 'Office Chair - Ergonomic',
        description: 'Adjustable ergonomic office chair with lumbar support',
        category: 'Furniture',
        quantity: 50,
        available_quantity: 42,
        unit: 'units',
        location: locations[1].name,
        purchase_date: new Date('2024-01-20'),
        purchase_price: 350,
        warranty_expiry: new Date('2029-01-20'),
        supplier: 'Herman Miller',
        serial_number: 'HM-CHAIR-2024',
        barcode: 'HMCHAIR001',
        low_stock_threshold: 10,
        status: 'active',
      },
      {
        name: 'Standing Desk - Electric',
        description: 'Height-adjustable standing desk with electric motor',
        category: 'Furniture',
        quantity: 30,
        available_quantity: 25,
        unit: 'units',
        location: locations[1].name,
        purchase_date: new Date('2024-02-15'),
        purchase_price: 650,
        warranty_expiry: new Date('2029-02-15'),
        supplier: 'Steelcase',
        serial_number: 'SC-DESK-2024',
        barcode: 'SCDESK001',
        low_stock_threshold: 5,
        status: 'active',
      },
      {
        name: 'Conference Table - 8 Person',
        description: 'Large conference room table with cable management',
        category: 'Furniture',
        quantity: 6,
        available_quantity: 6,
        unit: 'units',
        location: locations[1].name,
        purchase_date: new Date('2024-03-01'),
        purchase_price: 1200,
        warranty_expiry: new Date('2029-03-01'),
        supplier: 'Office Furniture Direct',
        serial_number: 'OFD-TABLE-8',
        barcode: 'OFDTBL8',
        low_stock_threshold: 2,
        status: 'active',
      },

      // Software
      {
        name: 'Microsoft Office 365 License',
        description: 'Annual subscription license for Office 365 Business',
        category: 'Software',
        quantity: 100,
        available_quantity: 85,
        unit: 'licenses',
        location: 'Digital',
        purchase_date: new Date('2024-01-01'),
        purchase_price: 150,
        warranty_expiry: new Date('2025-01-01'),
        supplier: 'Microsoft Corporation',
        serial_number: 'MS-O365-2024',
        barcode: 'MSO365LIC',
        low_stock_threshold: 20,
        status: 'active',
      },
      {
        name: 'Adobe Creative Cloud License',
        description: 'Annual subscription for design team',
        category: 'Software',
        quantity: 15,
        available_quantity: 10,
        unit: 'licenses',
        location: 'Digital',
        purchase_date: new Date('2024-02-01'),
        purchase_price: 600,
        warranty_expiry: new Date('2025-02-01'),
        supplier: 'Adobe Inc.',
        serial_number: 'ADBE-CC-2024',
        barcode: 'ADBECCLIC',
        low_stock_threshold: 3,
        status: 'active',
      },

      // Low Stock Alert Items
      {
        name: 'Toner Cartridge - HP LaserJet',
        description: 'Black toner cartridge replacement',
        category: 'Office Supplies',
        quantity: 4,
        available_quantity: 4,
        unit: 'units',
        location: locations[1].name,
        purchase_date: new Date('2024-09-15'),
        purchase_price: 85,
        supplier: 'HP Inc.',
        barcode: 'HPTNR001',
        low_stock_threshold: 5,
        status: 'active',
      },
    ]);
    console.log(`✅ Created ${items.length} inventory items`);

    // Create Livestock
    console.log('🐄 Creating livestock records...');
    const livestock = await Livestock.create([
      {
        tag_number: 'CTL-001',
        name: 'Bessie',
        species: 'Cattle',
        breed: 'Holstein',
        date_of_birth: new Date('2022-03-15'),
        gender: 'female',
        weight: 650,
        health_status: 'healthy',
        location: 'Barn A - Stall 1',
        purchase_date: new Date('2022-06-01'),
        purchase_price: 1500,
        current_value: 1800,
        status: 'active',
      },
      {
        tag_number: 'CTL-002',
        name: 'Duke',
        species: 'Cattle',
        breed: 'Angus',
        date_of_birth: new Date('2021-08-20'),
        gender: 'male',
        weight: 850,
        health_status: 'healthy',
        location: 'Barn A - Stall 3',
        purchase_date: new Date('2022-01-15'),
        purchase_price: 2000,
        current_value: 2500,
        status: 'active',
      },
      {
        tag_number: 'GT-001',
        name: 'Daisy',
        species: 'Goat',
        breed: 'Boer',
        date_of_birth: new Date('2023-05-10'),
        gender: 'female',
        weight: 45,
        health_status: 'healthy',
        location: 'Barn B - Pen 2',
        purchase_date: new Date('2023-08-01'),
        purchase_price: 300,
        current_value: 350,
        status: 'active',
      },
      {
        tag_number: 'GT-002',
        name: 'Billy',
        species: 'Goat',
        breed: 'Boer',
        date_of_birth: new Date('2023-04-22'),
        gender: 'male',
        weight: 55,
        health_status: 'healthy',
        location: 'Barn B - Pen 1',
        purchase_date: new Date('2023-08-01'),
        purchase_price: 350,
        current_value: 400,
        status: 'active',
      },
      {
        tag_number: 'SHP-001',
        species: 'Sheep',
        breed: 'Merino',
        date_of_birth: new Date('2023-01-15'),
        gender: 'female',
        weight: 65,
        health_status: 'healthy',
        location: 'Barn B - Pen 5',
        purchase_date: new Date('2023-04-01'),
        purchase_price: 200,
        current_value: 250,
        status: 'active',
      },
      {
        tag_number: 'CHK-001',
        species: 'Chicken',
        breed: 'Rhode Island Red',
        date_of_birth: new Date('2024-02-01'),
        gender: 'female',
        weight: 2.5,
        health_status: 'healthy',
        location: 'Coop 1',
        purchase_date: new Date('2024-03-15'),
        purchase_price: 25,
        current_value: 30,
        status: 'active',
      },
      {
        tag_number: 'DK-001',
        species: 'Duck',
        breed: 'Pekin',
        date_of_birth: new Date('2024-04-10'),
        gender: 'male',
        weight: 3.2,
        health_status: 'healthy',
        location: 'Pond Area',
        purchase_date: new Date('2024-05-01'),
        purchase_price: 20,
        current_value: 25,
        status: 'active',
      },
      {
        tag_number: 'CTL-003',
        name: 'Rosie',
        species: 'Cattle',
        breed: 'Jersey',
        date_of_birth: new Date('2023-11-05'),
        gender: 'female',
        weight: 400,
        health_status: 'under_treatment',
        location: 'Barn A - Stall 5',
        purchase_date: new Date('2024-02-15'),
        purchase_price: 1200,
        current_value: 1400,
        notes: 'Minor hoof infection, being treated with antibiotics',
        status: 'active',
      },
    ]);
    console.log(`✅ Created ${livestock.length} livestock records`);

    // Create Feed Inventory
    console.log('🌾 Creating feed inventory...');
    const feeds = await Feed.create([
      {
        name: 'Cattle Feed - Premium Mix',
        type: 'Concentrate',
        quantity: 500,
        unit: 'kg',
        low_stock_threshold: 100,
        cost_per_unit: 1.5,
        supplier: 'AgriSupply Co.',
        purchase_date: new Date('2024-11-01'),
        expiry_date: new Date('2025-05-01'),
        location: 'Feed Storage - Section A',
        batch_number: 'CF-2024-11-001',
        status: 'available',
      },
      {
        name: 'Alfalfa Hay Bales',
        type: 'Hay',
        quantity: 200,
        unit: 'bags',
        low_stock_threshold: 50,
        cost_per_unit: 8,
        supplier: 'Green Valley Farms',
        purchase_date: new Date('2024-10-15'),
        expiry_date: new Date('2025-10-15'),
        location: 'Feed Storage - Section B',
        batch_number: 'HAY-2024-10-001',
        status: 'available',
      },
      {
        name: 'Corn Grain',
        type: 'Grain',
        quantity: 800,
        unit: 'kg',
        low_stock_threshold: 200,
        cost_per_unit: 0.8,
        supplier: 'Midwest Grain Supply',
        purchase_date: new Date('2024-11-10'),
        expiry_date: new Date('2025-11-10'),
        location: 'Feed Storage - Section C',
        batch_number: 'CRN-2024-11-001',
        status: 'available',
      },
      {
        name: 'Poultry Layer Feed',
        type: 'Concentrate',
        quantity: 150,
        unit: 'kg',
        low_stock_threshold: 50,
        cost_per_unit: 1.2,
        supplier: 'AgriSupply Co.',
        purchase_date: new Date('2024-11-15'),
        expiry_date: new Date('2025-05-15'),
        location: 'Feed Storage - Section D',
        batch_number: 'PLF-2024-11-001',
        status: 'available',
      },
      {
        name: 'Mineral Supplement',
        type: 'Mineral',
        quantity: 30,
        unit: 'kg',
        low_stock_threshold: 10,
        cost_per_unit: 5,
        supplier: 'NutriVet',
        purchase_date: new Date('2024-10-01'),
        expiry_date: new Date('2026-10-01'),
        location: 'Feed Storage - Section E',
        batch_number: 'MIN-2024-10-001',
        status: 'available',
      },
      {
        name: 'Soybean Meal',
        type: 'Concentrate',
        quantity: 45,
        unit: 'kg',
        low_stock_threshold: 50,
        cost_per_unit: 2,
        supplier: 'Midwest Grain Supply',
        purchase_date: new Date('2024-09-20'),
        expiry_date: new Date('2025-03-20'),
        location: 'Feed Storage - Section A',
        batch_number: 'SBM-2024-09-001',
        notes: 'Running low, reorder soon',
        status: 'low_stock',
      },
      {
        name: 'Timothy Grass Hay',
        type: 'Hay',
        quantity: 120,
        unit: 'bags',
        low_stock_threshold: 40,
        cost_per_unit: 10,
        supplier: 'Green Valley Farms',
        purchase_date: new Date('2024-11-05'),
        expiry_date: new Date('2025-11-05'),
        location: 'Feed Storage - Section B',
        batch_number: 'TGH-2024-11-001',
        status: 'available',
      },
    ]);
    console.log(`✅ Created ${feeds.length} feed items`);

    // Create Assignments
    console.log('📋 Creating assignments...');
    const assignments = await Assignment.create([
      {
        item_id: items[0]._id, // Dell Laptop
        assigned_to_user_id: users[2]._id, // Sarah
        assigned_by_user_id: users[1]._id, // John (manager)
        quantity: 1,
        assignment_date: new Date('2024-11-01'),
        expected_return_date: new Date('2025-11-01'),
        status: 'assigned',
        condition_at_assignment: 'new',
        notes: 'Assigned for daily work use',
      },
      {
        item_id: items[0]._id, // Dell Laptop
        assigned_to_user_id: users[3]._id, // Mike
        assigned_by_user_id: users[1]._id, // John (manager)
        quantity: 1,
        assignment_date: new Date('2024-11-05'),
        expected_return_date: new Date('2025-11-05'),
        status: 'assigned',
        condition_at_assignment: 'new',
        notes: 'Assigned for project work',
      },
      {
        item_id: items[2]._id, // iPhone 15 Pro
        assigned_to_user_id: users[1]._id, // John
        assigned_by_user_id: users[0]._id, // Admin
        quantity: 1,
        assignment_date: new Date('2024-10-01'),
        expected_return_date: new Date('2025-10-01'),
        status: 'assigned',
        condition_at_assignment: 'new',
        notes: 'Manager mobile device',
      },
      {
        item_id: items[2]._id, // iPhone 15 Pro
        assigned_to_user_id: users[4]._id, // Emma
        assigned_by_user_id: users[0]._id, // Admin
        quantity: 1,
        assignment_date: new Date('2024-10-01'),
        expected_return_date: new Date('2025-10-01'),
        status: 'assigned',
        condition_at_assignment: 'new',
        notes: 'Manager mobile device',
      },
      {
        item_id: items[8]._id, // Office Chair
        assigned_to_user_id: users[2]._id, // Sarah
        assigned_by_user_id: users[1]._id, // John
        quantity: 1,
        assignment_date: new Date('2024-02-01'),
        expected_return_date: new Date('2029-02-01'),
        status: 'assigned',
        condition_at_assignment: 'new',
        notes: 'Office workspace furniture',
      },
      {
        item_id: items[9]._id, // Standing Desk
        assigned_to_user_id: users[3]._id, // Mike
        assigned_by_user_id: users[4]._id, // Emma
        quantity: 1,
        assignment_date: new Date('2024-03-15'),
        expected_return_date: new Date('2029-03-15'),
        status: 'assigned',
        condition_at_assignment: 'new',
        notes: 'Ergonomic workspace setup',
      },
      {
        item_id: items[11]._id, // Microsoft Office 365
        assigned_to_user_id: users[2]._id, // Sarah
        assigned_by_user_id: users[0]._id, // Admin
        quantity: 1,
        assignment_date: new Date('2024-01-15'),
        expected_return_date: new Date('2025-01-15'),
        status: 'assigned',
        condition_at_assignment: 'new',
        notes: 'Software license for office productivity',
      },
      // Returned assignment
      {
        item_id: items[0]._id, // Dell Laptop
        assigned_to_user_id: users[3]._id, // Mike
        assigned_by_user_id: users[1]._id, // John
        quantity: 1,
        assignment_date: new Date('2024-08-01'),
        expected_return_date: new Date('2024-11-01'),
        actual_return_date: new Date('2024-10-28'),
        status: 'returned',
        condition_at_assignment: 'good',
        condition_at_return: 'good',
        notes: 'Temporary assignment for project',
        return_notes: 'Returned in good condition, no issues',
      },
    ]);
    console.log(`✅ Created ${assignments.length} assignments`);

    // Summary
    console.log('\n📊 Database Seed Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`👥 Users: ${users.length}`);
    console.log(`📍 Locations: ${locations.length}`);
    console.log(`📦 Inventory Items: ${items.length}`);
    console.log(`🐄 Livestock: ${livestock.length}`);
    console.log(`🌾 Feed Items: ${feeds.length}`);
    console.log(`📋 Assignments: ${assignments.length}`);
    console.log('═══════════════════════════════════════\n');

    console.log('🔑 Login Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  Email: admin@inventory.com\n');
    console.log('Managers:');
    console.log('  Username: john_manager / emma_manager');
    console.log('  Password: password123\n');
    console.log('Employees:');
    console.log('  Username: sarah_employee / mike_employee');
    console.log('  Password: password123');
    console.log('─────────────────────────────────────\n');

    console.log('✅ Database seeded successfully!');
    console.log('🎉 You can now login and explore the inventory system.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
