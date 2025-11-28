# Farm Inventory Management System - User Guide

**A Simple Guide for Everyone - No Technical Knowledge Required!**

This guide explains how to use the Farm Inventory Management System in simple, easy-to-understand language. Whether you're a farm manager, office staff, or employee, this guide will help you get started.

---

## 📖 Table of Contents

1. [Getting Started](#getting-started)
2. [User Roles](#user-roles)
3. [Dashboard Overview](#dashboard-overview)
4. [Managing Inventory](#managing-inventory)
5. [Product Assignments](#product-assignments)
6. [Managing Suppliers](#managing-suppliers)
7. [Purchase Orders](#purchase-orders)
8. [Stock Transfers](#stock-transfers)
9. [Livestock Management](#livestock-management)
10. [Feed Management](#feed-management)
11. [Maintenance Scheduling](#maintenance-scheduling)
12. [Reservations](#reservations)
13. [Approvals](#approvals)
14. [Notifications](#notifications)
15. [Reports](#reports)
16. [User Management](#user-management)

---

## 🚀 Getting Started

### How to Access the System

1. Open your web browser (Chrome, Firefox, Safari, or Edge)
2. Type the address: `http://localhost:3000` (or the address your IT team provided)
3. You'll see a login screen

### How to Log In

1. **Enter your username** (e.g., "admin", "manager", or "employee")
2. **Enter your password** (provided by your administrator)
3. Click the **"Log In"** button
4. You'll be taken to the main dashboard

**First Time Users:**

- Admin: Username: `admin`, Password: `admin123`
- Manager: Username: `manager`, Password: `manager123`
- Employee: Username: `employee`, Password: `employee123`
- **Important:** Change your password after first login!

---

## 👥 User Roles

The system has three types of users with different permissions:

### 🔴 Administrator (Admin)

**What they can do:**

- Full access to everything
- Add, edit, and delete all data
- Manage users and permissions
- View all reports and logs
- Change system settings

**Typical roles:** Farm Owner, IT Manager

### 🟡 Manager

**What they can do:**

- Manage inventory items
- Create and approve purchase orders
- Manage suppliers and locations
- Assign products to employees
- View reports
- Cannot manage users or system settings

**Typical roles:** Farm Manager, Inventory Manager, Supervisor

### 🟢 Employee

**What they can do:**

- View inventory
- See assigned items
- Acknowledge product assignments
- View their own data
- Create reservations and requests
- Cannot delete or make major changes

**Typical roles:** Farm Worker, Office Staff, Equipment Operator

---

## 📊 Dashboard Overview

When you log in, you'll see the **Dashboard** - your main control center.

### What's on the Dashboard:

#### 1. **Summary Cards** (Top Section)

- **Total Products**: How many different items you have
- **Low Stock Items**: Products running low (needs attention!)
- **Total Value**: Worth of all inventory
- **Recent Activity**: Number of recent actions

#### 2. **Charts and Graphs** (Middle Section)

- **Category Distribution**: Pie chart showing inventory by category
- **Stock Levels**: Bar chart of current stock
- **Recent Movements**: Graph of inventory changes

#### 3. **Quick Actions** (Right Side)

- **Recent Items**: Last items added
- **Low Stock Alerts**: Items needing reorder
- **Activity Feed**: Recent system activities

#### 4. **Navigation Menu** (Left Side)

Clickable menu to go to different sections

---

## 📦 Managing Inventory

The inventory section lets you manage all your products and items.

### Viewing the Inventory List

1. Click **"Inventory"** in the left menu
2. You'll see a table with all items showing:
   - **Name**: Item name (e.g., "Laptop", "Tractor", "Seeds")
   - **SKU**: Unique product code
   - **Category**: Type of item
   - **Quantity**: How many you have
   - **Status**: Active, Inactive, or Low Stock

### Adding a New Item

1. Click the **"Add Item"** button (top right, has a + icon)
2. Fill in the form:
   - **Item Name**: What is it? (e.g., "Dell Laptop")
   - **Description**: Brief details
   - **Category**: Select from dropdown (e.g., "Electronics", "Equipment")
   - **SKU**: Unique code (optional, auto-generated if empty)
   - **Quantity**: How many do you have?
   - **Unit Price**: Cost per item
   - **Low Stock Threshold**: When to warn about low stock (e.g., 10)
   - **Location**: Where is it stored?
3. Click **"Save"** or **"Create Item"**
4. You'll see a success message and the item appears in the list

### Viewing Item Details

1. Find the item in the list
2. Click the **eye icon (👁️)** to view details
3. A popup shows complete information:
   - All item details
   - Current stock level
   - Value
   - Last updated date

### Editing an Item

1. Find the item you want to change
2. Click the **pencil/edit icon (✏️)**
3. The form opens with current information
4. Change what you need
5. Click **"Save Changes"**
6. You'll see a confirmation message

### Deleting an Item

1. Find the item to delete
2. Click the **trash/delete icon (🗑️)**
3. A confirmation popup asks "Are you sure?"
4. Click **"Yes, Delete"** to confirm
5. The item is removed from the list

**Note:** Only Admins and Managers can delete items.

### Searching and Filtering

**Search:**

- Use the search box at the top
- Type item name, SKU, or description
- Results appear instantly

**Filter:**

- Click the filter dropdown
- Select category, status, or location
- Click "Apply" to see filtered results

---

## 🎯 Product Assignments

Track which products are given to which employees.

### Why Use Product Assignments?

- Know who has what equipment
- Track when items should be returned
- Get employee acknowledgment
- Monitor product condition

### Creating a New Assignment

1. Go to **"Product Assignments"** in the menu
2. Click **"Assign Product"** button
3. Fill in the form:
   - **Product**: Select from dropdown
   - **Employee**: Choose who gets it
   - **Quantity**: How many items
   - **Expected Return Date**: When should they return it?
   - **Purpose**: Why are they getting it? (e.g., "For field work")
   - **Condition**: Is it new, good, fair?
   - **Remarks**: Any additional notes
4. Click **"Assign Product"**
5. The employee will see this in their assignments

### Employee Acknowledging Receipt

**For Employees:**

1. Go to **"Product Assignments"**
2. Find your assigned item
3. Click the **checkmark icon (✓)** to acknowledge
4. This confirms you received the item
5. Status changes from "Assigned" to "In Use"

### Returning a Product

1. Find the assignment in the list
2. Click the **return icon (📦)**
3. Fill in the return form:
   - **Condition on Return**: New, Good, Fair, Poor, Damaged
   - **Return Remarks**: Any issues or notes
   - **Current Value**: If depreciated
4. Click **"Complete Return"**
5. Product quantity is added back to inventory

### Viewing Assignment Details

- Click the **eye icon (👁️)** on any assignment
- See complete history:
  - When assigned
  - Who issued it
  - Employee acknowledgment
  - Return details
  - Full timeline

### Dashboard Stats

At the top, you'll see:

- **Total Assignments**: All time
- **Active**: Currently assigned
- **In Use**: Acknowledged by employees
- **Returned**: Completed assignments
- **Overdue**: Past return date (shown in red!)

---

## 🏢 Managing Suppliers

Keep track of companies you buy from.

### Viewing Suppliers

1. Click **"Suppliers"** in the menu
2. See list of all suppliers with:
   - Company name
   - Contact person
   - Email and phone
   - Status (Active/Inactive)
   - Credit limit

### Adding a Supplier

1. Click **"Add Supplier"** button
2. Fill in details:
   - **Supplier Name**: Company name
   - **Supplier Code**: Unique identifier (optional)
   - **Contact Person**: Who to talk to
   - **Email**: Contact email
   - **Phone**: Contact number
   - **Address**: Full address
   - **Payment Terms**: When to pay (e.g., "Net 30")
   - **Credit Limit**: Maximum credit allowed
   - **Tax ID**: Company tax number
3. Click **"Save"**

### Editing/Deleting Suppliers

- Click **pencil icon** to edit
- Click **trash icon** to delete (if no active orders)
- Click **eye icon** to view full details

---

## 🛒 Purchase Orders

Create orders to buy items from suppliers.

### What is a Purchase Order?

A formal request to buy products from a supplier. It tracks what you ordered, quantities, prices, and delivery status.

### Creating a Purchase Order

1. Go to **"Purchase Orders"**
2. Click **"Create Purchase Order"**
3. Fill in the header:
   - **Supplier**: Select from dropdown
   - **Expected Delivery**: When will it arrive?
   - **Payment Terms**: How will you pay?
   - **Notes**: Special instructions
4. Add items:
   - Click **"Add Item"**
   - Select **Product**
   - Enter **Quantity**
   - Enter **Unit Price**
   - Subtotal calculates automatically
   - Add more items if needed
5. Review total amount
6. Click **"Create Purchase Order"**

### Purchase Order Workflow

**1. Draft** → **2. Pending** → **3. Approved** → **4. Received**

- **Draft**: Being created
- **Pending**: Waiting for approval
- **Approved**: Ready to send to supplier
- **Received**: Items delivered and added to inventory

### Approving a Purchase Order

**For Managers/Admins:**

1. Open the purchase order
2. Review items and amounts
3. Click **"Approve"** button
4. Status changes to "Approved"

### Receiving a Purchase Order

When items arrive:

1. Find the purchase order
2. Click **"Receive"** button
3. Items are automatically added to inventory
4. Status changes to "Received"
5. Quantities updated

---

## 🚚 Stock Transfers

Move inventory between different locations.

### Why Transfer Stock?

- Move items from warehouse to farm
- Redistribute between locations
- Balance stock levels

### Creating a Transfer

1. Go to **"Stock Transfers"**
2. Click **"Create Transfer"**
3. Fill in details:
   - **From Location**: Where items are now
   - **To Location**: Where they're going
   - **Transfer Date**: When
   - **Notes**: Why transferring
4. Add items:
   - Click **"Add Item"**
   - Select product
   - Enter quantity
   - Add more items if needed
5. Click **"Create Transfer"**

### Transfer Workflow

**1. Pending** → **2. Approved** → **3. In Transit** → **4. Completed**

- **Pending**: Waiting for approval
- **Approved**: Can start transfer
- **In Transit**: Items on the way
- **Completed**: Received at destination

### Completing a Transfer

1. Open the transfer
2. Click **"Complete"** button
3. Stock automatically moves between locations

---

## 🐄 Livestock Management

Track farm animals and their health.

### Viewing Livestock

1. Click **"Livestock"** in the menu
2. See all animals with:
   - Tag number/ID
   - Type (Cow, Goat, Chicken, etc.)
   - Breed
   - Age
   - Health status
   - Location

### Adding a New Animal

1. Click **"Add Livestock"**
2. Fill in details:
   - **Tag Number**: Unique ID (e.g., "COW-001")
   - **Type**: Animal type
   - **Breed**: Specific breed
   - **Date of Birth**: When born
   - **Gender**: Male/Female
   - **Weight**: Current weight
   - **Health Status**: Healthy, Sick, Under Treatment, Quarantined
   - **Location**: Where kept
   - **Notes**: Any special information
3. Click **"Save"**

### Health Status Indicators

- **Green (Healthy)**: Animal is fine
- **Red (Sick)**: Needs attention
- **Yellow (Under Treatment)**: Being treated
- **Orange (Quarantined)**: Isolated from others

### Editing Livestock Records

- Click **edit icon** to update information
- Change health status as needed
- Update weight regularly
- Add medical notes

---

## 🌾 Feed Management

Manage animal feed inventory.

### Viewing Feed Stock

1. Go to **"Feeds"**
2. See all feed types with:
   - Feed name
   - Type (Grain, Hay, Pellets, etc.)
   - Quantity
   - Unit (kg, bags, tons)
   - Expiry date
   - Cost

### Adding New Feed

1. Click **"Add Feed"**
2. Fill in:
   - **Feed Name**: What it's called
   - **Type**: Category
   - **Quantity**: How much
   - **Unit**: Measurement
   - **Cost per Unit**: Price
   - **Supplier**: Where from
   - **Expiry Date**: When it expires
   - **Storage Location**: Where kept
3. Click **"Save"**

### Expiry Warnings

- **Red Alert**: Expired feeds (don't use!)
- **Yellow Warning**: Expiring soon (use first)
- Automatic notifications sent

---

## 🔧 Maintenance Scheduling

Track equipment maintenance and repairs.

### Viewing Maintenance Records

1. Go to **"Maintenance"**
2. See all maintenance tasks:
   - Equipment/item
   - Type (Preventive, Repair, Inspection)
   - Status (Scheduled, In Progress, Completed)
   - Priority (Low, Medium, High, Urgent)
   - Due date

### Creating a Maintenance Task

1. Click **"Schedule Maintenance"**
2. Fill in:
   - **Equipment**: Select item
   - **Type**: Preventive/Repair/Inspection
   - **Priority**: How urgent
   - **Scheduled Date**: When to do it
   - **Assigned To**: Who will do it
   - **Description**: What needs to be done
   - **Estimated Cost**: Approximate cost
3. Click **"Save"**

### Updating Maintenance Status

1. Open the maintenance record
2. Change status:
   - **Scheduled** → **In Progress** (when starting)
   - **In Progress** → **Completed** (when done)
3. Add completion notes
4. Enter actual cost
5. Save changes

### Priority Levels

- 🔴 **Urgent**: Do immediately
- 🟠 **High**: Do soon
- 🟡 **Medium**: Normal priority
- 🟢 **Low**: When convenient

---

## 📅 Reservations

Reserve items for future use.

### Why Reserve Items?

- Plan ahead for equipment needs
- Ensure items are available
- Prevent double-booking

### Creating a Reservation

1. Go to **"Reservations"**
2. Click **"Create Reservation"**
3. Fill in:
   - **Item**: What you need
   - **Quantity**: How many
   - **From Date**: When you need it
   - **To Date**: When you'll return it
   - **Purpose**: Why you need it
   - **Notes**: Additional information
4. Click **"Create"**

### Reservation Status

- **Pending**: Waiting for approval
- **Approved**: Confirmed
- **Active**: Currently in use
- **Completed**: Returned
- **Cancelled**: Not needed anymore

### Checking Availability

Before reserving:

- Check item's current quantity
- See if others have reserved it
- Pick dates when available

---

## ✅ Approvals

Request approvals for various actions.

### Types of Approval Requests

- Purchase requests
- Equipment usage
- Budget approvals
- Policy exceptions
- Leave requests

### Creating an Approval Request

1. Go to **"Approvals"**
2. Click **"New Request"**
3. Select request type
4. Fill in details:
   - **Title**: Brief description
   - **Description**: Full details
   - **Amount**: If financial
   - **Priority**: How urgent
   - **Attachments**: Upload files if needed
5. Click **"Submit"**

### For Approvers (Managers/Admins)

1. Go to **"Approvals"**
2. See pending requests
3. Click to review details
4. Choose:
   - **Approve**: Grant permission
   - **Reject**: Deny request
5. Add comments if needed
6. Click **"Submit Decision"**

### Request Status

- **Pending**: Waiting for review
- **Approved**: Accepted
- **Rejected**: Denied
- **On Hold**: Needs more info

---

## 🔔 Notifications

Stay updated with important alerts.

### Viewing Notifications

1. Click **bell icon** in top right corner
2. Number shows unread notifications
3. Click to see list
4. Or go to **"Notifications"** page

### Types of Notifications

- **Low Stock**: Items running low
- **Overdue**: Assignments past return date
- **Expiring Feed**: Feed about to expire
- **Maintenance Due**: Equipment needs maintenance
- **Approvals**: Your request status changed
- **System**: Important system messages

### Managing Notifications

- **Mark as Read**: Click notification to mark read
- **Mark All as Read**: Click button to clear all
- **Delete**: Remove notification
- **Filter by Type**: See only specific types

### Notification Colors

- 🔴 **Red (Urgent)**: Immediate attention needed
- 🟠 **Orange (High)**: Important, act soon
- 🟡 **Yellow (Medium)**: Normal priority
- 🔵 **Blue (Info)**: For your information

---

## 📈 Reports

View and export data reports.

### Available Reports

1. **Low Stock Report**

   - Items below threshold
   - How many needed
   - Reorder suggestions

2. **Assigned Items Report**

   - Who has what
   - Expected return dates
   - Overdue items

3. **Stock Movements Report**

   - All inventory changes
   - Dates and reasons
   - Who made changes

4. **Financial Reports**
   - Inventory value
   - Purchase costs
   - Stock valuation

### Generating a Report

1. Go to **"Reports"**
2. Select report type
3. Choose date range (if applicable)
4. Set any filters
5. Click **"Generate"**
6. Report appears on screen

### Exporting Reports

1. Generate the report
2. Click **"Export"** button
3. Choose format:
   - **CSV**: For Excel
   - **PDF**: For printing
4. File downloads to your computer

### Low Stock Report Details

Shows:

- Item name
- Current quantity
- Minimum required
- Shortage amount
- Recommended reorder quantity
- Last supplier
- Estimated cost to restock

---

## 👤 User Management

**For Administrators Only**

### Viewing Users

1. Go to **"Users"**
2. See all system users with:
   - Username
   - Full name
   - Email
   - Role
   - Status (Active/Inactive)
   - Last login

### Adding a New User

1. Click **"Add User"**
2. Fill in:
   - **Username**: Login name (unique)
   - **Email**: User's email
   - **Full Name**: Complete name
   - **Role**: Admin, Manager, or Employee
   - **Password**: Initial password
   - **Department**: Where they work
   - **Phone**: Contact number
3. Click **"Create User"**
4. User receives welcome email (if configured)

### Editing User Permissions

1. Click **edit icon** on user
2. Change:
   - Role (changes permissions automatically)
   - Department
   - Contact info
   - Status (Active/Inactive)
3. Click **"Save Changes"**

### Deactivating a User

**Don't delete - deactivate instead!**

1. Edit the user
2. Change status to **"Inactive"**
3. Save
4. User can't log in but data is preserved

### Resetting User Password

1. Find the user
2. Click **"Reset Password"**
3. Enter new password
4. Give password to user securely
5. User should change it on first login

---

## 🔒 Security Best Practices

### Password Guidelines

- **Minimum 8 characters**
- Use mix of:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special characters (!@#$%)
- Don't use common words
- Don't share your password
- Change regularly (every 90 days)

### When You Leave Your Desk

- Always log out or lock screen
- Don't leave system open
- Protect sensitive data

### What to Report

Contact your administrator if you see:

- Suspicious activity
- Unusual changes to data
- Login problems
- Error messages
- System slowness

---

## ❓ Common Questions (FAQ)

### "I forgot my password. What do I do?"

Contact your system administrator. They can reset it for you.

### "I can't find an item I just added."

1. Check your filters - you might be filtering it out
2. Use the search box
3. Make sure you saved it
4. Refresh the page

### "I made a mistake. How do I undo it?"

Most actions can be edited:

- Find the record
- Click edit icon
- Make corrections
- Save

For deletions, contact your administrator - they may be able to restore from backup.

### "The numbers don't add up."

If inventory numbers seem wrong:

1. Check stock movements for that item
2. Look at recent assignments
3. Review transfers
4. Check with your manager
5. Administrator can run audit report

### "I need help with something not in this guide."

1. Ask your supervisor or manager
2. Contact your system administrator
3. Check with IT support
4. Reference the technical README.md if you're technical

### "Can I access this from my phone?"

Yes! The system is mobile-friendly. Just use your phone's browser and the same web address.

### "How do I print something?"

1. Open the record or report
2. Use your browser's print function (Ctrl+P or Cmd+P)
3. Or click Print button if available
4. Choose your printer
5. Click Print

---

## 📞 Getting Help

### If You Have Problems

**Level 1: Self-Help**

- Check this guide
- Try refreshing the page
- Check your internet connection
- Try logging out and back in

**Level 2: Ask Your Supervisor**

- For process questions
- For approval issues
- For data questions

**Level 3: System Administrator**

- For login problems
- For errors or bugs
- For permissions issues
- For technical problems

### Support Contact

- **Email**: support@farmtech.com
- **Phone**: [Your IT Department]
- **Help Desk**: [Your Help Desk System]

---

## 🎉 Tips for Success

1. **Keep Data Current**: Update inventory regularly
2. **Use Descriptions**: Write clear, detailed descriptions
3. **Check Notifications**: Review daily for important alerts
4. **Acknowledge Quickly**: Acknowledge assignments promptly
5. **Report Issues**: Don't wait - report problems early
6. **Regular Reviews**: Check your assigned items weekly
7. **Plan Ahead**: Use reservations for future needs
8. **Export Regularly**: Download reports for records
9. **Learn Features**: Explore the system to find helpful features
10. **Ask Questions**: Don't hesitate to ask for help

---

## 📝 Quick Reference Card

### Common Actions

| What You Want to Do   | Where to Go           | Click                     |
| --------------------- | --------------------- | ------------------------- |
| Add new item          | Inventory             | + Add Item                |
| Assign product        | Product Assignments   | Assign Product            |
| Create purchase order | Purchase Orders       | Create PO                 |
| Reserve equipment     | Reservations          | Create Reservation        |
| View notifications    | Bell icon (top right) | Click bell                |
| See reports           | Reports               | Select report type        |
| Add supplier          | Suppliers             | + Add Supplier            |
| Schedule maintenance  | Maintenance           | Schedule Maintenance      |
| Add livestock         | Livestock             | + Add Livestock           |
| Add feed              | Feeds                 | + Add Feed                |
| Change password       | Settings              | Profile → Change Password |

---

**Remember: This system is here to help you work more efficiently. Take time to learn it, and don't be afraid to explore!**

**Questions? Contact your administrator or supervisor.**

**Last Updated**: November 2025
**Version**: 1.0

---

**🌾 Happy Farming! 🌾**
