require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/database");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const {
  User,
  Item,
  Feed,
  Livestock,
  Location,
  Assignment,
  Reservation,
  Maintenance,
  Approval,
  AuditLog,
  Category,
} = require("./models");

// Helper to generate random dates
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

const seedDatabase = async () => {
  try {
    console.log(
      "🌱 Starting comprehensive database seed with realistic data..."
    );

    // Read seed data
    const seedDataPath = path.join(__dirname, "../seed_data.json");
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf8"));
    
    const itemImages = seedData.filter(item => item.type === "item_thumbnail");
    const categoryImages = seedData.filter(item => item.type === "category_image");

    console.log(`📸 Loaded ${itemImages.length} item images and ${categoryImages.length} category images`);

    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Item.deleteMany({});
    await Feed.deleteMany({});
    await Livestock.deleteMany({});
    await Location.deleteMany({});
    await Assignment.deleteMany({});
    await Reservation.deleteMany({});
    await Maintenance.deleteMany({});
    await Approval.deleteMany({});
    await AuditLog.deleteMany({});
    await Category.deleteMany({});

    // Create Users
    console.log("👥 Creating users...");
    const password_hash = await bcrypt.hash("password123", 10);

    const users = await User.create([
      {
        username: "admin",
        email: "admin@farmtech.com",
        password_hash,
        full_name: "John Anderson",
        role: "admin",
        is_active: true,
      },
      {
        username: "sarah.manager",
        email: "sarah.johnson@farmtech.com",
        password_hash,
        full_name: "Sarah Johnson",
        role: "manager",
        is_active: true,
      },
      {
        username: "mike.manager",
        email: "mike.williams@farmtech.com",
        password_hash,
        full_name: "Mike Williams",
        role: "manager",
        is_active: true,
      },
      {
        username: "emily.davis",
        email: "emily.davis@farmtech.com",
        password_hash,
        full_name: "Emily Davis",
        role: "employee",
        is_active: true,
      },
      {
        username: "robert.brown",
        email: "robert.brown@farmtech.com",
        password_hash,
        full_name: "Robert Brown",
        role: "employee",
        is_active: true,
      },
      {
        username: "lisa.martinez",
        email: "lisa.martinez@farmtech.com",
        password_hash,
        full_name: "Lisa Martinez",
        role: "employee",
        is_active: true,
      },
      {
        username: "david.garcia",
        email: "david.garcia@farmtech.com",
        password_hash,
        full_name: "David Garcia",
        role: "employee",
        is_active: true,
      },
      {
        username: "jennifer.wilson",
        email: "jennifer.wilson@farmtech.com",
        password_hash,
        full_name: "Jennifer Wilson",
        role: "employee",
        is_active: false,
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create Categories
    console.log("📂 Creating categories...");
    const categoryNames = ["Electronics", "Hardware", "Office Supplies", "Furniture", "Software"];
    const createdCategories = {};

    for (let i = 0; i < categoryNames.length; i++) {
        const name = categoryNames[i];
        const image = categoryImages[i % categoryImages.length];
        
        const category = await Category.create({
            name: name,
            code: name.toUpperCase().replace(/\s+/g, '_').substring(0, 10),
            description: `Category for ${name}`,
            image_url: image ? image.url : null,
            status: 'active'
        });
        createdCategories[name] = category;
    }
    console.log(`✅ Created ${Object.keys(createdCategories).length} categories`);

    // Create Locations
    console.log("📍 Creating locations...");
    const locations = await Location.create([
      {
        name: "Main Warehouse",
        code: "WH-001",
        description: "Primary storage facility for equipment and supplies",
        type: "warehouse",
        address: "1234 Farm Road, Springfield, IL 62701",
        capacity: 5000,
        current_usage: 3200,
        manager_id: users[1]._id,
        status: "active",
      },
      {
        name: "North Barn",
        code: "BRN-N",
        description: "Feed storage and livestock shelter",
        type: "facility",
        address: "North Section, Farm Complex",
        capacity: 2000,
        current_usage: 1500,
        manager_id: users[2]._id,
        status: "active",
      },
      {
        name: "Equipment Storage",
        code: "WH-EQ",
        description: "Specialized storage for farm equipment",
        type: "warehouse",
        address: "1234 Farm Road, Building B",
        capacity: 1500,
        current_usage: 980,
        manager_id: users[1]._id,
        status: "active",
      },
      {
        name: "Office Building",
        code: "OFF-MAIN",
        description: "Administrative offices and IT equipment",
        type: "office",
        address: "1234 Farm Road, Main Office",
        capacity: 500,
        current_usage: 420,
        manager_id: users[0]._id,
        status: "active",
      },
      {
        name: "South Pasture Storage",
        code: "WH-S",
        description: "Remote storage facility under renovation",
        type: "warehouse",
        address: "South Section, Farm Complex",
        capacity: 800,
        current_usage: 120,
        manager_id: users[2]._id,
        status: "maintenance",
      },
    ]);

    console.log(`✅ Created ${locations.length} locations`);

    // Create Items
    console.log("📦 Creating inventory items...");
    
    // Helper to get random image
    let imageIndex = 0;
    const getNextImage = () => {
        const img = itemImages[imageIndex % itemImages.length];
        imageIndex++;
        return img;
    };

    const itemsData = [
      // Electronics
      {
        name: "Dell OptiPlex 7090 Desktop",
        description: "Intel i7, 16GB RAM, 512GB SSD - Office workstation",
        category: "Electronics",
        category_id: createdCategories["Electronics"]._id,
        quantity: 25,
        available_quantity: 18,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(180),
        purchase_price: 1299.99,
        warranty_expiry: randomFutureDate(365),
        supplier: "Dell Technologies",
        serial_number:
          "DT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 5,
        status: "active",
        image_url: getNextImage().url,
      },
      {
        name: "HP LaserJet Pro M404n Printer",
        description: "Network-enabled monochrome laser printer",
        category: "Electronics",
        category_id: createdCategories["Electronics"]._id,
        quantity: 8,
        available_quantity: 6,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(90),
        purchase_price: 429.99,
        warranty_expiry: randomFutureDate(730),
        supplier: "HP Inc.",
        serial_number:
          "PR-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 2,
        status: "active",
        image_url: getNextImage().url,
      },
      {
        name: "Logitech Wireless Mouse MX Master 3",
        description: "Ergonomic wireless mouse for productivity",
        category: "Electronics",
        category_id: createdCategories["Electronics"]._id,
        quantity: 45,
        available_quantity: 32,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(60),
        purchase_price: 99.99,
        warranty_expiry: randomFutureDate(365),
        supplier: "Logitech",
        serial_number:
          "MS-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 10,
        status: "active",
        image_url: getNextImage().url,
      },
      {
        name: 'Dell UltraSharp 27" Monitor',
        description: "4K UHD LED monitor with USB-C connectivity",
        category: "Electronics",
        category_id: createdCategories["Electronics"]._id,
        quantity: 30,
        available_quantity: 22,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(120),
        purchase_price: 549.99,
        warranty_expiry: randomFutureDate(900),
        supplier: "Dell Technologies",
        serial_number:
          "MN-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 8,
        status: "active",
        image_url: getNextImage().url,
      },
      // Hardware
      {
        name: "John Deere Utility Tractor 5075E",
        description: "75HP utility tractor with loader",
        category: "Hardware",
        category_id: createdCategories["Hardware"]._id,
        quantity: 3,
        available_quantity: 2,
        unit: "units",
        location: locations[2].name,
        location_id: locations[2]._id,
        purchase_date: randomPastDate(730),
        purchase_price: 45999.0,
        warranty_expiry: randomFutureDate(365),
        supplier: "John Deere",
        serial_number:
          "TR-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 1,
        notes: "Regular maintenance required every 250 hours",
        status: "active",
        image_url: getNextImage().url,
      },
      {
        name: "Husqvarna Chainsaw 450 Rancher",
        description: '20" gas-powered chainsaw for tree maintenance',
        category: "Hardware",
        category_id: createdCategories["Hardware"]._id,
        quantity: 6,
        available_quantity: 4,
        unit: "units",
        location: locations[2].name,
        location_id: locations[2]._id,
        purchase_date: randomPastDate(365),
        purchase_price: 479.99,
        warranty_expiry: randomFutureDate(180),
        supplier: "Husqvarna",
        serial_number:
          "CS-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 2,
        status: "active",
        image_url: getNextImage().url,
      },
      {
        name: "Craftsman Tool Chest 26-inch",
        description: "6-drawer rolling tool chest",
        category: "Hardware",
        category_id: createdCategories["Hardware"]._id,
        quantity: 12,
        available_quantity: 8,
        unit: "units",
        location: locations[2].name,
        location_id: locations[2]._id,
        purchase_date: randomPastDate(200),
        purchase_price: 329.99,
        warranty_expiry: randomFutureDate(365),
        supplier: "Lowes",
        serial_number:
          "TC-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 3,
        status: "active",
        image_url: getNextImage().url,
      },
      // Office Supplies
      {
        name: "Copy Paper - Letter Size (Case)",
        description: "10 reams per case, 5000 sheets total",
        category: "Office Supplies",
        category_id: createdCategories["Office Supplies"]._id,
        quantity: 45,
        available_quantity: 38,
        unit: "cases",
        location: locations[0].name,
        location_id: locations[0]._id,
        purchase_date: randomPastDate(30),
        purchase_price: 42.99,
        supplier: "Office Depot",
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 15,
        status: "active",
        image_url: getNextImage().url,
      },
      {
        name: "Pilot G2 Pen Set (Black)",
        description: "Box of 12 retractable gel pens",
        category: "Office Supplies",
        category_id: createdCategories["Office Supplies"]._id,
        quantity: 120,
        available_quantity: 95,
        unit: "boxes",
        location: locations[0].name,
        location_id: locations[0]._id,
        purchase_date: randomPastDate(45),
        purchase_price: 18.99,
        supplier: "Staples",
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 25,
        status: "active",
        image_url: getNextImage().url,
      },
      {
        name: "Post-it Notes 3x3 (Pack of 24)",
        description: "Assorted colors, 100 sheets per pad",
        category: "Office Supplies",
        category_id: createdCategories["Office Supplies"]._id,
        quantity: 8,
        available_quantity: 4,
        unit: "packs",
        location: locations[0].name,
        location_id: locations[0]._id,
        purchase_date: randomPastDate(60),
        purchase_price: 24.99,
        supplier: "3M",
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 5,
        status: "active",
        image_url: getNextImage().url,
      },
      // Furniture
      {
        name: "Herman Miller Aeron Chair",
        description: "Ergonomic office chair - Size B",
        category: "Furniture",
        category_id: createdCategories["Furniture"]._id,
        quantity: 35,
        available_quantity: 28,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(400),
        purchase_price: 1395.0,
        warranty_expiry: randomFutureDate(4380),
        supplier: "Herman Miller",
        serial_number:
          "CH-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 5,
        status: "active",
        image_url: getNextImage().url,
      },
      {
        name: "Adjustable Standing Desk 60x30",
        description: "Electric height-adjustable desk with memory settings",
        category: "Furniture",
        category_id: createdCategories["Furniture"]._id,
        quantity: 20,
        available_quantity: 15,
        unit: "units",
        location: locations[3].name,
        location_id: locations[3]._id,
        purchase_date: randomPastDate(200),
        purchase_price: 799.99,
        warranty_expiry: randomFutureDate(1825),
        supplier: "Uplift Desk",
        serial_number:
          "DS-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 4,
        status: "active",
        image_url: getNextImage().url,
      },
      {
        name: "Filing Cabinet - 4 Drawer",
        description: "Vertical steel filing cabinet with lock",
        category: "Furniture",
        category_id: createdCategories["Furniture"]._id,
        quantity: 18,
        available_quantity: 12,
        unit: "units",
        location: locations[0].name,
        location_id: locations[0]._id,
        purchase_date: randomPastDate(500),
        purchase_price: 249.99,
        warranty_expiry: randomFutureDate(365),
        supplier: "HON",
        serial_number:
          "FC-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 3,
        status: "active",
        image_url: getNextImage().url,
      },
      // Software
      {
        name: "Microsoft 365 Business License",
        description: "Annual subscription - per user",
        category: "Software",
        category_id: createdCategories["Software"]._id,
        quantity: 50,
        available_quantity: 12,
        unit: "licenses",
        location: "Digital",
        purchase_date: randomPastDate(30),
        purchase_price: 149.99,
        warranty_expiry: randomFutureDate(335),
        supplier: "Microsoft",
        barcode:
          "SOFT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        low_stock_threshold: 10,
        status: "active",
        image_url: getNextImage().url,
      },
      {
        name: "Adobe Creative Cloud License",
        description: "All Apps - Annual subscription",
        category: "Software",
        category_id: createdCategories["Software"]._id,
        quantity: 15,
        available_quantity: 8,
        unit: "licenses",
        location: "Digital",
        purchase_date: randomPastDate(60),
        purchase_price: 599.99,
        warranty_expiry: randomFutureDate(305),
        supplier: "Adobe",
        barcode:
          "SOFT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        low_stock_threshold: 3,
        status: "active",
        image_url: getNextImage().url,
      },
    ];

    const items = [];
    for (const itemData of itemsData) {
        const item = await Item.create(itemData);
        items.push(item);
    }

    console.log(`✅ Created ${items.length} inventory items`);

    // Create Feeds
    console.log("🌾 Creating feed inventory...");
    const feeds = await Feed.create([
      {
        name: "Premium Alfalfa Hay",
        type: "Hay",
        quantity: 2500,
        unit: "kg",
        low_stock_threshold: 500,
        cost_per_unit: 0.45,
        supplier: "Green Valley Farms",
        purchase_date: randomPastDate(30),
        expiry_date: randomFutureDate(180),
        location: locations[1].name,
        batch_number: "HAY-2024-11-" + Math.floor(Math.random() * 1000),
        notes: "High protein content, suitable for dairy cattle",
        status: "available",
      },
      {
        name: "Corn Silage",
        type: "Silage",
        quantity: 3800,
        unit: "kg",
        low_stock_threshold: 800,
        cost_per_unit: 0.35,
        supplier: "Midwest Feed Co.",
        purchase_date: randomPastDate(20),
        expiry_date: randomFutureDate(120),
        location: locations[1].name,
        batch_number: "SIL-2024-11-" + Math.floor(Math.random() * 1000),
        notes: "Fermented corn for cattle feed",
        status: "available",
      },
      {
        name: "Protein Concentrate Mix",
        type: "Concentrate",
        quantity: 1200,
        unit: "kg",
        low_stock_threshold: 300,
        cost_per_unit: 1.25,
        supplier: "Purina Animal Nutrition",
        purchase_date: randomPastDate(15),
        expiry_date: randomFutureDate(365),
        location: locations[1].name,
        batch_number: "CONC-2024-11-" + Math.floor(Math.random() * 1000),
        notes: "18% protein blend for growing cattle",
        status: "available",
      },
      {
        name: "Whole Grain Corn",
        type: "Grain",
        quantity: 5000,
        unit: "kg",
        low_stock_threshold: 1000,
        cost_per_unit: 0.28,
        supplier: "Local Grain Elevator",
        purchase_date: randomPastDate(45),
        expiry_date: randomFutureDate(270),
        location: locations[0].name,
        batch_number: "GRN-2024-10-" + Math.floor(Math.random() * 1000),
        notes: "Non-GMO whole kernel corn",
        status: "available",
      },
      {
        name: "Mineral Supplement Block",
        type: "Mineral",
        quantity: 180,
        unit: "kg",
        low_stock_threshold: 50,
        cost_per_unit: 2.5,
        supplier: "AgriTech Minerals",
        purchase_date: randomPastDate(60),
        expiry_date: randomFutureDate(730),
        location: locations[1].name,
        batch_number: "MIN-2024-09-" + Math.floor(Math.random() * 1000),
        notes: "Trace mineral supplement for cattle",
        status: "available",
      },
      {
        name: "Soybean Meal",
        type: "Concentrate",
        quantity: 450,
        unit: "kg",
        low_stock_threshold: 150,
        cost_per_unit: 0.95,
        supplier: "Midwest Feed Co.",
        purchase_date: randomPastDate(25),
        expiry_date: randomFutureDate(200),
        location: locations[1].name,
        batch_number: "SOY-2024-11-" + Math.floor(Math.random() * 1000),
        notes: "High protein supplement",
        status: "available",
      },
      {
        name: "Molasses Feed Supplement",
        type: "Supplement",
        quantity: 380,
        unit: "liters",
        low_stock_threshold: 100,
        cost_per_unit: 1.8,
        supplier: "Sweet Feed Co.",
        purchase_date: randomPastDate(40),
        expiry_date: randomFutureDate(180),
        location: locations[1].name,
        batch_number: "MOL-2024-10-" + Math.floor(Math.random() * 1000),
        notes: "Liquid energy supplement",
        status: "available",
      },
      {
        name: "Timothy Grass Hay",
        type: "Hay",
        quantity: 1800,
        unit: "kg",
        low_stock_threshold: 400,
        cost_per_unit: 0.52,
        supplier: "Prairie Hay Suppliers",
        purchase_date: randomPastDate(35),
        expiry_date: randomFutureDate(150),
        location: locations[1].name,
        batch_number: "TIM-2024-10-" + Math.floor(Math.random() * 1000),
        notes: "Premium quality for horses and cattle",
        status: "available",
      },
      {
        name: "Vitamin & Mineral Premix",
        type: "Supplement",
        quantity: 85,
        unit: "kg",
        low_stock_threshold: 25,
        cost_per_unit: 8.5,
        supplier: "VitaFarm Solutions",
        purchase_date: randomPastDate(50),
        expiry_date: randomFutureDate(545),
        location: locations[1].name,
        batch_number: "VIT-2024-09-" + Math.floor(Math.random() * 1000),
        notes: "Complete vitamin and mineral supplement",
        status: "available",
      },
      {
        name: "Starter Feed - Calf Formula",
        type: "Concentrate",
        quantity: 35,
        unit: "kg",
        low_stock_threshold: 50,
        cost_per_unit: 1.95,
        supplier: "Purina Animal Nutrition",
        purchase_date: randomPastDate(10),
        expiry_date: randomFutureDate(180),
        location: locations[1].name,
        batch_number: "CALF-2024-11-" + Math.floor(Math.random() * 1000),
        notes: "Specialized formula for young calves",
        status: "low_stock",
      },
    ]);

    console.log(`✅ Created ${feeds.length} feed items`);

    // Create Livestock
    console.log("🐄 Creating livestock records...");
    const livestock = await Livestock.create([
      {
        tag_number: "CATTLE-2401",
        name: "Bessie",
        species: "Cattle",
        breed: "Holstein",
        date_of_birth: new Date("2021-03-15"),
        gender: "female",
        weight: 650,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2021-06-10"),
        purchase_price: 1800.0,
        current_value: 2200.0,
        notes: "Excellent milk producer",
        status: "active",
      },
      {
        tag_number: "CATTLE-2402",
        name: "Duke",
        species: "Cattle",
        breed: "Angus",
        date_of_birth: new Date("2020-08-22"),
        gender: "male",
        weight: 890,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2020-12-05"),
        purchase_price: 2200.0,
        current_value: 3500.0,
        notes: "Prime breeding bull",
        status: "active",
      },
      {
        tag_number: "CATTLE-2403",
        name: "Daisy",
        species: "Cattle",
        breed: "Jersey",
        date_of_birth: new Date("2022-01-10"),
        gender: "female",
        weight: 480,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2022-04-20"),
        purchase_price: 1500.0,
        current_value: 1900.0,
        notes: "High butterfat milk production",
        status: "active",
      },
      {
        tag_number: "CATTLE-2404",
        name: "Thunder",
        species: "Cattle",
        breed: "Hereford",
        date_of_birth: new Date("2021-11-05"),
        gender: "male",
        weight: 720,
        health_status: "under_treatment",
        location: locations[1].name,
        purchase_date: new Date("2022-02-14"),
        purchase_price: 1950.0,
        current_value: 2400.0,
        notes: "Minor respiratory infection - recovering well",
        status: "active",
      },
      {
        tag_number: "GOAT-2301",
        name: "Billy",
        species: "Goat",
        breed: "Boer",
        date_of_birth: new Date("2023-05-12"),
        gender: "male",
        weight: 85,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2023-07-22"),
        purchase_price: 350.0,
        current_value: 450.0,
        notes: "Good temperament",
        status: "active",
      },
      {
        tag_number: "GOAT-2302",
        name: "Nanny",
        species: "Goat",
        breed: "Nubian",
        date_of_birth: new Date("2022-09-18"),
        gender: "female",
        weight: 72,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2023-01-10"),
        purchase_price: 380.0,
        current_value: 420.0,
        notes: "Excellent milk producer",
        status: "active",
      },
      {
        tag_number: "SHEEP-2201",
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
      },
      {
        tag_number: "SHEEP-2202",
        name: "Rambo",
        species: "Sheep",
        breed: "Suffolk",
        date_of_birth: new Date("2021-12-08"),
        gender: "male",
        weight: 95,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2022-03-22"),
        purchase_price: 320.0,
        current_value: 380.0,
        notes: "Breeding ram",
        status: "active",
      },
      {
        tag_number: "CHICKEN-3501",
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
      },
      {
        tag_number: "CHICKEN-3502",
        name: "Clucky",
        species: "Chicken",
        breed: "Leghorn",
        date_of_birth: new Date("2024-02-28"),
        gender: "female",
        weight: 2.5,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2024-04-15"),
        purchase_price: 22.0,
        current_value: 28.0,
        notes: "White egg layer",
        status: "active",
      },
      {
        tag_number: "DUCK-3601",
        name: "Donald",
        species: "Duck",
        breed: "Pekin",
        date_of_birth: new Date("2024-04-10"),
        gender: "male",
        weight: 3.5,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2024-06-05"),
        purchase_price: 35.0,
        current_value: 42.0,
        notes: "Friendly disposition",
        status: "active",
      },
      {
        tag_number: "CATTLE-2405",
        name: "Rosie",
        species: "Cattle",
        breed: "Holstein",
        date_of_birth: new Date("2023-02-20"),
        gender: "female",
        weight: 450,
        health_status: "healthy",
        location: locations[1].name,
        purchase_date: new Date("2023-05-15"),
        purchase_price: 1200.0,
        current_value: 1600.0,
        notes: "Young heifer",
        status: "active",
      },
    ]);

    console.log(`✅ Created ${livestock.length} livestock records`);

    console.log("\n✅ Realistic database seed completed successfully!");
    console.log("\n📋 Admin User Credentials:");
    console.log("   Username: admin");
    console.log("   Password: password123");
    console.log("   Email: admin@farmtech.com");
    console.log("\n📋 Manager User Credentials:");
    console.log("   Username: sarah.manager");
    console.log("   Password: password123");
    console.log("\n📋 Employee User Credentials:");
    console.log("   Username: emily.davis");
    console.log("   Password: password123");

    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
