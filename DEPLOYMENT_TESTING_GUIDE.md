# Deployment & Testing Guide

## 🚀 Quick Start

### 1. Verify Server is Running

```bash
# In terminal 1 - Backend server
node server.js

# In terminal 2 - Frontend
npm run dev
```

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api
- **Login Credentials**:
  - Username: `admin`
  - Password: `admin123`

## ✅ Feature Testing Checklist

### Core Inventory Management

- [ ] **Inventory Items**

  - [ ] View list of all items
  - [ ] Click "View Details" (Eye icon) on any item
  - [ ] Verify all fields display with proper formatting
  - [ ] Add new item
  - [ ] Edit existing item
  - [ ] Delete item with confirmation
  - [ ] Verify currency displays correctly
  - [ ] Check quantity formatting (thousand separators)

- [ ] **Categories**

  - [ ] View hierarchical tree
  - [ ] Expand/collapse category nodes
  - [ ] Create new category
  - [ ] Select parent category
  - [ ] Edit category
  - [ ] Delete category
  - [ ] Verify circular reference prevention

- [ ] **Suppliers**
  - [ ] View suppliers list
  - [ ] Click view (Eye icon) to see complete details
  - [ ] Verify credit limit displays with currency symbol
  - [ ] Check rating display (stars)
  - [ ] Create new supplier
  - [ ] Edit supplier
  - [ ] Delete supplier
  - [ ] Verify stats cards update

### Procurement & Purchasing

- [ ] **Purchase Orders**
  - [ ] View all purchase orders
  - [ ] Click view to see PO details
  - [ ] Create new PO with multiple items
  - [ ] Add/remove items dynamically
  - [ ] Verify total auto-calculation
  - [ ] Check currency formatting (test different currencies)
  - [ ] Approve pending PO (status changes to approved)
  - [ ] Receive approved PO (status changes to received)
  - [ ] Edit pending PO
  - [ ] Delete PO
  - [ ] Verify stats cards

### Inventory Movement

- [ ] **Stock Transfers**

  - [ ] View all transfers
  - [ ] Click view to see transfer details
  - [ ] Create new transfer with multiple items
  - [ ] Select from/to locations
  - [ ] Add/remove items
  - [ ] Approve pending transfer
  - [ ] Complete in-transit transfer
  - [ ] Edit pending transfer
  - [ ] Delete transfer
  - [ ] Verify stats by status

- [ ] **Stock Movements**
  - [ ] View movement history
  - [ ] Apply filters (movement type)
  - [ ] Filter by item
  - [ ] Filter by location
  - [ ] Filter by date range
  - [ ] Click view to see movement details
  - [ ] Verify quantity changes display correctly (+/-)
  - [ ] Check color coding for movement types
  - [ ] Verify stats cards (total, purchases, sales, transfers)
  - [ ] Clear filters

### Operations Management

- [ ] **Maintenance**

  - [ ] View maintenance list
  - [ ] Create new maintenance task
  - [ ] Select item from dropdown
  - [ ] Choose maintenance type
  - [ ] Set priority level
  - [ ] Schedule date
  - [ ] Edit maintenance task
  - [ ] Delete maintenance task
  - [ ] Verify status workflow

- [ ] **Reservations**

  - [ ] View reservations
  - [ ] Click view to see details
  - [ ] Create new reservation
  - [ ] Select item (should show availability)
  - [ ] Set date range (start/end)
  - [ ] Enter quantity
  - [ ] Edit reservation
  - [ ] Delete reservation
  - [ ] Verify status badges

- [ ] **Approvals**
  - [ ] View all approval requests
  - [ ] Check pending approvals section
  - [ ] Click view to see request details
  - [ ] Create new approval request
  - [ ] Select request type
  - [ ] Set priority
  - [ ] Enter amount
  - [ ] Approve pending request
  - [ ] Reject request
  - [ ] Edit pending request
  - [ ] Delete request
  - [ ] Verify stats cards

### Notifications

- [ ] **Notifications System**
  - [ ] View all notifications
  - [ ] Check unread count badge
  - [ ] View unread section (should be highlighted)
  - [ ] Click view on notification
  - [ ] Mark notification as read
  - [ ] Mark notification as unread
  - [ ] Mark all as read
  - [ ] Delete notification
  - [ ] Verify priority badges and colors
  - [ ] Check stats cards

### Navigation & Access

- [ ] **Sidebar Navigation**
  - [ ] Verify all new menu items appear:
    - [ ] Categories
    - [ ] Suppliers
    - [ ] Purchase Orders
    - [ ] Stock Transfers
    - [ ] Stock Movements
    - [ ] Notifications
  - [ ] Click each menu item
  - [ ] Verify active page highlighting
  - [ ] Check role-based visibility (login as different roles)

## 🌍 International Standards Testing

### Currency Formatting

Test with different currencies on Purchase Orders and Suppliers:

- [ ] USD: $1,234.56
- [ ] EUR: €1.234,56
- [ ] GBP: £1,234.56
- [ ] INR: ₹1,234.56
- [ ] BDT: ৳1,234.56

### Number Formatting

- [ ] Quantities show thousand separators (1,000 not 1000)
- [ ] Decimal precision is correct (2 places for currency)
- [ ] Large numbers format correctly (1,000,000)

### Date Formatting

Test date displays:

- [ ] Short format: "Dec 01, 2024"
- [ ] Long format: "December 1, 2024"
- [ ] With time: "December 1, 2024, 3:45 PM"
- [ ] Verify consistency across all pages

### Status Badges

Check color coding:

- [ ] Success/Active/Completed: Green
- [ ] Pending/Warning: Yellow
- [ ] Urgent/Error/Cancelled: Red
- [ ] Info/In Progress: Blue
- [ ] Different priorities use different shades

## 🔐 Role-Based Access Testing

### Test as Admin

- [ ] Has access to all pages
- [ ] Can create/edit/delete all entities
- [ ] Can approve requests
- [ ] Can see Users and Audit Logs pages

### Test as Manager

- [ ] Cannot access Users page
- [ ] Cannot access Audit Logs page
- [ ] Can create/edit/delete most entities
- [ ] Can approve requests
- [ ] Can access all operational pages

### Test as Employee

- [ ] Cannot access Users, Audit Logs
- [ ] Cannot access Suppliers, Purchase Orders
- [ ] Can view inventory
- [ ] Can create reservations
- [ ] Can view notifications

## 🐛 Common Issues & Solutions

### Issue: "Failed to load [entity]"

**Solution**: Check that backend server is running on port 3000

### Issue: Forms don't submit

**Solution**:

1. Check browser console for errors
2. Verify all required fields are filled
3. Check token is valid (try logging out and back in)

### Issue: Currency not displaying correctly

**Solution**:

1. Check that currency field is set on entity
2. Verify currency code is one of: USD, EUR, GBP, INR, BDT
3. Check browser locale settings

### Issue: Stats cards show 0

**Solution**:

1. Add some test data
2. Refresh the page
3. Check API is returning data

### Issue: View dialog shows "N/A" for all fields

**Solution**:

1. Check that entity data is being populated
2. Verify field names match between frontend and backend
3. Check API response structure

## 📊 Performance Testing

### Load Testing

- [ ] Add 100+ items to inventory
- [ ] Create 50+ suppliers
- [ ] Test table rendering speed
- [ ] Test search/filter performance
- [ ] Verify pagination (if implemented)

### Response Time

- [ ] API calls complete in <1 second
- [ ] View dialogs open instantly
- [ ] Forms submit within 2 seconds
- [ ] Page navigation is smooth

## 🎨 UI/UX Verification

### Consistency

- [ ] All tables use same styling
- [ ] Action buttons (View/Edit/Delete) in same order
- [ ] Dialog widths are consistent
- [ ] Form layouts follow same pattern
- [ ] Stats cards use same design

### Responsiveness

- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1920px)
- [ ] Verify dialogs are scrollable on small screens
- [ ] Check table overflow on mobile

### Accessibility

- [ ] All forms have labels
- [ ] Buttons have hover states
- [ ] Focus indicators visible
- [ ] Color contrast meets standards
- [ ] Required fields marked with \*

## 📝 Data Integrity

### Test Data Relationships

- [ ] Deleting supplier doesn't break purchase orders
- [ ] Deleting location doesn't break transfers
- [ ] Deleting item doesn't break reservations
- [ ] Parent category deletion handled properly

### Validation

- [ ] Cannot enter negative quantities
- [ ] Cannot enter future dates where not allowed
- [ ] Email format validated
- [ ] Phone format validated
- [ ] Required fields cannot be empty

## 🚢 Pre-Deployment Checklist

### Code Quality

- [ ] No console errors in browser
- [ ] No console warnings (except known ones)
- [ ] All features tested
- [ ] Forms validate properly
- [ ] API calls have error handling
- [ ] Loading states shown

### Configuration

- [ ] Environment variables set
- [ ] Database connection working
- [ ] JWT secret configured
- [ ] CORS configured for production
- [ ] API endpoints use correct URLs

### Documentation

- [ ] README updated with new features
- [ ] API documentation current
- [ ] User guide created (if needed)
- [ ] Deployment steps documented

### Security

- [ ] Authentication working
- [ ] Authorization enforced
- [ ] Input sanitization in place
- [ ] SQL injection prevented
- [ ] XSS protection enabled

## 📚 Additional Resources

### Test Data

Create test data for:

- 10 items with different categories
- 5 suppliers with different currencies
- 3 purchase orders in different statuses
- 5 stock transfers
- 10 stock movements
- 3 reservations
- 5 approval requests
- 10 notifications

### Sample Test Scenarios

**Scenario 1: Complete Purchase Order Flow**

1. Create supplier
2. Create purchase order with 3 items
3. Approve purchase order
4. Mark as received
5. Verify stock movements recorded

**Scenario 2: Stock Transfer Flow**

1. Create two locations
2. Add items to first location
3. Create transfer from location 1 to 2
4. Approve transfer
5. Complete transfer
6. Verify movement history

**Scenario 3: Approval Workflow**

1. Create approval request
2. Verify appears in pending section
3. Approve request
4. Verify status updated
5. Check notification sent (if applicable)

## ✨ Success Criteria

The application is ready for deployment when:

- ✅ All pages load without errors
- ✅ All CRUD operations work
- ✅ All view dialogs display complete information
- ✅ International formatting works correctly
- ✅ Workflows function as expected
- ✅ Role-based access enforced
- ✅ No data integrity issues
- ✅ Performance is acceptable
- ✅ UI is consistent and professional
- ✅ All tests passed

## 🎯 Next Phase Recommendations

After successful deployment:

1. Monitor error logs
2. Gather user feedback
3. Plan for additional features
4. Consider adding:
   - Advanced reporting
   - Data export (CSV/Excel)
   - Bulk operations
   - Email notifications
   - Mobile app
   - API documentation site
