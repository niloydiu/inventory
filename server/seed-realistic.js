require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/database");
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

    // Create Locations
    console.log("📍 Creating locations...");
    const locations = await Location.create([
      {
        name: "Main Warehouse",
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
    const items = await Item.create([
      // Electronics
      {
        name: "Dell OptiPlex 7090 Desktop",
        description: "Intel i7, 16GB RAM, 512GB SSD - Office workstation",
        category: "Electronics",
        quantity: 25,
        available_quantity: 18,
        unit: "units",
        location: locations[3].name,
        purchase_date: randomPastDate(180),
        purchase_price: 1299.99,
        warranty_expiry: randomFutureDate(365),
        supplier: "Dell Technologies",
        serial_number:
          "DT-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 5,
        status: "active",
      },
      {
        name: "HP LaserJet Pro M404n Printer",
        description: "Network-enabled monochrome laser printer",
        category: "Electronics",
        quantity: 8,
        available_quantity: 6,
        unit: "units",
        location: locations[3].name,
        purchase_date: randomPastDate(90),
        purchase_price: 429.99,
        warranty_expiry: randomFutureDate(730),
        supplier: "HP Inc.",
        serial_number:
          "PR-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 2,
        status: "active",
      },
      {
        name: "Logitech Wireless Mouse MX Master 3",
        description: "Ergonomic wireless mouse for productivity",
        category: "Electronics",
        quantity: 45,
        available_quantity: 32,
        unit: "units",
        location: locations[3].name,
        purchase_date: randomPastDate(60),
        purchase_price: 99.99,
        warranty_expiry: randomFutureDate(365),
        supplier: "Logitech",
        serial_number:
          "MS-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 10,
        status: "active",
      },
      {
        name: 'Dell UltraSharp 27" Monitor',
        description: "4K UHD LED monitor with USB-C connectivity",
        category: "Electronics",
        quantity: 30,
        available_quantity: 22,
        unit: "units",
        location: locations[3].name,
        purchase_date: randomPastDate(120),
        purchase_price: 549.99,
        warranty_expiry: randomFutureDate(900),
        supplier: "Dell Technologies",
        serial_number:
          "MN-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 8,
        status: "active",
      },
      // Hardware
      {
        name: "John Deere Utility Tractor 5075E",
        description: "75HP utility tractor with loader",
        category: "Hardware",
        quantity: 3,
        available_quantity: 2,
        unit: "units",
        location: locations[2].name,
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
      },
      {
        name: "Husqvarna Chainsaw 450 Rancher",
        description: '20" gas-powered chainsaw for tree maintenance',
        category: "Hardware",
        quantity: 6,
        available_quantity: 4,
        unit: "units",
        location: locations[2].name,
        purchase_date: randomPastDate(365),
        purchase_price: 479.99,
        warranty_expiry: randomFutureDate(180),
        supplier: "Husqvarna",
        serial_number:
          "CS-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 2,
        status: "active",
      },
      {
        name: "Craftsman Tool Chest 26-inch",
        description: "6-drawer rolling tool chest",
        category: "Hardware",
        quantity: 12,
        available_quantity: 8,
        unit: "units",
        location: locations[2].name,
        purchase_date: randomPastDate(200),
        purchase_price: 329.99,
        warranty_expiry: randomFutureDate(365),
        supplier: "Lowes",
        serial_number:
          "TC-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 3,
        status: "active",
      },
      // Office Supplies
      {
        name: "Copy Paper - Letter Size (Case)",
        description: "10 reams per case, 5000 sheets total",
        category: "Office Supplies",
        quantity: 45,
        available_quantity: 38,
        unit: "cases",
        location: locations[0].name,
        purchase_date: randomPastDate(30),
        purchase_price: 42.99,
        supplier: "Office Depot",
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 15,
        status: "active",
      },
      {
        name: "Pilot G2 Pen Set (Black)",
        description: "Box of 12 retractable gel pens",
        category: "Office Supplies",
        quantity: 120,
        available_quantity: 95,
        unit: "boxes",
        location: locations[0].name,
        purchase_date: randomPastDate(45),
        purchase_price: 18.99,
        supplier: "Staples",
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 25,
        status: "active",
      },
      {
        name: "Post-it Notes 3x3 (Pack of 24)",
        description: "Assorted colors, 100 sheets per pad",
        category: "Office Supplies",
        quantity: 8,
        available_quantity: 4,
        unit: "packs",
        location: locations[0].name,
        purchase_date: randomPastDate(60),
        purchase_price: 24.99,
        supplier: "3M",
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 5,
        status: "active",
      },
      // Furniture
      {
        name: "Herman Miller Aeron Chair",
        description: "Ergonomic office chair - Size B",
        category: "Furniture",
        quantity: 35,
        available_quantity: 28,
        unit: "units",
        location: locations[3].name,
        purchase_date: randomPastDate(400),
        purchase_price: 1395.0,
        warranty_expiry: randomFutureDate(4380),
        supplier: "Herman Miller",
        serial_number:
          "CH-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 5,
        status: "active",
      },
      {
        name: "Adjustable Standing Desk 60x30",
        description: "Electric height-adjustable desk with memory settings",
        category: "Furniture",
        quantity: 20,
        available_quantity: 15,
        unit: "units",
        location: locations[3].name,
        purchase_date: randomPastDate(200),
        purchase_price: 799.99,
        warranty_expiry: randomFutureDate(1825),
        supplier: "Uplift Desk",
        serial_number:
          "DS-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 4,
        status: "active",
      },
      {
        name: "Filing Cabinet - 4 Drawer",
        description: "Vertical steel filing cabinet with lock",
        category: "Furniture",
        quantity: 18,
        available_quantity: 12,
        unit: "units",
        location: locations[0].name,
        purchase_date: randomPastDate(500),
        purchase_price: 249.99,
        warranty_expiry: randomFutureDate(365),
        supplier: "HON",
        serial_number:
          "FC-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        barcode: "8" + Math.floor(Math.random() * 1000000000000),
        low_stock_threshold: 3,
        status: "active",
      },
      // Software
      {
        name: "Microsoft 365 Business License",
        description: "Annual subscription - per user",
        category: "Software",
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
      },
      {
        name: "Adobe Creative Cloud License",
        description: "All Apps - Annual subscription",
        category: "Software",
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
      },
    ]);

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
        date_of_birth: new Date("2019-05-20"),
        gender: "female",
        weight: 720,
        health_status: "healthy",
        location: "Sold to Green Acres Farm",
        purchase_date: new Date("2019-09-10"),
        purchase_price: 1900.0,
        current_value: 2800.0,
        notes: "Sold on 2024-10-15 for $2,800",
        status: "sold",
      },
    ]);

    console.log(`✅ Created ${livestock.length} livestock records`);

    // Create Assignments
    console.log("📋 Creating assignments...");
    const assignments = await Assignment.create([
      {
        item_id: items[0]._id, // Dell Desktop
        assigned_to_user_id: users[3]._id, // Emily
        assigned_by_user_id: users[1]._id, // Sarah (manager)
        quantity: 1,
        assignment_date: randomPastDate(90),
        expected_return_date: randomFutureDate(365),
        status: "assigned",
        condition_at_assignment: "new",
        notes: "Primary workstation for data entry",
      },
      {
        item_id: items[0]._id, // Dell Desktop
        assigned_to_user_id: users[4]._id, // Robert
        assigned_by_user_id: users[1]._id,
        quantity: 1,
        assignment_date: randomPastDate(120),
        expected_return_date: randomFutureDate(300),
        status: "assigned",
        condition_at_assignment: "good",
        notes: "Field operations workstation",
      },
      {
        item_id: items[10]._id, // Herman Miller Chair
        assigned_to_user_id: users[3]._id,
        assigned_by_user_id: users[0]._id,
        quantity: 1,
        assignment_date: randomPastDate(200),
        expected_return_date: randomFutureDate(200),
        status: "assigned",
        condition_at_assignment: "new",
        notes: "Ergonomic chair for desk work",
      },
      {
        item_id: items[11]._id, // Standing Desk
        assigned_to_user_id: users[4]._id,
        assigned_by_user_id: users[1]._id,
        quantity: 1,
        assignment_date: randomPastDate(150),
        expected_return_date: randomFutureDate(250),
        status: "assigned",
        condition_at_assignment: "new",
        notes: "Height-adjustable workspace",
      },
      {
        item_id: items[5]._id, // Chainsaw
        assigned_to_user_id: users[5]._id, // Lisa
        assigned_by_user_id: users[2]._id, // Mike (manager)
        quantity: 1,
        assignment_date: randomPastDate(45),
        actual_return_date: randomPastDate(10),
        status: "returned",
        condition_at_assignment: "good",
        condition_at_return: "good",
        notes: "For tree trimming project",
        return_notes: "Returned in good condition, blade sharpened",
      },
      {
        item_id: items[2]._id, // Wireless Mouse
        assigned_to_user_id: users[6]._id, // David
        assigned_by_user_id: users[1]._id,
        quantity: 1,
        assignment_date: randomPastDate(180),
        expected_return_date: randomPastDate(30), // Overdue
        status: "overdue",
        condition_at_assignment: "new",
        notes: "Replacement for damaged mouse",
      },
      {
        item_id: items[3]._id, // Monitor
        assigned_to_user_id: users[5]._id,
        assigned_by_user_id: users[1]._id,
        quantity: 2,
        assignment_date: randomPastDate(100),
        expected_return_date: randomFutureDate(265),
        status: "assigned",
        condition_at_assignment: "new",
        notes: "Dual monitor setup for design work",
      },
      {
        item_id: items[6]._id, // Tool Chest
        assigned_to_user_id: users[6]._id,
        assigned_by_user_id: users[2]._id,
        quantity: 1,
        assignment_date: randomPastDate(300),
        expected_return_date: randomFutureDate(65),
        status: "assigned",
        condition_at_assignment: "good",
        notes: "Maintenance workshop equipment",
      },
    ]);

    console.log(`✅ Created ${assignments.length} assignments`);

    // Create Reservations
    console.log("📅 Creating reservations...");
    const reservations = await Reservation.create([
      {
        item_id: items[4]._id, // Tractor
        user_id: users[4]._id,
        quantity: 1,
        start_date: randomFutureDate(7),
        end_date: randomFutureDate(14),
        status: "confirmed",
        purpose: "Field plowing - North section",
        notes: "Need loader attachment",
      },
      {
        item_id: items[1]._id, // Printer
        user_id: users[5]._id,
        quantity: 1,
        start_date: randomFutureDate(3),
        end_date: randomFutureDate(5),
        status: "confirmed",
        purpose: "Quarterly report printing",
        notes: "High volume printing job",
      },
      {
        item_id: items[4]._id, // Tractor
        user_id: users[6]._id,
        quantity: 1,
        start_date: randomFutureDate(20),
        end_date: randomFutureDate(25),
        status: "pending",
        purpose: "South field maintenance",
        notes: "Waiting for approval",
      },
      {
        item_id: items[5]._id, // Chainsaw
        user_id: users[3]._id,
        quantity: 1,
        start_date: randomPastDate(60),
        end_date: randomPastDate(55),
        status: "completed",
        purpose: "Storm damage cleanup",
        notes: "Successfully completed",
      },
      {
        item_id: items[11]._id, // Standing Desk
        user_id: users[3]._id,
        quantity: 1,
        start_date: randomFutureDate(15),
        end_date: randomFutureDate(22),
        status: "pending",
        purpose: "Temporary workspace during office renovation",
      },
      {
        item_id: items[4]._id, // Tractor
        user_id: users[5]._id,
        quantity: 1,
        start_date: randomPastDate(5),
        end_date: randomFutureDate(2),
        status: "active",
        purpose: "Winter preparation work",
        notes: "Currently in use",
      },
      {
        item_id: items[1]._id, // Printer
        user_id: users[6]._id,
        quantity: 1,
        start_date: randomPastDate(120),
        end_date: randomPastDate(118),
        status: "cancelled",
        purpose: "Marketing materials",
        notes: "Cancelled - outsourced to print shop",
      },
    ]);

    console.log(`✅ Created ${reservations.length} reservations`);

    // Create Maintenance Records
    console.log("🔧 Creating maintenance records...");
    const maintenance = await Maintenance.create([
      {
        item_id: items[4]._id, // Tractor
        title: "Routine 250-hour Service",
        description: "Oil change, filter replacement, hydraulic system check",
        maintenance_type: "inspection",
        status: "completed",
        priority: "high",
        scheduled_date: randomPastDate(15),
        completed_date: randomPastDate(10),
        technician_id: users[6]._id,
        cost: 450.0,
        notes: "All systems operating normally. Next service at 500 hours.",
      },
      {
        item_id: items[0]._id, // Dell Desktop
        title: "RAM Upgrade",
        description: "Upgrade from 16GB to 32GB RAM",
        maintenance_type: "upgrade",
        status: "completed",
        priority: "medium",
        scheduled_date: randomPastDate(30),
        completed_date: randomPastDate(28),
        technician_id: users[3]._id,
        cost: 180.0,
        notes: "Performance improvement verified. User satisfied.",
      },
      {
        item_id: items[1]._id, // Printer
        title: "Paper Jam Repair",
        description: "Clear paper jam and clean rollers",
        maintenance_type: "repair",
        status: "completed",
        priority: "urgent",
        scheduled_date: randomPastDate(5),
        completed_date: randomPastDate(4),
        technician_id: users[5]._id,
        cost: 85.0,
        notes: "Replaced worn pickup rollers. Issue resolved.",
      },
      {
        item_id: items[5]._id, // Chainsaw
        title: "Blade Sharpening and Chain Adjustment",
        description:
          "Sharpen blade, adjust chain tension, check safety features",
        maintenance_type: "repair",
        status: "scheduled",
        priority: "medium",
        scheduled_date: randomFutureDate(7),
        technician_id: users[6]._id,
        cost: 45.0,
        notes: "Routine maintenance before next use",
      },
      {
        item_id: items[4]._id, // Tractor
        title: "Hydraulic System Leak Repair",
        description: "Investigate and repair hydraulic fluid leak",
        maintenance_type: "repair",
        status: "in_progress",
        priority: "high",
        scheduled_date: randomPastDate(2),
        technician_id: users[6]._id,
        cost: 320.0,
        notes: "Leak source identified. Awaiting parts delivery.",
      },
      {
        item_id: items[11]._id, // Standing Desk
        title: "Motor Inspection",
        description: "Annual inspection of lift motors and control system",
        maintenance_type: "inspection",
        status: "scheduled",
        priority: "low",
        scheduled_date: randomFutureDate(30),
        technician_id: users[5]._id,
        notes: "Preventive maintenance check",
      },
      {
        item_id: items[3]._id, // Monitor
        title: "Screen Cleaning and Calibration",
        description: "Deep clean screen, calibrate color settings",
        maintenance_type: "cleaning",
        status: "completed",
        priority: "low",
        scheduled_date: randomPastDate(20),
        completed_date: randomPastDate(19),
        technician_id: users[3]._id,
        cost: 25.0,
        notes: "Color accuracy improved",
      },
      {
        item_id: items[10]._id, // Herman Miller Chair
        title: "Armrest Replacement",
        description: "Replace worn armrest pads",
        maintenance_type: "repair",
        status: "scheduled",
        priority: "medium",
        scheduled_date: randomFutureDate(14),
        technician_id: users[5]._id,
        cost: 120.0,
        notes: "Replacement parts ordered",
      },
    ]);

    console.log(`✅ Created ${maintenance.length} maintenance records`);

    // Create Approvals
    console.log("✓ Creating approval requests...");
    const approvals = await Approval.create([
      {
        request_type: "purchase",
        title: "Purchase 5 New Dell Workstations",
        description:
          "Requesting approval to purchase 5 Dell OptiPlex 7090 desktops for expanding team",
        requested_by: users[1]._id, // Sarah (manager)
        approved_by: users[0]._id, // Admin
        status: "approved",
        priority: "high",
        related_item_id: items[0]._id,
        amount: 6499.95,
        decision_date: randomPastDate(10),
        decision_notes: "Approved. Budget available. Proceed with purchase.",
      },
      {
        request_type: "maintenance",
        title: "Tractor Engine Overhaul",
        description:
          "Major engine service required for Tractor 5075E - 500 hour service",
        requested_by: users[6]._id, // David (employee)
        approved_by: users[2]._id, // Mike (manager)
        status: "approved",
        priority: "high",
        related_item_id: items[4]._id,
        amount: 1250.0,
        decision_date: randomPastDate(5),
        decision_notes: "Critical maintenance. Approved immediately.",
      },
      {
        request_type: "assignment",
        title: "Assign Additional Monitor to Design Team",
        description: "Request for second monitor to improve productivity",
        requested_by: users[3]._id, // Emily
        status: "pending",
        priority: "medium",
        related_item_id: items[3]._id,
        amount: 549.99,
        decision_notes: null,
      },
      {
        request_type: "purchase",
        title: "Adobe Creative Cloud Licenses (10 seats)",
        description: "Additional licenses needed for marketing team expansion",
        requested_by: users[1]._id,
        status: "pending",
        priority: "medium",
        related_item_id: items[14]._id,
        amount: 5999.9,
      },
      {
        request_type: "reservation",
        title: "Reserve Tractor for Field Work",
        description:
          "Need tractor for 5 days to complete plowing of north section",
        requested_by: users[4]._id, // Robert
        approved_by: users[2]._id,
        status: "approved",
        priority: "medium",
        related_item_id: items[4]._id,
        decision_date: randomPastDate(3),
        decision_notes:
          "Approved for dates requested. Check with David for availability.",
      },
      {
        request_type: "purchase",
        title: "Standing Desks for Office Renovation",
        description:
          "Purchase 10 additional standing desks for new office layout",
        requested_by: users[1]._id,
        approved_by: users[0]._id,
        status: "rejected",
        priority: "low",
        related_item_id: items[11]._id,
        amount: 7999.9,
        decision_date: randomPastDate(8),
        decision_notes:
          "Budget not available this quarter. Resubmit in Q1 2025.",
      },
      {
        request_type: "maintenance",
        title: "Replace Printer Toner Cartridges",
        description: "All printers need toner replacement",
        requested_by: users[5]._id, // Lisa
        approved_by: users[1]._id,
        status: "approved",
        priority: "medium",
        related_item_id: items[1]._id,
        amount: 320.0,
        decision_date: randomPastDate(1),
        decision_notes: "Approved. Order from regular supplier.",
      },
      {
        request_type: "other",
        title: "Ergonomic Assessment for Employee Workstations",
        description:
          "Request for professional ergonomic assessment of all workstations",
        requested_by: users[3]._id,
        status: "pending",
        priority: "low",
        amount: 850.0,
      },
    ]);

    console.log(`✅ Created ${approvals.length} approval requests`);

    // Create Audit Logs
    console.log("📝 Creating audit logs...");
    const auditLogs = await AuditLog.create([
      {
        user_id: users[0]._id,
        username: users[0].username,
        action: "login",
        entity_type: "user",
        entity_id: users[0]._id.toString(),
        details: { status: "success", role: "admin" },
        ip_address: "192.168.1.100",
        user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        created_at: randomPastDate(1),
      },
      {
        user_id: users[1]._id,
        username: users[1].username,
        action: "create",
        entity_type: "item",
        entity_id: items[0]._id.toString(),
        details: { item_name: items[0].name, category: items[0].category },
        ip_address: "192.168.1.105",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: randomPastDate(180),
      },
      {
        user_id: users[1]._id,
        username: users[1].username,
        action: "create",
        entity_type: "assignment",
        entity_id: assignments[0]._id.toString(),
        details: {
          item_name: items[0].name,
          assigned_to: users[3].full_name,
          quantity: 1,
        },
        ip_address: "192.168.1.105",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: randomPastDate(90),
      },
      {
        user_id: users[6]._id,
        username: users[6].username,
        action: "update",
        entity_type: "maintenance",
        entity_id: maintenance[0]._id.toString(),
        details: {
          title: maintenance[0].title,
          status: "completed",
          previous_status: "in_progress",
        },
        ip_address: "192.168.1.120",
        user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
        created_at: randomPastDate(10),
      },
      {
        user_id: users[0]._id,
        username: users[0].username,
        action: "approve",
        entity_type: "approval",
        entity_id: approvals[0]._id.toString(),
        details: {
          title: approvals[0].title,
          amount: approvals[0].amount,
          decision: "approved",
        },
        ip_address: "192.168.1.100",
        user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        created_at: randomPastDate(10),
      },
      {
        user_id: users[3]._id,
        username: users[3].username,
        action: "login",
        entity_type: "user",
        entity_id: users[3]._id.toString(),
        details: { status: "success", role: "employee" },
        ip_address: "192.168.1.110",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: randomPastDate(1),
      },
      {
        user_id: users[2]._id,
        username: users[2].username,
        action: "create",
        entity_type: "livestock",
        entity_id: livestock[0]._id.toString(),
        details: {
          tag_number: livestock[0].tag_number,
          species: livestock[0].species,
          name: livestock[0].name,
        },
        ip_address: "192.168.1.108",
        user_agent: "Mozilla/5.0 (iPad; CPU OS 14_7_1)",
        created_at: randomPastDate(400),
      },
      {
        user_id: users[1]._id,
        username: users[1].username,
        action: "update",
        entity_type: "item",
        entity_id: items[4]._id.toString(),
        details: {
          item_name: items[4].name,
          field_updated: "quantity",
          old_value: 4,
          new_value: 3,
        },
        ip_address: "192.168.1.105",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: randomPastDate(45),
      },
      {
        user_id: users[4]._id,
        username: users[4].username,
        action: "create",
        entity_type: "reservation",
        entity_id: reservations[0]._id.toString(),
        details: {
          item_name: items[4].name,
          start_date: reservations[0].start_date,
          end_date: reservations[0].end_date,
        },
        ip_address: "192.168.1.112",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: randomPastDate(30),
      },
      {
        user_id: users[5]._id,
        username: users[5].username,
        action: "update",
        entity_type: "assignment",
        entity_id: assignments[4]._id.toString(),
        details: {
          item_name: items[5].name,
          action_type: "return",
          condition: "good",
        },
        ip_address: "192.168.1.115",
        user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        created_at: randomPastDate(10),
      },
      {
        user_id: users[0]._id,
        username: users[0].username,
        action: "create",
        entity_type: "location",
        entity_id: locations[0]._id.toString(),
        details: {
          name: locations[0].name,
          type: locations[0].type,
          capacity: locations[0].capacity,
        },
        ip_address: "192.168.1.100",
        user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        created_at: randomPastDate(500),
      },
      {
        user_id: users[1]._id,
        username: users[1].username,
        action: "create",
        entity_type: "feed",
        entity_id: feeds[0]._id.toString(),
        details: {
          name: feeds[0].name,
          type: feeds[0].type,
          quantity: feeds[0].quantity,
        },
        ip_address: "192.168.1.105",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: randomPastDate(30),
      },
      {
        user_id: users[6]._id,
        username: users[6].username,
        action: "create",
        entity_type: "maintenance",
        entity_id: maintenance[3]._id.toString(),
        details: {
          title: maintenance[3].title,
          item_name: items[5].name,
          priority: maintenance[3].priority,
        },
        ip_address: "192.168.1.120",
        user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
        created_at: randomPastDate(15),
      },
      {
        user_id: users[3]._id,
        username: users[3].username,
        action: "create",
        entity_type: "approval",
        entity_id: approvals[2]._id.toString(),
        details: {
          title: approvals[2].title,
          request_type: approvals[2].request_type,
          amount: approvals[2].amount,
        },
        ip_address: "192.168.1.110",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        created_at: randomPastDate(20),
      },
      {
        user_id: users[0]._id,
        username: users[0].username,
        action: "logout",
        entity_type: "user",
        entity_id: users[0]._id.toString(),
        details: { session_duration: "2h 45m" },
        ip_address: "192.168.1.100",
        user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        created_at: randomPastDate(1),
      },
    ]);

    console.log(`✅ Created ${auditLogs.length} audit log entries`);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("\n📊 Summary:");
    console.log(
      `   👥 Users:        ${users.length} (admin, managers, employees)`
    );
    console.log(
      `   📍 Locations:    ${locations.length} (warehouses, facilities, offices)`
    );
    console.log(
      `   📦 Items:        ${items.length} (electronics, hardware, furniture, software, supplies)`
    );
    console.log(
      `   🌾 Feeds:        ${feeds.length} (hay, grain, concentrate, supplements)`
    );
    console.log(
      `   🐄 Livestock:    ${livestock.length} (cattle, goats, sheep, poultry)`
    );
    console.log(
      `   📋 Assignments:  ${assignments.length} (active, returned, overdue)`
    );
    console.log(
      `   📅 Reservations: ${reservations.length} (pending, confirmed, active, completed)`
    );
    console.log(
      `   🔧 Maintenance:  ${maintenance.length} (scheduled, in-progress, completed)`
    );
    console.log(
      `   ✓ Approvals:     ${approvals.length} (pending, approved, rejected)`
    );
    console.log(
      `   📝 Audit Logs:   ${auditLogs.length} (user activities and system events)`
    );
    console.log("\n🔐 Login Credentials:");
    console.log("   Admin:    admin / password123");
    console.log("   Manager:  sarah.manager / password123");
    console.log("   Manager:  mike.manager / password123");
    console.log("   Employee: emily.davis / password123");
    console.log("   Employee: robert.brown / password123");
    console.log("   Employee: lisa.martinez / password123");
    console.log("   Employee: david.garcia / password123");
    console.log("\n💡 All data is realistic and ready for testing!");
    console.log("=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();
