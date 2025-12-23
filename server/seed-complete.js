require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/database");
const mongoose = require("mongoose");

// Import ALL models
const User = require("./models/User");
const Item = require("./models/Item");
const Category = require("./models/Category");
const Location = require("./models/Location");
const Supplier = require("./models/Supplier");
const PurchaseOrder = require("./models/PurchaseOrder");
const Assignment = require("./models/Assignment");
const ProductAssignment = require("./models/ProductAssignment");
const Livestock = require("./models/Livestock");
const Feed = require("./models/Feed");
const Maintenance = require("./models/Maintenance");
const Reservation = require("./models/Reservation");
const Approval = require("./models/Approval");
const StockTransfer = require("./models/StockTransfer");
const StockMovement = require("./models/StockMovement");
const StockAdjustment = require("./models/StockAdjustment");
const Notification = require("./models/Notification");
const AuditLog = require("./models/AuditLog");

// Image data
const IMAGES = {
  item_thumbnails: [
    { url: "https://loremflickr.com/400/400/product,packaging?lock=1" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=2" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=3" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=4" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=5" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=6" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=7" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=8" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=9" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=10" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=11" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=12" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=13" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=14" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=15" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=16" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=17" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=18" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=19" },
    { url: "https://loremflickr.com/400/400/product,packaging?lock=20" },
  ],
  categories: [
    { url: "https://loremflickr.com/600/400/agriculture,industry?lock=1001" },
    { url: "https://loremflickr.com/600/400/agriculture,industry?lock=1002" },
    { url: "https://loremflickr.com/600/400/agriculture,industry?lock=1003" },
    { url: "https://loremflickr.com/600/400/agriculture,industry?lock=1004" },
    { url: "https://loremflickr.com/600/400/agriculture,industry?lock=1005" },
  ],
  suppliers: [
    {
      url: "https://ui-avatars.com/api/?name=S1&background=random&size=200&format=png",
    },
    {
      url: "https://ui-avatars.com/api/?name=S2&background=random&size=200&format=png",
    },
    {
      url: "https://ui-avatars.com/api/?name=S3&background=random&size=200&format=png",
    },
    {
      url: "https://ui-avatars.com/api/?name=S4&background=random&size=200&format=png",
    },
    {
      url: "https://ui-avatars.com/api/?name=S5&background=random&size=200&format=png",
    },
  ],
  users: [
    { url: "https://i.pravatar.cc/200?u=2001" },
    { url: "https://i.pravatar.cc/200?u=2002" },
    { url: "https://i.pravatar.cc/200?u=2003" },
    { url: "https://i.pravatar.cc/200?u=2004" },
    { url: "https://i.pravatar.cc/200?u=2005" },
    { url: "https://i.pravatar.cc/200?u=2006" },
    { url: "https://i.pravatar.cc/200?u=2007" },
    { url: "https://i.pravatar.cc/200?u=2008" },
  ],
  livestock: [
    { url: "https://loremflickr.com/800/600/cow,sheep,farm,animal?lock=3001" },
    { url: "https://loremflickr.com/800/600/cow,sheep,farm,animal?lock=3002" },
    { url: "https://loremflickr.com/800/600/cow,sheep,farm,animal?lock=3003" },
    { url: "https://loremflickr.com/800/600/cow,sheep,farm,animal?lock=3004" },
    { url: "https://loremflickr.com/800/600/cow,sheep,farm,animal?lock=3005" },
  ],
  feeds: [
    { url: "https://loremflickr.com/800/600/grain,wheat,corn,sack?lock=4001" },
    { url: "https://loremflickr.com/800/600/grain,wheat,corn,sack?lock=4002" },
    { url: "https://loremflickr.com/800/600/grain,wheat,corn,sack?lock=4003" },
    { url: "https://loremflickr.com/800/600/grain,wheat,corn,sack?lock=4004" },
    { url: "https://loremflickr.com/800/600/grain,wheat,corn,sack?lock=4005" },
  ],
  locations: [
    { url: "https://loremflickr.com/800/600/warehouse,barn,farm?lock=5001" },
    { url: "https://loremflickr.com/800/600/warehouse,barn,farm?lock=5002" },
    { url: "https://loremflickr.com/800/600/warehouse,barn,farm?lock=5003" },
    { url: "https://loremflickr.com/800/600/warehouse,barn,farm?lock=5004" },
    { url: "https://loremflickr.com/800/600/warehouse,barn,farm?lock=5005" },
  ],
  maintenance: [
    { url: "https://loremflickr.com/800/600/tools,mechanic,tractor?lock=6001" },
    { url: "https://loremflickr.com/800/600/tools,mechanic,tractor?lock=6002" },
    { url: "https://loremflickr.com/800/600/tools,mechanic,tractor?lock=6003" },
  ],
  purchase_orders: [
    { url: "https://loremflickr.com/600/800/invoice,paper,document?lock=7001" },
    { url: "https://loremflickr.com/600/800/invoice,paper,document?lock=7002" },
    { url: "https://loremflickr.com/600/800/invoice,paper,document?lock=7003" },
  ],
};

// Helper functions
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const randomPastDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
};

const randomFutureDate = (daysAhead) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  return date;
};

const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDatabase = async () => {
  let retries = 3;

  while (retries > 0) {
    try {
      console.log("🌱 Starting COMPREHENSIVE database seed...\n");

      // Connect to MongoDB with retry
      await connectDB();
      console.log("✅ MongoDB Connected\n");

      // Add a small delay to ensure connection is stable
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Clear ALL existing data
      console.log("🗑️  Clearing existing data...");
      await Promise.all([
        User.deleteMany({}),
        Item.deleteMany({}),
        Category.deleteMany({}),
        Location.deleteMany({}),
        Supplier.deleteMany({}),
        PurchaseOrder.deleteMany({}),
        Assignment.deleteMany({}),
        ProductAssignment.deleteMany({}),
        Livestock.deleteMany({}),
        Feed.deleteMany({}),
        Maintenance.deleteMany({}),
        Reservation.deleteMany({}),
        Approval.deleteMany({}),
        StockTransfer.deleteMany({}),
        StockMovement.deleteMany({}),
        StockAdjustment.deleteMany({}),
        Notification.deleteMany({}),
        AuditLog.deleteMany({}),
      ]);
      console.log("✅ All existing data cleared\n");

      break; // Success, exit retry loop
    } catch (error) {
      retries--;
      console.log(`⚠️  Connection attempt failed. Retries left: ${retries}`);
      if (retries === 0) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  try {
    console.log("👥 Creating users...");
    const password_hash = await bcrypt.hash("admin123", 10);

    const users = await User.create([
      {
        username: "admin",
        email: "admin@farmtech.com",
        password_hash,
        full_name: "Admin User",
        role: "admin",
        is_active: true,
        avatar_url: IMAGES.users[0].url,
      },
      {
        username: "manager1",
        email: "sarah.manager@farmtech.com",
        password_hash,
        full_name: "Sarah Johnson",
        role: "manager",
        is_active: true,
        avatar_url: IMAGES.users[1].url,
      },
      {
        username: "manager2",
        email: "mike.manager@farmtech.com",
        password_hash,
        full_name: "Mike Williams",
        role: "manager",
        is_active: true,
        avatar_url: IMAGES.users[2].url,
      },
      {
        username: "employee1",
        email: "emily.davis@farmtech.com",
        password_hash,
        full_name: "Emily Davis",
        role: "employee",
        is_active: true,
        avatar_url: IMAGES.users[3].url,
      },
      {
        username: "employee2",
        email: "robert.brown@farmtech.com",
        password_hash,
        full_name: "Robert Brown",
        role: "employee",
        is_active: true,
        avatar_url: IMAGES.users[4].url,
      },
      {
        username: "employee3",
        email: "lisa.martinez@farmtech.com",
        password_hash,
        full_name: "Lisa Martinez",
        role: "employee",
        is_active: true,
        avatar_url: IMAGES.users[5].url,
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    const [admin, manager1, manager2, employee1, employee2, employee3] = users;

    // ===================================
    // 2. CREATE CATEGORIES
    // ===================================
    console.log("\n📂 Creating categories...");
    const categories = await Category.create([
      {
        name: "Electronics",
        code: "ELEC",
        description: "Electronic devices and computer equipment",
        image_url: IMAGES.categories[0].url,
        status: "active",
      },
      {
        name: "Hardware",
        code: "HARD",
        description: "Tools and hardware supplies",
        image_url: IMAGES.categories[1].url,
        status: "active",
      },
      {
        name: "Office Supplies",
        code: "OFFICE",
        description: "General office and stationery items",
        image_url: IMAGES.categories[2].url,
        status: "active",
      },
      {
        name: "Furniture",
        code: "FURN",
        description: "Office and farm furniture",
        image_url: IMAGES.categories[3].url,
        status: "active",
      },
      {
        name: "Agriculture",
        code: "AGRI",
        description: "Farming equipment and supplies",
        image_url: IMAGES.categories[4].url,
        status: "active",
      },
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // ===================================
    // 3. CREATE LOCATIONS
    // ===================================
    console.log("\n📍 Creating locations...");
    const locations = await Location.create([
      {
        name: "Main Warehouse",
        code: "WH-001",
        description: "Primary storage facility",
        type: "warehouse",
        address: "1234 Farm Road, Springfield, IL 62701",
        capacity: 5000,
        current_usage: 0,
        manager_id: manager1._id,
        status: "active",
        image_url: IMAGES.locations[0].url,
      },
      {
        name: "North Barn",
        code: "BRN-N",
        description: "Feed storage and livestock shelter",
        type: "facility",
        address: "North Section, Farm Complex",
        capacity: 2000,
        current_usage: 0,
        manager_id: manager2._id,
        status: "active",
        image_url: IMAGES.locations[1].url,
      },
      {
        name: "Equipment Storage",
        code: "WH-EQ",
        description: "Specialized equipment storage",
        type: "warehouse",
        address: "1234 Farm Road, Building B",
        capacity: 1500,
        current_usage: 0,
        manager_id: manager1._id,
        status: "active",
        image_url: IMAGES.locations[2].url,
      },
      {
        name: "Office Building",
        code: "OFF-MAIN",
        description: "Administrative offices",
        type: "office",
        address: "1234 Farm Road, Main Office",
        capacity: 500,
        current_usage: 0,
        manager_id: admin._id,
        status: "active",
        image_url: IMAGES.locations[3].url,
      },
    ]);
    console.log(`✅ Created ${locations.length} locations`);

    // ===================================
    // 4. CREATE SUPPLIERS
    // ===================================
    console.log("\n🏭 Creating suppliers...");
    const suppliers = await Supplier.create([
      {
        name: "Tech Solutions Inc",
        code: "SUP-001",
        contact_person: "John Smith",
        email: "john@techsolutions.com",
        phone: "+1-555-0101",
        address: "123 Tech Street, San Francisco, CA 94105",
        payment_terms: "net_30",
        tax_id: "12-3456789",
        status: "active",
        logo_url: IMAGES.suppliers[0].url,
      },
      {
        name: "Farm Equipment Co",
        code: "SUP-002",
        contact_person: "Jane Doe",
        email: "jane@farmequip.com",
        phone: "+1-555-0102",
        address: "456 Farm Ave, Des Moines, IA 50309",
        payment_terms: "net_30",
        tax_id: "98-7654321",
        status: "active",
        logo_url: IMAGES.suppliers[1].url,
      },
      {
        name: "Office Supplies Plus",
        code: "SUP-003",
        contact_person: "Bob Johnson",
        email: "bob@officesupplies.com",
        phone: "+1-555-0103",
        address: "789 Office Blvd, Chicago, IL 60601",
        payment_terms: "net_30",
        tax_id: "45-6789123",
        status: "active",
        logo_url: IMAGES.suppliers[2].url,
      },
      {
        name: "Hardware Depot",
        code: "SUP-004",
        contact_person: "Alice Brown",
        email: "alice@hardwaredepot.com",
        phone: "+1-555-0104",
        address: "321 Hardware Lane, Denver, CO 80202",
        payment_terms: "net_60",
        tax_id: "78-9123456",
        status: "active",
        logo_url: IMAGES.suppliers[3].url,
      },
    ]);
    console.log(`✅ Created ${suppliers.length} suppliers`);

    // ===================================
    // 5. CREATE ITEMS (sequentially to avoid SKU conflicts)
    // ===================================
    console.log("\n📦 Creating inventory items...");
    const itemsData = [
      {
        name: "Dell OptiPlex Desktop",
        description: "Intel i7, 16GB RAM, 512GB SSD",
        category: categories[0].name,
        category_id: categories[0]._id,
        quantity: 25,
        available_quantity: 18,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(180),
        purchase_price: 1299.99,
        warranty_expiry: randomFutureDate(365),
        supplier: suppliers[0].name,
        serial_number:
          "DT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 5,
        status: "active",
        image_url: IMAGES.item_thumbnails[0].url,
      },
      {
        name: "HP LaserJet Printer",
        description: "Network-enabled monochrome laser printer",
        category: categories[0].name,
        category_id: categories[0]._id,
        quantity: 8,
        available_quantity: 6,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(90),
        purchase_price: 429.99,
        warranty_expiry: randomFutureDate(730),
        supplier: suppliers[0].name,
        serial_number:
          "PR-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 2,
        status: "active",
        image_url: IMAGES.item_thumbnails[1].url,
      },
      {
        name: "Cordless Drill Kit",
        description: "18V lithium-ion cordless drill with battery",
        category: categories[1].name,
        category_id: categories[1]._id,
        quantity: 15,
        available_quantity: 12,
        unit: "kits",
        location: locations[2].name,
        location_id: locations[2]._id,
        purchase_date: randomPastDate(120),
        purchase_price: 149.99,
        warranty_expiry: randomFutureDate(365),
        supplier: suppliers[3].name,
        serial_number:
          "DR-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 5,
        status: "active",
        image_url: IMAGES.item_thumbnails[2].url,
      },
      {
        name: "Office Chair Ergonomic",
        description: "Adjustable ergonomic office chair with lumbar support",
        category: categories[3].name,
        category_id: categories[3]._id,
        quantity: 30,
        available_quantity: 25,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(200),
        purchase_price: 299.99,
        warranty_expiry: randomFutureDate(1095),
        supplier: suppliers[2].name,
        serial_number:
          "CH-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 8,
        status: "active",
        image_url: IMAGES.item_thumbnails[3].url,
      },
      {
        name: "Tractor John Deere 5055E",
        description: "55HP utility tractor with loader",
        category: categories[4].name,
        category_id: categories[4]._id,
        quantity: 3,
        available_quantity: 2,
        unit: "units",
        location: locations[2].name,
        location_id: locations[2]._id,
        purchase_date: randomPastDate(730),
        purchase_price: 45000.0,
        warranty_expiry: randomFutureDate(1095),
        supplier: suppliers[1].name,
        serial_number:
          "TR-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 1,
        status: "active",
        image_url: IMAGES.item_thumbnails[4].url,
      },
      {
        name: "Safety Gloves Heavy Duty",
        description: "Cut-resistant work gloves - Box of 12 pairs",
        category: categories[1].name,
        category_id: categories[1]._id,
        quantity: 50,
        available_quantity: 38,
        unit: "boxes",
        location: locations[0].name,
        location_id: locations[0]._id,
        purchase_date: randomPastDate(60),
        purchase_price: 24.99,
        warranty_expiry: null,
        supplier: suppliers[3].name,
        serial_number:
          "GL-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 15,
        status: "active",
        image_url: IMAGES.item_thumbnails[5].url,
      },
      {
        name: "Laptop Dell Latitude 5520",
        description: "15.6' FHD, i5-1135G7, 8GB RAM, 256GB SSD",
        category: categories[0].name,
        category_id: categories[0]._id,
        quantity: 12,
        available_quantity: 8,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(150),
        purchase_price: 999.99,
        warranty_expiry: randomFutureDate(730),
        supplier: suppliers[0].name,
        serial_number:
          "LT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 3,
        status: "active",
        image_url: IMAGES.item_thumbnails[6].url,
      },
      {
        name: "Whiteboard Large 6x4 ft",
        description: "Magnetic dry erase whiteboard with aluminum frame",
        category: categories[2].name,
        category_id: categories[2]._id,
        quantity: 8,
        available_quantity: 5,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(90),
        purchase_price: 189.99,
        warranty_expiry: randomFutureDate(365),
        supplier: suppliers[2].name,
        serial_number:
          "WB-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 2,
        status: "active",
        image_url: IMAGES.item_thumbnails[7].url,
      },
      {
        name: "Chainsaw Professional Gas",
        description: "20' bar, 50cc 2-stroke engine, safety features",
        category: categories[1].name,
        category_id: categories[1]._id,
        quantity: 5,
        available_quantity: 4,
        unit: "units",
        location: locations[2].name,
        location_id: locations[2]._id,
        purchase_date: randomPastDate(180),
        purchase_price: 349.99,
        warranty_expiry: randomFutureDate(365),
        supplier: suppliers[3].name,
        serial_number:
          "CS-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 2,
        status: "active",
        image_url: IMAGES.item_thumbnails[8].url,
      },
      {
        name: "Paper Copy A4 5000 Sheets",
        description: "Premium white copy paper, 80gsm - 10 reams",
        category: categories[2].name,
        category_id: categories[2]._id,
        quantity: 100,
        available_quantity: 72,
        unit: "boxes",
        location: locations[0].name,
        location_id: locations[0]._id,
        purchase_date: randomPastDate(30),
        purchase_price: 42.99,
        warranty_expiry: null,
        supplier: suppliers[2].name,
        serial_number:
          "PP-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 25,
        status: "active",
        image_url: IMAGES.item_thumbnails[9].url,
      },
    ];

    // Create items sequentially to avoid SKU conflicts
    const items = [];
    for (const itemData of itemsData) {
      const item = await Item.create(itemData);
      items.push(item);
    }
    console.log(`✅ Created ${items.length} items`);

    // ===================================
    // 6. CREATE LIVESTOCK
    // ===================================
    console.log("\n🐄 Creating livestock...");
    const livestock = await Livestock.create([
      {
        tag_number: "CATTLE-001",
        name: "Bessie",
        species: "Cattle",
        breed: "Holstein",
        date_of_birth: new Date("2021-03-15"),
        gender: "female",
        weight: 650,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2021-06-20"),
        purchase_price: 1500.0,
        current_value: 2200.0,
        notes: "Excellent milk producer",
        status: "active",
        image_url: IMAGES.livestock[0].url,
      },
      {
        tag_number: "CATTLE-002",
        name: "Duke",
        species: "Cattle",
        breed: "Angus",
        date_of_birth: new Date("2020-08-10"),
        gender: "male",
        weight: 950,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2021-01-15"),
        purchase_price: 2000.0,
        current_value: 2800.0,
        notes: "Breeding bull",
        status: "active",
        image_url: IMAGES.livestock[1].url,
      },
      {
        tag_number: "SHEEP-001",
        name: "Woolly",
        species: "Sheep",
        breed: "Merino",
        date_of_birth: new Date("2022-04-20"),
        gender: "female",
        weight: 68,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2022-08-15"),
        purchase_price: 280.0,
        current_value: 320.0,
        notes: "Fine wool quality",
        status: "active",
        image_url: IMAGES.livestock[2].url,
      },
      {
        tag_number: "GOAT-001",
        name: "Billy",
        species: "Goat",
        breed: "Nubian",
        date_of_birth: new Date("2022-09-18"),
        gender: "male",
        weight: 82,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2023-01-10"),
        purchase_price: 350.0,
        current_value: 400.0,
        notes: "Good temperament",
        status: "active",
        image_url: IMAGES.livestock[3].url,
      },
      {
        tag_number: "CHICKEN-001",
        name: "Henrietta",
        species: "Chicken",
        breed: "Rhode Island Red",
        date_of_birth: new Date("2024-03-15"),
        gender: "female",
        weight: 2.8,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2024-05-01"),
        purchase_price: 25.0,
        current_value: 30.0,
        notes: "Good layer",
        status: "active",
        image_url: IMAGES.livestock[4].url,
      },
    ]);
    console.log(`✅ Created ${livestock.length} livestock`);

    // ===================================
    // 7. CREATE FEEDS
    // ===================================
    console.log("\n🌾 Creating feeds...");
    const feeds = await Feed.create([
      {
        name: "Premium Cattle Feed",
        type: "Grain",
        quantity: 5000,
        unit: "kg",
        location: locations[1].name,
        purchase_date: randomPastDate(30),
        expiry_date: randomFutureDate(180),
        cost_per_unit: 0.24,
        supplier: suppliers[1].name,
        low_stock_threshold: 1000,
        status: "available",
        notes: "High-protein feed for dairy cattle",
      },
      {
        name: "Chicken Layer Pellets",
        type: "Concentrate",
        quantity: 1000,
        unit: "kg",
        location: locations[1].name,
        purchase_date: randomPastDate(20),
        expiry_date: randomFutureDate(120),
        cost_per_unit: 0.45,
        supplier: suppliers[1].name,
        low_stock_threshold: 200,
        status: "available",
        notes: "Nutritionally balanced feed for egg-laying chickens",
      },
      {
        name: "Alfalfa Hay Bales",
        type: "Hay",
        quantity: 200,
        unit: "bags",
        location: locations[1].name,
        purchase_date: randomPastDate(45),
        expiry_date: randomFutureDate(365),
        cost_per_unit: 4.0,
        supplier: suppliers[1].name,
        low_stock_threshold: 50,
        status: "available",
        notes: "Premium quality alfalfa hay",
      },
      {
        name: "Sheep Mineral Mix",
        type: "Mineral",
        quantity: 500,
        unit: "kg",
        location: locations[1].name,
        purchase_date: randomPastDate(15),
        expiry_date: randomFutureDate(270),
        cost_per_unit: 0.64,
        supplier: suppliers[1].name,
        low_stock_threshold: 100,
        status: "available",
        notes: "Essential minerals and vitamins for sheep",
      },
      {
        name: "Corn Silage",
        type: "Silage",
        quantity: 8000,
        unit: "kg",
        location: locations[1].name,
        purchase_date: randomPastDate(60),
        expiry_date: randomFutureDate(90),
        cost_per_unit: 0.225,
        supplier: suppliers[1].name,
        low_stock_threshold: 2000,
        status: "available",
        notes: "Fermented corn feed for cattle",
      },
    ]);
    console.log(`✅ Created ${feeds.length} feeds`);

    // ===================================
    // 8. CREATE PURCHASE ORDERS
    // ===================================
    console.log("\n📄 Creating purchase orders...");
    const purchaseOrders = await PurchaseOrder.create([
      {
        po_number: "PO-2024-001",
        supplier_id: suppliers[0]._id,
        order_date: randomPastDate(60),
        expected_delivery_date: randomFutureDate(30),
        status: "pending",
        items: [
          {
            item_id: items[0]._id,
            item_name: items[0].name,
            quantity_ordered: 10,
            quantity_received: 0,
            unit_price: 1299.99,
            total: 12999.9,
          },
          {
            item_id: items[1]._id,
            item_name: items[1].name,
            quantity_ordered: 5,
            quantity_received: 0,
            unit_price: 429.99,
            total: 2149.95,
          },
        ],
        subtotal: 15149.85,
        tax_amount: 1514.99,
        shipping_cost: 150.0,
        total_amount: 16814.84,
        notes: "Quarterly tech equipment order",
        created_by: manager1._id,
      },
      {
        po_number: "PO-2024-002",
        supplier_id: suppliers[1]._id,
        order_date: randomPastDate(30),
        expected_delivery_date: randomPastDate(10),
        actual_delivery_date: randomPastDate(5),
        status: "received",
        items: [
          {
            item_id: items[4]._id,
            item_name: items[4].name,
            quantity_ordered: 1,
            quantity_received: 1,
            unit_price: 45000.0,
            total: 45000.0,
          },
        ],
        subtotal: 45000.0,
        tax_amount: 4500.0,
        shipping_cost: 500.0,
        total_amount: 50000.0,
        notes: "New tractor purchase",
        created_by: admin._id,
        approved_by: admin._id,
        approved_date: randomPastDate(28),
        received_by: manager2._id,
        received_date: randomPastDate(5),
      },
      {
        po_number: "PO-2024-003",
        supplier_id: suppliers[2]._id,
        order_date: randomPastDate(20),
        expected_delivery_date: randomFutureDate(10),
        status: "approved",
        items: [
          {
            item_id: items[3]._id,
            item_name: items[3].name,
            quantity_ordered: 20,
            quantity_received: 0,
            unit_price: 299.99,
            total: 5999.8,
          },
          {
            item_id: items[9]._id,
            item_name: items[9].name,
            quantity_ordered: 50,
            quantity_received: 0,
            unit_price: 42.99,
            total: 2149.5,
          },
        ],
        subtotal: 8149.3,
        tax_amount: 814.93,
        shipping_cost: 75.0,
        total_amount: 9039.23,
        notes: "Office furniture and supplies restocking",
        created_by: manager2._id,
        approved_by: admin._id,
        approved_date: randomPastDate(18),
      },
    ]);
    console.log(`✅ Created ${purchaseOrders.length} purchase orders`);

    // ===================================
    // 9. CREATE MAINTENANCE RECORDS
    // ===================================
    console.log("\n🔧 Creating maintenance records...");
    const maintenance = await Maintenance.create([
      {
        item_id: items[4]._id,
        title: "Tractor Routine Maintenance",
        description: "Routine oil change and filter replacement",
        maintenance_type: "inspection",
        scheduled_date: randomFutureDate(30),
        status: "scheduled",
        priority: "medium",
        technician_id: employee2._id,
        cost: 250.0,
        notes: "Regular 500-hour maintenance",
      },
      {
        item_id: items[2]._id,
        title: "Drill Battery Replacement",
        description: "Battery replacement needed",
        maintenance_type: "repair",
        scheduled_date: randomPastDate(5),
        completed_date: randomPastDate(2),
        status: "completed",
        priority: "high",
        technician_id: employee3._id,
        cost: 75.5,
        notes: "Battery was completely dead",
      },
      {
        item_id: items[8]._id,
        title: "Chainsaw Safety Inspection",
        description: "Safety inspection and chain sharpening",
        maintenance_type: "inspection",
        scheduled_date: randomFutureDate(15),
        status: "scheduled",
        priority: "medium",
        technician_id: employee2._id,
        cost: 50.0,
        notes: "Monthly safety check",
      },
    ]);
    console.log(`✅ Created ${maintenance.length} maintenance records`);

    // ===================================
    // 10. CREATE ASSIGNMENTS
    // ===================================
    console.log("\n📋 Creating assignments...");
    const assignments = await Assignment.create([
      {
        item_id: items[6]._id,
        assigned_to_user_id: employee1._id,
        assigned_by_user_id: manager1._id,
        quantity: 1,
        assignment_date: randomPastDate(90),
        expected_return_date: randomFutureDate(275),
        status: "assigned",
        condition_at_assignment: "good",
        notes: "Daily work laptop for office and field work",
      },
      {
        item_id: items[0]._id,
        assigned_to_user_id: employee2._id,
        assigned_by_user_id: manager1._id,
        quantity: 1,
        assignment_date: randomPastDate(120),
        expected_return_date: randomFutureDate(245),
        status: "assigned",
        condition_at_assignment: "good",
        notes: "Office workstation - assigned to employee desk",
      },
      {
        item_id: items[3]._id,
        assigned_to_user_id: employee3._id,
        assigned_by_user_id: manager1._id,
        quantity: 1,
        assignment_date: randomPastDate(60),
        actual_return_date: randomPastDate(10),
        status: "returned",
        condition_at_assignment: "good",
        condition_at_return: "good",
        return_notes: "Returned in good condition - temporary seating",
      },
    ]);
    console.log(`✅ Created ${assignments.length} assignments`);

    // ===================================
    // 11. CREATE PRODUCT ASSIGNMENTS
    // ===================================
    console.log("\n📦 Creating product assignments...");
    const productAssignments = await ProductAssignment.create([
      {
        item_id: items[5]._id,
        employee_id: employee2._id,
        issued_by: manager2._id,
        quantity: 1,
        assigned_date: randomPastDate(30),
        expected_return_date: randomFutureDate(60),
        status: "assigned",
        purpose: "Field work safety equipment",
        notes: "Safety gloves for construction work",
        acknowledgment_required: true,
      },
      {
        item_id: items[8]._id,
        employee_id: employee3._id,
        issued_by: manager2._id,
        quantity: 1,
        assigned_date: randomPastDate(15),
        expected_return_date: randomFutureDate(7),
        status: "in_use",
        purpose: "Tree cutting project",
        notes: "Return after project completion",
        acknowledgment_required: true,
        acknowledged: true,
        acknowledged_date: randomPastDate(14),
      },
    ]);
    console.log(`✅ Created ${productAssignments.length} product assignments`);

    // ===================================
    // 12. CREATE RESERVATIONS
    // ===================================
    console.log("\n📅 Creating reservations...");
    const reservations = await Reservation.create([
      {
        item_id: items[4]._id,
        user_id: employee1._id,
        start_date: randomFutureDate(10),
        end_date: randomFutureDate(15),
        quantity: 1,
        purpose: "Land clearing project",
        status: "pending",
        notes: "Need tractor for 5 days",
      },
      {
        item_id: items[7]._id,
        user_id: manager1._id,
        start_date: randomFutureDate(5),
        end_date: randomFutureDate(6),
        quantity: 1,
        purpose: "Team training session",
        status: "confirmed",
        notes: "Conference room equipment",
      },
      {
        item_id: items[1]._id,
        user_id: employee3._id,
        start_date: randomPastDate(3),
        end_date: randomPastDate(1),
        quantity: 1,
        purpose: "Print quarterly reports",
        status: "completed",
        notes: "Completed successfully",
      },
    ]);
    console.log(`✅ Created ${reservations.length} reservations`);

    // ===================================
    // 13. CREATE APPROVALS
    // ===================================
    console.log("\n✅ Creating approvals...");
    const approvals = await Approval.create([
      {
        request_type: "purchase",
        title: "Office Supply Restock Request",
        description: "Request to purchase 20 boxes of copy paper",
        requested_by: employee1._id,
        related_item_id: items[9]._id,
        amount: 859.8,
        status: "approved",
        priority: "medium",
        approved_by: manager1._id,
        decision_date: randomPastDate(18),
        decision_notes: "Approved for immediate purchase",
      },
      {
        request_type: "assignment",
        title: "Drill Equipment Request",
        description: "Need cordless drill for equipment repair work",
        requested_by: employee2._id,
        related_item_id: items[2]._id,
        status: "pending",
        priority: "high",
        decision_notes: "Waiting for manager approval",
      },
      {
        request_type: "other",
        title: "Computer Transfer Request",
        description: "Transfer 3 desktop computers to new office location",
        requested_by: manager2._id,
        related_item_id: items[0]._id,
        status: "approved",
        priority: "medium",
        approved_by: admin._id,
        decision_date: randomPastDate(8),
        decision_notes: "Transfer approved for next week",
      },
    ]);
    console.log(`✅ Created ${approvals.length} approvals`);

    // ===================================
    // 14. CREATE STOCK TRANSFERS
    // ===================================
    console.log("\n🚚 Creating stock transfers...");
    const stockTransfers = await StockTransfer.create([
      {
        transfer_number: "ST-2024-001",
        from_location_id: locations[0]._id,
        to_location_id: locations[3]._id,
        items: [
          {
            item_id: items[0]._id,
            quantity_requested: 5,
            quantity_sent: 5,
            quantity_received: 5,
            notes: "Office relocation",
          },
        ],
        status: "received",
        requested_by: manager1._id,
        approved_by: admin._id,
        shipped_by: employee2._id,
        received_by: employee1._id,
        request_date: randomPastDate(15),
        shipped_date: randomPastDate(12),
        expected_delivery_date: randomPastDate(11),
        received_date: randomPastDate(10),
        notes: "All items received in good condition",
      },
      {
        transfer_number: "ST-2024-002",
        from_location_id: locations[0]._id,
        to_location_id: locations[2]._id,
        items: [
          {
            item_id: items[5]._id,
            quantity_requested: 10,
            quantity_sent: 10,
            quantity_received: 0,
            notes: "Equipment storage restock",
          },
        ],
        status: "in_transit",
        requested_by: manager2._id,
        approved_by: manager1._id,
        shipped_by: employee3._id,
        request_date: randomPastDate(5),
        shipped_date: randomPastDate(3),
        expected_delivery_date: new Date(),
        notes: "Expected delivery today",
      },
    ]);
    console.log(`✅ Created ${stockTransfers.length} stock transfers`);

    // ===================================
    // 15. CREATE STOCK MOVEMENTS
    // ===================================
    console.log("\n📊 Creating stock movements...");
    const stockMovements = [];

    // Movements for first 5 items
    for (let i = 0; i < 5; i++) {
      const item = items[i];

      // Purchase movement
      stockMovements.push({
        item_id: item._id,
        movement_type: "purchase",
        quantity: item.quantity,
        to_location_id: item.location_id,
        reference_type: "purchase_order",
        reference_id: purchaseOrders[0]._id,
        performed_by: manager1._id,
        balance_after: item.quantity,
        notes: "Initial stock purchase",
      });

      // Assignment movement
      if (i < 3) {
        stockMovements.push({
          item_id: item._id,
          movement_type: "assignment",
          quantity: -1,
          from_location_id: item.location_id,
          reference_type: "assignment",
          reference_id: assignments[i]?._id,
          performed_by: manager1._id,
          balance_after: item.quantity - 1,
          notes: "Item assigned to employee",
        });
      }
    }

    await StockMovement.create(stockMovements);
    console.log(`✅ Created ${stockMovements.length} stock movements`);

    // ===================================
    // 16. CREATE STOCK ADJUSTMENTS
    // ===================================
    console.log("\n📝 Creating stock adjustments...");
    const stockAdjustments = await StockAdjustment.create([
      {
        item_id: items[5]._id,
        adjustment_type: "increase",
        quantity: 10,
        before_quantity: 40,
        after_quantity: 50,
        reason: "found",
        notes: "Found additional boxes in secondary storage",
        adjusted_by: employee2._id,
        approved_by: manager1._id,
        status: "approved",
      },
      {
        item_id: items[9]._id,
        adjustment_type: "decrease",
        quantity: 8,
        before_quantity: 80,
        after_quantity: 72,
        reason: "damage",
        notes: "Water damage to packaging - disposed",
        adjusted_by: employee1._id,
        approved_by: manager2._id,
        status: "approved",
      },
      {
        item_id: items[1]._id,
        adjustment_type: "increase",
        quantity: 2,
        before_quantity: 6,
        after_quantity: 8,
        reason: "physical_count",
        notes: "Physical inventory count correction",
        adjusted_by: manager1._id,
        approved_by: admin._id,
        status: "approved",
      },
    ]);
    console.log(`✅ Created ${stockAdjustments.length} stock adjustments`);

    // ===================================
    // 17. CREATE NOTIFICATIONS
    // ===================================
    console.log("\n🔔 Creating notifications...");
    const notifications = await Notification.create([
      {
        user_id: employee1._id,
        type: "assignment",
        title: "New Item Assigned",
        message: `You have been assigned ${items[6].name}`,
        reference_type: "Assignment",
        reference_id: assignments[0]._id,
        priority: "medium",
        is_read: false,
      },
      {
        user_id: manager1._id,
        type: "approval",
        title: "Purchase Approval Request",
        message: `${employee1.full_name} requested approval for purchase`,
        reference_type: "Approval",
        reference_id: approvals[0]._id,
        priority: "high",
        is_read: true,
        read_at: randomPastDate(15),
      },
      {
        user_id: employee2._id,
        type: "low_stock",
        title: "Low Stock Alert",
        message: `${items[4].name} is running low`,
        reference_type: "Item",
        reference_id: items[4]._id,
        priority: "high",
        is_read: false,
      },
      {
        user_id: admin._id,
        type: "maintenance",
        title: "Maintenance Scheduled",
        message: `Maintenance scheduled for ${items[4].name}`,
        reference_type: "Maintenance",
        reference_id: maintenance[0]._id,
        priority: "medium",
        is_read: false,
      },
      {
        user_id: employee3._id,
        type: "reservation",
        title: "Reservation Confirmed",
        message: `Your reservation for ${items[7].name} has been confirmed`,
        reference_type: "Reservation",
        reference_id: reservations[1]._id,
        priority: "low",
        is_read: true,
        read_at: randomPastDate(3),
      },
    ]);
    console.log(`✅ Created ${notifications.length} notifications`);

    // ===================================
    // 18. CREATE AUDIT LOGS
    // ===================================
    console.log("\n📜 Creating audit logs...");
    const auditLogs = await AuditLog.create([
      {
        user_id: admin._id,
        action: "create",
        resource: "User",
        resource_id: manager1._id,
        description: `Created user ${manager1.full_name}`,
        ip_address: "192.168.1.100",
        user_agent: "Mozilla/5.0",
      },
      {
        user_id: manager1._id,
        action: "create",
        resource: "Item",
        resource_id: items[0]._id,
        description: `Created item ${items[0].name}`,
        ip_address: "192.168.1.101",
        user_agent: "Mozilla/5.0",
      },
      {
        user_id: manager1._id,
        action: "update",
        resource: "Assignment",
        resource_id: assignments[0]._id,
        description: `Assigned ${items[6].name} to ${employee1.full_name}`,
        ip_address: "192.168.1.101",
        user_agent: "Mozilla/5.0",
      },
      {
        user_id: admin._id,
        action: "approve",
        resource: "PurchaseOrder",
        resource_id: purchaseOrders[1]._id,
        description: `Approved purchase order ${purchaseOrders[1].po_number}`,
        ip_address: "192.168.1.100",
        user_agent: "Mozilla/5.0",
      },
      {
        user_id: manager1._id,
        action: "approve",
        resource: "StockAdjustment",
        resource_id: stockAdjustments[0]._id,
        description: `Approved stock adjustment for ${items[5].name}`,
        ip_address: "192.168.1.101",
        user_agent: "Mozilla/5.0",
      },
    ]);
    console.log(`✅ Created ${auditLogs.length} audit logs`);

    // ===================================
    // SUMMARY
    // ===================================
    console.log("\n");
    console.log("═══════════════════════════════════════════════════");
    console.log("✅ COMPREHENSIVE DATABASE SEED COMPLETED!");
    console.log("═══════════════════════════════════════════════════");
    console.log("\n📊 Summary:");
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📂 Categories: ${categories.length}`);
    console.log(`   📍 Locations: ${locations.length}`);
    console.log(`   🏭 Suppliers: ${suppliers.length}`);
    console.log(`   📦 Items: ${items.length}`);
    console.log(`   🐄 Livestock: ${livestock.length}`);
    console.log(`   🌾 Feeds: ${feeds.length}`);
    console.log(`   📄 Purchase Orders: ${purchaseOrders.length}`);
    console.log(`   🔧 Maintenance: ${maintenance.length}`);
    console.log(`   📋 Assignments: ${assignments.length}`);
    console.log(`   📦 Product Assignments: ${productAssignments.length}`);
    console.log(`   📅 Reservations: ${reservations.length}`);
    console.log(`   ✅ Approvals: ${approvals.length}`);
    console.log(`   🚚 Stock Transfers: ${stockTransfers.length}`);
    console.log(`   📊 Stock Movements: ${stockMovements.length}`);
    console.log(`   📝 Stock Adjustments: ${stockAdjustments.length}`);
    console.log(`   🔔 Notifications: ${notifications.length}`);
    console.log(`   📜 Audit Logs: ${auditLogs.length}`);
    console.log("\n🔐 Login Credentials:");
    console.log("   Admin:");
    console.log("     Username: admin");
    console.log("     Password: admin123");
    console.log("\n   Manager:");
    console.log("     Username: manager1");
    console.log("     Password: admin123");
    console.log("\n   Employee:");
    console.log("     Username: employee1");
    console.log("     Password: admin123");
    console.log("\n═══════════════════════════════════════════════════\n");

    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
