# Test Data Reference Guide

This document provides an overview of all test data seeded into the database for testing purposes.

## 🔐 Login Credentials

All users have the password: `password123`

| Username        | Email                        | Role     | Full Name       | Status   |
| --------------- | ---------------------------- | -------- | --------------- | -------- |
| admin           | admin@farmtech.com           | admin    | John Anderson   | Active   |
| sarah.manager   | sarah.johnson@farmtech.com   | manager  | Sarah Johnson   | Active   |
| mike.manager    | mike.williams@farmtech.com   | manager  | Mike Williams   | Active   |
| emily.davis     | emily.davis@farmtech.com     | employee | Emily Davis     | Active   |
| robert.brown    | robert.brown@farmtech.com    | employee | Robert Brown    | Active   |
| lisa.martinez   | lisa.martinez@farmtech.com   | employee | Lisa Martinez   | Active   |
| david.garcia    | david.garcia@farmtech.com    | employee | David Garcia    | Active   |
| jennifer.wilson | jennifer.wilson@farmtech.com | employee | Jennifer Wilson | Inactive |

## 📍 Locations (5)

1. **Main Warehouse** - Primary storage facility (5000 capacity, 3200 used)
2. **North Barn** - Feed storage and livestock shelter (2000 capacity, 1500 used)
3. **Equipment Storage** - Farm equipment storage (1500 capacity, 980 used)
4. **Office Building** - Admin offices and IT equipment (500 capacity, 420 used)
5. **South Pasture Storage** - Under maintenance (800 capacity, 120 used)

## 📦 Inventory Items (15)

### Electronics (4 items)

- **Dell OptiPlex 7090 Desktop** - 25 total, 18 available
- **HP LaserJet Pro M404n Printer** - 8 total, 6 available
- **Logitech Wireless Mouse MX Master 3** - 45 total, 32 available
- **Dell UltraSharp 27" Monitor** - 30 total, 22 available

### Hardware (3 items)

- **John Deere Utility Tractor 5075E** - 3 total, 2 available (High value: $45,999)
- **Husqvarna Chainsaw 450 Rancher** - 6 total, 4 available
- **Craftsman Tool Chest 26-inch** - 12 total, 8 available

### Office Supplies (3 items)

- **Copy Paper - Letter Size (Case)** - 45 cases, 38 available
- **Pilot G2 Pen Set (Black)** - 120 boxes, 95 available
- **Post-it Notes 3x3 (Pack of 24)** - 8 packs, 4 available (Low stock!)

### Furniture (3 items)

- **Herman Miller Aeron Chair** - 35 total, 28 available
- **Adjustable Standing Desk 60x30** - 20 total, 15 available
- **Filing Cabinet - 4 Drawer** - 18 total, 12 available

### Software (2 items)

- **Microsoft 365 Business License** - 50 total, 12 available
- **Adobe Creative Cloud License** - 15 total, 8 available

## 🌾 Feed Inventory (10)

| Name                        | Type        | Quantity | Unit   | Status        |
| --------------------------- | ----------- | -------- | ------ | ------------- |
| Premium Alfalfa Hay         | Hay         | 2500     | kg     | Available     |
| Corn Silage                 | Silage      | 3800     | kg     | Available     |
| Protein Concentrate Mix     | Concentrate | 1200     | kg     | Available     |
| Whole Grain Corn            | Grain       | 5000     | kg     | Available     |
| Mineral Supplement Block    | Mineral     | 180      | kg     | Available     |
| Soybean Meal                | Concentrate | 450      | kg     | Available     |
| Molasses Feed Supplement    | Supplement  | 380      | liters | Available     |
| Timothy Grass Hay           | Hay         | 1800     | kg     | Available     |
| Vitamin & Mineral Premix    | Supplement  | 85       | kg     | Available     |
| Starter Feed - Calf Formula | Concentrate | 35       | kg     | **Low Stock** |

## 🐄 Livestock (12)

### Cattle (5)

- **CATTLE-2401 "Bessie"** - Holstein, Female, 650 kg, Healthy
- **CATTLE-2402 "Duke"** - Angus, Male, 890 kg, Healthy (Breeding bull)
- **CATTLE-2403 "Daisy"** - Jersey, Female, 480 kg, Healthy
- **CATTLE-2404 "Thunder"** - Hereford, Male, 720 kg, Under treatment
- **CATTLE-2405 "Rosie"** - Holstein, Female, SOLD ($2,800)

### Goats (2)

- **GOAT-2301 "Billy"** - Boer, Male, 85 kg, Healthy
- **GOAT-2302 "Nanny"** - Nubian, Female, 72 kg, Healthy

### Sheep (2)

- **SHEEP-2201 "Woolly"** - Merino, Female, 68 kg, Healthy
- **SHEEP-2202 "Rambo"** - Suffolk, Male, 95 kg, Healthy

### Poultry (3)

- **CHICKEN-3501 "Henrietta"** - Rhode Island Red, Female
- **CHICKEN-3502 "Clucky"** - Leghorn, Female
- **DUCK-3601 "Donald"** - Pekin, Male

## 📋 Assignments (8)

- **Active (6)**:

  - Dell Desktop → Emily Davis
  - Dell Desktop → Robert Brown
  - Herman Miller Chair → Emily Davis
  - Standing Desk → Robert Brown
  - Monitor (2x) → Lisa Martinez
  - Tool Chest → David Garcia

- **Returned (1)**:

  - Chainsaw → Lisa Martinez (Returned in good condition)

- **Overdue (1)**:
  - Wireless Mouse → David Garcia (Expected return date passed)

## 📅 Reservations (7)

- **Confirmed (2)**:

  - Tractor for field plowing - Robert Brown (upcoming)
  - Printer for quarterly reports - Lisa Martinez (upcoming)

- **Pending (2)**:

  - Tractor for maintenance - David Garcia
  - Standing Desk for temp workspace - Emily Davis

- **Active (1)**:

  - Tractor for winter preparation - Lisa Martinez (currently in use)

- **Completed (1)**:

  - Chainsaw for storm cleanup - Emily Davis

- **Cancelled (1)**:
  - Printer for marketing materials - David Garcia

## 🔧 Maintenance Records (8)

- **Completed (4)**:

  - Tractor 250-hour service ($450)
  - Desktop RAM upgrade ($180)
  - Printer paper jam repair ($85)
  - Monitor cleaning and calibration ($25)

- **In Progress (1)**:

  - Tractor hydraulic leak repair ($320)

- **Scheduled (3)**:
  - Chainsaw blade sharpening (upcoming)
  - Standing desk motor inspection (upcoming)
  - Chair armrest replacement (upcoming)

## ✓ Approval Requests (8)

- **Approved (4)**:

  - Purchase 5 new Dell workstations ($6,499.95)
  - Tractor engine overhaul ($1,250)
  - Reserve tractor for field work
  - Replace printer toner cartridges ($320)

- **Pending (3)**:

  - Assign additional monitor to design team ($549.99)
  - Purchase Adobe Creative Cloud licenses ($5,999.90)
  - Ergonomic assessment for workstations ($850)

- **Rejected (1)**:
  - Purchase standing desks for office renovation ($7,999.90) - Budget not available

## 📝 Audit Logs (15)

Sample activities logged:

- User logins and logouts
- Item creation and updates
- Assignment creation and returns
- Maintenance updates
- Approval decisions
- Livestock record creation
- Location creation
- Feed inventory creation
- Reservation creation

All logs include user information, IP addresses, timestamps, and detailed action information.

## 🔄 Running the Seed Script

To seed the database with test data:

```bash
# Using npm script
npm run seed:realistic

# Or directly
node server/seed-realistic.js
```

**Note**: This will clear all existing data and create fresh test data.

## 📊 Data Statistics

| Category     | Count | Details                                        |
| ------------ | ----- | ---------------------------------------------- |
| Users        | 8     | 1 admin, 2 managers, 5 employees (1 inactive)  |
| Locations    | 5     | Warehouses, facilities, offices                |
| Items        | 15    | Various categories with different stock levels |
| Feeds        | 10    | Mix of hay, grain, concentrate, supplements    |
| Livestock    | 12    | Cattle, goats, sheep, poultry                  |
| Assignments  | 8     | Active, returned, overdue                      |
| Reservations | 7     | Various statuses                               |
| Maintenance  | 8     | Scheduled, in-progress, completed              |
| Approvals    | 8     | Pending, approved, rejected                    |
| Audit Logs   | 15+   | Comprehensive activity tracking                |

## 💡 Testing Scenarios

This data supports testing for:

- **Dashboard**: Stats cards, charts, activity feeds, low stock alerts
- **Inventory Management**: CRUD operations, stock tracking, categories
- **User Management**: Different roles and permissions
- **Assignments**: Create, return, track overdue items
- **Reservations**: Schedule and manage equipment reservations
- **Maintenance**: Schedule and track repairs/inspections
- **Approvals**: Submit and review approval requests
- **Audit Trail**: Track all system activities
- **Livestock Management**: Animal tracking and health monitoring
- **Feed Management**: Inventory control for animal feed
- **Location Management**: Track storage and capacity

## 🎯 Key Test Cases

1. **Low Stock Alerts**: Post-it Notes (4/8) and Calf Formula (35kg) are low
2. **Overdue Assignment**: David Garcia has an overdue mouse assignment
3. **Under Treatment Livestock**: Thunder (CATTLE-2404) is under treatment
4. **Pending Approvals**: 3 approval requests awaiting decision
5. **In-Progress Maintenance**: Tractor hydraulic leak repair ongoing
6. **Inactive Users**: Jennifer Wilson account is deactivated
7. **Location Maintenance**: South Pasture Storage is under maintenance
8. **Sold Livestock**: Rosie (CATTLE-2405) marked as sold

---

**Last Updated**: Database seeded successfully with realistic test data.
