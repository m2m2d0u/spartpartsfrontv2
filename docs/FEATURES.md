# Spare Parts Management System — Features Specification

> **Project**: Spart Parts
> **Language**: English
> **Date**: 2026-03-03
>
> ### Tech Stack
> | Layer | Technology |
> |-------|-----------|
> | **Frontend** | Next.js (React), TypeScript, Tailwind CSS, shadcn/ui — single app for back-office (`/admin/`) and client portal (`/`) |
> | **Backend** | Spring Boot (Java), Spring Data JPA, Hibernate |
> | **Database** | PostgreSQL |
> | **API** | REST (Spring Boot serves JSON, Next.js consumes it) |

---

## Architecture Overview

The system is composed of **two frontends** sharing a **single backend**:

```
┌─────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND                    │
│  ┌─────────────────┐   ┌─────────────────────┐  │
│  │  BACK-OFFICE    │   │  CLIENT PORTAL      │  │
│  │  /admin/...     │   │  /...               │  │
│  │                 │   │                     │  │
│  │  Staff/managers │   │  Customers browse,  │  │
│  │  manage all ops │   │  cart, orders       │  │
│  └────────┬────────┘   └────────┬────────────┘  │
│           └──────────┬──────────┘                │
└──────────────────────┼───────────────────────────┘
                       │ REST API calls
            ┌──────────▼──────────┐
            │   SPRING BOOT       │
            │   (Java Backend)    │
            │   REST API          │
            │   Spring Data JPA   │
            └──────────┬──────────┘
                       │
            ┌──────────▼──────────┐
            │    PostgreSQL        │
            └─────────────────────┘
```

### Multi-Store / Multi-Warehouse Hierarchy

```
Company (global settings)
 └── Store A (branch / business unit — own NINEA, RCCM, logo, invoice numbering)
 │    ├── Warehouse A1
 │    └── Warehouse A2
 └── Store B
      ├── Warehouse B1
      ├── Warehouse B2
      └── Warehouse B3
```

- **Company**: top-level entity, holds global settings and defaults
- **Store**: a branch or business unit. Each store has its own customers, invoices, orders, and settings (logo, NINEA, RCCM, invoice prefixes). Falls back to company-level settings when not overridden.
- **Warehouse**: physical stock location, always belongs to one store
- **Parts catalog**: global (shared across all stores), stock tracked per warehouse

### Development Priority

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1** | Backend API + Back-Office UI | **Priority — build first** |
| **Phase 2** | Client Portal | Build after Phase 1 |

---

## Table of Contents

### Part A — Back-Office & Backend (Phase 1)

1. [Dashboard & Overview](#1-dashboard--overview)
2. [Parts Catalog & Inventory](#2-parts-catalog--inventory)
3. [Procurement Management](#3-procurement-management)
4. [Customer Management](#4-customer-management)
5. [Invoicing & Billing](#5-invoicing--billing)
6. [Payments](#6-payments)
7. [Reporting](#7-reporting)
8. [Returns & Refunds](#8-returns--refunds)
9. [Multi-Store & Multi-Warehouse Management](#9-multi-store--multi-warehouse-management)
10. [Order Management (from Client Portal)](#10-order-management-from-client-portal)
11. [Settings & Configuration](#11-settings--configuration)
12. [Authentication & User Management](#12-authentication--user-management)

### Part B — Client Portal (Phase 2)

13. [Client Portal — Catalog Browsing](#13-client-portal--catalog-browsing)
14. [Client Portal — Shopping Cart](#14-client-portal--shopping-cart)
15. [Client Portal — Checkout & Orders](#15-client-portal--checkout--orders)
16. [Client Portal — Customer Account](#16-client-portal--customer-account)

---

# Part A — Back-Office & Backend (Phase 1)

> All back-office routes are prefixed with `/admin/`.
> The backend exposes API routes under `/api/` that serve both the back-office and the client portal.

---

## 1. Dashboard & Overview

The main landing page for staff. Provides a real-time snapshot of business health.

- **Admin** sees aggregated data across all stores (with store filter)
- **Store Manager** sees data for their assigned store(s)
- **Warehouse Operator** sees data for their assigned warehouse(s)

### 1.1 Summary Cards
- **Total Parts**: count of all active parts in the catalog
- **Low Stock Alerts**: count of parts below their minimum stock threshold (scoped to accessible warehouses)
- **Pending Purchase Orders**: count of orders with status Draft or Sent (scoped to store)
- **Unpaid Invoices**: count of invoices with status Sent, Partially Paid, or Overdue (scoped to store)
- **Monthly Revenue**: total revenue from paid invoices in the current month (scoped to store)
- **Pending Client Orders**: count of client portal orders awaiting processing (scoped to store)

### 1.2 Sales Chart
- Bar/line chart showing revenue over time
- Toggle between daily, weekly, and monthly views
- Displays the current period alongside the previous period for comparison

### 1.3 Recent Activity Feed
- Chronological list of the latest actions:
  - New invoices created or paid
  - Purchase orders placed or received
  - Stock adjustments
  - Returns processed
  - New client orders received
- Shows timestamp, action type, and a brief description
- Clickable links to the relevant record

### 1.4 Low Stock Alerts List
- Table of parts currently below their minimum stock threshold
- Columns: part name, part number, current stock, minimum stock, shortage amount
- Quick link to create a purchase order for the part

### 1.5 Quick Action Buttons
- **New Invoice**: navigate directly to invoice creation
- **New Purchase Order**: navigate directly to PO creation
- **Add Part**: navigate directly to part creation form

---

## 2. Parts Catalog & Inventory

Central module for managing all spare parts and their stock levels.

### 2.1 Parts List View
- Paginated, searchable data table of all parts
- **Search**: full-text search by part name, part number (SKU), and description
- **Filters**:
  - Category (dropdown, multi-select)
  - Stock status: All / In Stock / Low Stock / Out of Stock
  - Price range (min–max)
  - Warehouse (when multi-warehouse is active)
  - Visibility: All / Published (visible on client portal) / Hidden
- **Sortable columns**: name, part number, category, price, stock quantity, date added
- **Bulk actions**: export selected parts as CSV, toggle visibility

### 2.2 Add / Edit Part
- **Required fields**:
  - Part name
  - Part number (SKU) — must be unique
  - Category (select from existing categories)
  - Selling price
  - Purchase price (cost)
- **Optional fields**:
  - Description (rich text)
  - Short description (plain text, shown in catalog cards on client portal)
  - Minimum stock threshold (default: 0)
  - Initial stock quantity (on creation)
  - Images (upload up to 5 images)
  - Notes (internal notes, not visible to customers)
  - **Published** (toggle: whether visible on the client portal, default: false)
- **Validation**:
  - Part number uniqueness check
  - Prices must be non-negative numbers
  - Stock quantities must be non-negative integers

### 2.3 Part Detail Page
- Full display of all part information
- **Stock overview**: current total stock (and per-warehouse breakdown)
- **Stock movement history**: table of all stock changes with date, type (sale, purchase, adjustment, transfer, return, client order), quantity change, resulting balance, and reference (invoice/PO/order number)
- **Related records**:
  - Recent invoices containing this part
  - Recent purchase orders containing this part
  - Recent client orders containing this part
- **Actions**: Edit, Adjust Stock, Delete (with confirmation)

### 2.4 Category Management
- Separate page listing all categories
- **Add / Edit Category**: name, description, image (for client portal display)
- **Delete Category**: only if no parts are assigned (or reassign parts first)
- Categories are displayed as a flat list (no hierarchy in v1)

### 2.5 Stock Management
- **Manual stock adjustment**: select a part, enter quantity change (+/-), select reason (Damaged, Lost, Correction, Initial Count, Other), add optional notes
- **Stock movement history**: viewable on the part detail page (see 2.3)
- **Automatic stock updates**: stock is automatically adjusted by:
  - Invoice finalization (decrease)
  - Purchase order receiving (increase)
  - Return processing (increase, if reintegrated)
  - Warehouse transfers (decrease from source, increase at destination)
  - Client order confirmation (decrease)
  - Client order cancellation (increase, stock restored)

### 2.6 Low Stock Alerts
- Parts are flagged when `currentStock < minimumStockThreshold`
- Displayed on the dashboard (section 1.4) and on the parts list with a warning badge
- Alert is cleared automatically when stock is replenished

### 2.7 Bulk Import / Export
- **CSV Import**: upload a CSV file to create or update parts in bulk
  - Template CSV available for download
  - Preview imported data before confirming
  - Error report for invalid rows
- **CSV Export**: download all parts (or filtered selection) as a CSV file
- Exported fields: part number, name, category, purchase price, selling price, stock quantity, minimum stock

---

## 3. Procurement Management

Manage suppliers and purchase orders to restock inventory.

### 3.1 Supplier Directory
- Paginated, searchable list of all suppliers
- **Search**: by supplier name, contact email
- **Add / Edit Supplier**:
  - Name (required)
  - Contact person name
  - Email
  - Phone
  - Address (street, city, state/province, postal code, country)
  - Notes
- **Delete Supplier**: only if no purchase orders are linked (soft-delete or block)

### 3.2 Supplier Detail Page
- Full contact information
- **Order history**: list of all purchase orders placed with this supplier
- **Summary stats**: total orders, total amount spent, average order value

### 3.3 Purchase Orders
- Paginated list of all purchase orders
- **Filters**: status, supplier, date range
- **Status workflow**:
  ```
  Draft → Sent → Partially Received → Received → Cancelled
  ```
- **Sortable columns**: PO number, supplier, status, total amount, order date, expected delivery date

### 3.4 Create / Edit Purchase Order
- **Header fields**:
  - Supplier (select from directory, required)
  - Order date (default: today)
  - Expected delivery date
  - Destination warehouse (select from warehouses)
  - Notes
- **Line items**:
  - Select a part (searchable dropdown)
  - Quantity (required, positive integer)
  - Unit price (defaults to part's purchase price, editable)
  - Line total (auto-calculated)
- Add multiple line items
- **Order total**: auto-calculated sum of all line items
- **Save as Draft** or **Send** (changes status)

### 3.5 Receiving Workflow
- From a Sent or Partially Received PO, click "Receive Items"
- For each line item, enter the quantity received
- Partial receiving is supported — remaining items stay open
- On receiving:
  - Stock is automatically increased for the received items in the destination warehouse
  - Stock movement record is created with PO reference
  - If all items are fully received, PO status changes to "Received"
  - If some items remain, status changes to "Partially Received"

### 3.6 Purchase Order Detail Page
- Full PO information with line items table
- Receiving history (which items were received when, and by how much)
- Actions: Edit (if Draft), Receive Items (if Sent/Partially Received), Cancel (with confirmation)

---

## 4. Customer Management

Manage customer records for invoicing and client portal accounts. **Customers are scoped to a store** — each customer belongs to one store.

### 4.1 Customer Directory
- Paginated, searchable list of customers **within the current store**
- **Store filter**: admin can switch between stores; store managers see their store(s)
- **Search**: by customer name, company name, email
- **Add / Edit Customer**:
  - Name (required)
  - Company name
  - Email (unique, used for portal login)
  - Phone
  - Address (street, city, state/province, postal code, country)
  - Tax ID / VAT number
  - Notes
  - **Portal access** (toggle: whether this customer can log into the client portal)
- **Delete Customer**: only if no invoices or orders are linked (soft-delete or block)

### 4.2 Customer Detail Page
- Full contact information
- **Invoice history**: list of all invoices for this customer
- **Client orders history**: list of all orders placed via the client portal
- **Summary stats**:
  - Total invoices
  - Total purchases (sum of paid invoices)
  - Outstanding balance (sum of unpaid/partially paid invoices)
  - Total client portal orders

---

## 5. Invoicing & Billing

Create and manage invoices of different types with configurable PDF templates.

### 5.1 Invoice Types

| Type | Prefix | Purpose | Stock Impact | Payment Required |
|------|--------|---------|-------------|-----------------|
| **Proforma** | `PRO` | Preliminary quote/estimate sent before the sale | No stock deduction | No |
| **Standard** | `INV` | Official commercial invoice issued after a sale | Stock deducted on Send | Yes |
| **Deposit** | `DEP` | Partial upfront payment before full delivery | No stock deduction | Yes (partial amount) |

- Each type has its own numbering sequence (e.g., `PRO-2026-00001`, `INV-2026-00001`, `DEP-2026-00001`)
- **Proforma → Standard conversion**: a proforma can be converted into a standard invoice with one click (copies all line items, links the two records)
- **Deposit → Standard flow**: deposit invoice is issued first; when delivery happens, a standard invoice is issued referencing the deposit, with the deposit amount deducted from the total

### 5.2 Invoice List
- Paginated, searchable data table of all invoices
- **Search**: by invoice number, customer name
- **Filters**:
  - Type: All / Proforma / Standard / Deposit
  - Status: All / Draft / Sent / Paid / Partially Paid / Overdue / Cancelled
  - Customer (dropdown)
  - Date range (issued date)
  - Source: All / Manual / From Client Order
- **Sortable columns**: invoice number, type, customer, status, total amount, issued date, due date

### 5.3 Create / Edit Invoice
- **Header fields**:
  - **Invoice type** (Proforma, Standard, or Deposit — selected at creation)
  - Customer (select from directory, required)
  - Invoice number (auto-generated based on type prefix, editable)
  - Issued date (default: today)
  - Due date (default: based on payment terms in settings; not required for proforma)
  - Source warehouse (select from warehouses — determines which warehouse info appears on PDF)
  - **Invoice template** (select from available templates for PDF generation)
  - Notes (printed on invoice)
  - Internal notes (not printed)
- **Issuing entity info** (auto-filled from selected warehouse or company settings, editable):
  - Entity name (company or warehouse name)
  - NINEA
  - RCCM
  - Address
- **Line items**:
  - Select a part (searchable dropdown)
  - Quantity (required, positive integer)
  - Unit price (defaults to part's selling price, editable)
  - Discount per line (optional, percentage or fixed amount)
  - Line total (auto-calculated)
- Add multiple line items
- **Linked deposit** (for standard invoices): optionally select a deposit invoice to deduct from total
- **Subtotal**: sum of all line items
- **Tax**: calculated based on tax settings (editable)
- **Discount**: optional invoice-level discount
- **Deposit deduction**: amount from linked deposit invoice (if any)
- **Total**: subtotal + tax - discount - deposit deduction
- **Save as Draft** or **Send**

### 5.4 Invoice Number Generation
- Format per type:
  - Proforma: `{PROFORMA_PREFIX}-{YEAR}-{SEQ}` (e.g., `PRO-2026-00001`)
  - Standard: `{INVOICE_PREFIX}-{YEAR}-{SEQ}` (e.g., `INV-2026-00001`)
  - Deposit: `{DEPOSIT_PREFIX}-{YEAR}-{SEQ}` (e.g., `DEP-2026-00001`)
- Prefixes are configurable in settings
- Each type has its own independent sequence counter
- Sequential number resets yearly or continues (configurable)

### 5.5 Invoice Detail Page
- Full invoice information with line items table
- **Type badge** and **Status badge** with color coding
- **Issuing entity**: company/warehouse name, NINEA, RCCM displayed
- **Payment history**: list of payments recorded against this invoice (not for proforma)
- **Status timeline**: visual history of status changes with timestamps
- **Linked records**:
  - Linked client order (if generated from a client order)
  - Linked proforma (if converted from a proforma)
  - Linked deposit invoice (if deposit was applied)
  - Linked standard invoice (shown on deposit/proforma that was converted)
- **Actions**:
  - Edit (if Draft)
  - Send (if Draft — changes status to Sent)
  - Record Payment (Standard/Deposit only, if Sent/Partially Paid/Overdue)
  - Download PDF (uses the selected invoice template)
  - Convert to Standard Invoice (Proforma only)
  - Cancel (with confirmation, if not fully paid)
  - Create Return (Standard invoices only, link to returns module)

### 5.6 Invoice Status Workflow

**Standard & Deposit invoices:**
```
Draft → Sent → Paid
              → Partially Paid → Paid
              → Overdue → Paid
                        → Cancelled
       → Cancelled
```

**Proforma invoices:**
```
Draft → Sent → Accepted (converted to standard invoice)
             → Expired
             → Cancelled
       → Cancelled
```

- **Draft**: editable, not yet sent to customer
- **Sent**: finalized and sent to customer
- **Partially Paid**: some payments received but balance remains (Standard/Deposit only)
- **Overdue**: past due date and not fully paid (auto-updated daily, Standard/Deposit only)
- **Paid**: full amount received (Standard/Deposit only)
- **Accepted**: proforma was converted to a standard invoice
- **Expired**: proforma validity period passed without conversion
- **Cancelled**: voided invoice

### 5.7 Invoice Templates (PDF Design)

Manage multiple PDF templates to control the visual design of generated invoices.

#### 5.7.1 Template List
- List of all invoice templates
- Mark one as default
- Preview template with sample data

#### 5.7.2 Create / Edit Template
- **Template name** (e.g., "Standard Template", "Proforma Blue", "Formal with Stamp")
- **Layout settings**:
  - Color scheme (primary color, accent color)
  - Font family
  - Header layout style (logo left / centered / logo + banner)
  - Footer layout style
- **Images** (uploaded per template):
  - **Logo** (overrides company logo if set)
  - **Header banner image** (full-width image at top of invoice)
  - **Footer banner image** (full-width image at bottom)
  - **Stamp / seal image** (displayed near totals or signature area)
  - **Signature image** (digital signature)
  - **Watermark image** (background, e.g., "PROFORMA" or "PAID" stamp)
- **Field visibility toggles**:
  - Show/hide NINEA
  - Show/hide RCCM
  - Show/hide Tax ID
  - Show/hide warehouse address
  - Show/hide customer Tax ID
  - Show/hide payment terms
  - Show/hide discount column
- **Default notes text** (per template, overrides global default)

#### 5.7.3 Template Usage
- When creating an invoice, select a template (defaults to the default template)
- Template is stored on the invoice so changing the template later doesn't affect past invoices
- PDF generation renders the invoice data using the selected template's layout, colors, and images

### 5.8 PDF Generation
- Generate a professional PDF invoice using the selected template containing:
  - **Issuing entity block**: company/warehouse name, address, NINEA, RCCM, Tax ID (based on template visibility settings)
  - **Header banner image** (if configured in template)
  - **Logo** (template logo or company logo)
  - **Customer block**: name, company, address, tax ID
  - **Invoice details**: type label, number, issued date, due date
  - **Line items table**: part number, description, quantity, unit price, discount, line total
  - **Totals block**: subtotal, tax, discount, deposit deduction, grand total
  - **Stamp / seal image** (if configured)
  - **Signature image** (if configured)
  - **Payment terms and notes**
  - **Footer banner image** (if configured)
  - **Watermark** (if configured, e.g., "PROFORMA" for proforma invoices)
- Download as PDF file
- Print-friendly layout

### 5.9 Stock Deduction
- **Standard invoices only**: when status changes from Draft to Sent:
  - Stock is reduced for each line item's part from the selected warehouse
  - Stock movement record is created with invoice reference
- **Proforma and Deposit invoices**: no stock impact
- When a standard invoice is cancelled (after being sent):
  - Stock is restored for each line item
  - Stock movement record is created with cancellation reference

### 5.10 Overdue Tracking
- Applies to Standard and Deposit invoices only
- System checks daily: if an invoice is Sent or Partially Paid and `dueDate < today`, status changes to Overdue
- Overdue invoices are highlighted on the invoice list and counted on the dashboard

---

## 6. Payments

Record and track payments against invoices.

### 6.1 Record Payment
- From an invoice detail page, click "Record Payment"
- **Fields**:
  - Amount (required, must be > 0 and ≤ remaining balance)
  - Payment method: Cash, Bank Transfer, Check, Credit Card, Other
  - Payment date (default: today)
  - Reference number (e.g., check number, transaction ID)
  - Notes
- On recording:
  - If total payments ≥ invoice total → invoice status changes to Paid, paidDate is set
  - If total payments < invoice total → invoice status changes to Partially Paid

### 6.2 Partial Payments
- Multiple payments can be recorded against a single invoice
- Each payment is a separate record linked to the invoice
- Running balance is displayed on the invoice detail page

### 6.3 Payment History
- Global payment log accessible from the main navigation
- Paginated, searchable table
- **Columns**: payment date, invoice number, customer, amount, method, reference
- **Filters**: date range, payment method, customer

---

## 7. Reporting

Generate business insights from the data.

### 7.1 Sales Report
- Revenue over a selected time period
- **Grouping options**: daily, weekly, monthly
- **Visualization**: bar chart + data table
- **Metrics**: total revenue, number of invoices, average invoice value
- **Filter**: date range

### 7.2 Inventory Report
- Current stock levels for all parts
- **Columns**: part number, name, category, current stock, minimum stock, status (OK/Low/Out), stock valuation at cost, stock valuation at selling price
- **Summary**: total parts count, total stock valuation (cost and selling)
- **Filter**: category, stock status, warehouse

### 7.3 Top-Selling Parts
- Ranked list of parts by quantity sold or by revenue generated
- **Time period**: selectable date range
- **Columns**: rank, part number, name, quantity sold, revenue generated
- **Visualization**: horizontal bar chart (top 10)

### 7.4 Procurement Report
- Spending breakdown by supplier over a selected period
- **Columns**: supplier name, number of orders, total spent
- **Visualization**: pie chart by supplier
- **Filter**: date range, supplier

### 7.5 Customer Report
- Customer ranking by revenue and outstanding balances
- **Columns**: customer name, company, total purchases, outstanding balance, last purchase date
- **Filter**: date range

### 7.6 Export
- All reports can be exported as:
  - **CSV**: raw data download
  - **PDF**: formatted report with charts and tables

---

## 8. Returns & Refunds

Handle product returns and issue refunds or credit notes.

### 8.1 Return Request
- Create a return from an invoice detail page or from a client order
- **Fields**:
  - Source invoice or order (auto-filled)
  - Return date (default: today)
  - Return items: select which line items are being returned and the quantity
  - Reason per item: Defective, Wrong Part, Customer Changed Mind, Damaged in Transit, Other
  - Notes
- Return quantity cannot exceed the original invoiced/ordered quantity (minus any previous returns)

### 8.2 Return Status Workflow
```
Requested → Approved → Received → Refunded
                                → Closed (no refund)
          → Rejected
```
- **Requested**: return initiated, awaiting approval
- **Approved**: return accepted, awaiting item receipt
- **Received**: items received back
- **Refunded**: refund has been processed
- **Closed**: return completed without refund (e.g., exchange)
- **Rejected**: return denied

### 8.3 Credit Notes
- When a return is approved, a credit note is auto-generated
- Credit note references the original invoice
- Credit note contains: returned items, quantities, unit prices, total credit amount
- Credit note has its own sequential number (e.g., `CN-2026-00001`)

### 8.4 Refund Processing
- From a return in Received status, click "Process Refund"
- **Fields**:
  - Refund amount (defaults to credit note total, editable for partial refunds)
  - Refund method: Original Payment Method, Cash, Bank Transfer, Store Credit
  - Reference number
  - Notes
- Refund record is linked to the return and the original invoice

### 8.5 Stock Reintegration
- When items are received back, choose per item:
  - **Return to stock**: item is added back to inventory in the selected warehouse
  - **Write off**: item is marked as damaged/unusable (stock is not increased)
- Stock movement records are created accordingly

### 8.6 Returns List
- Paginated list of all returns
- **Filters**: status, customer, date range, invoice number
- **Columns**: return number, invoice number, customer, status, total amount, return date

---

## 9. Multi-Store & Multi-Warehouse Management

Manage multiple stores (branches) and their warehouses. Stores are business units; warehouses are physical stock locations within a store.

### 9.1 Store Management

#### 9.1.1 Store Directory
- List of all stores (admin only)
- Each store shows: name, code, location, number of warehouses, active status

#### 9.1.2 Add / Edit Store
- **Name** (required)
- **Code** (short unique identifier, e.g., "STR-01")
- **Address** (street, city, state/province, postal code, country)
- **Phone**
- **Email**
- **Logo** (store-level logo, overrides company logo on invoices)
- **NINEA** (store-level, overrides company default)
- **RCCM** (store-level, overrides company default)
- **Tax ID** (store-level, overrides company default)
- **Invoice prefixes** (proforma, invoice, deposit, credit note, order — overrides company defaults)
- **Default payment terms** (overrides company default)
- **Default proforma validity** (overrides company default)
- **Default invoice template** (overrides company default)
- **Default invoice notes** (overrides company default)
- **Is active** (toggle)
- All optional fields fall back to CompanySettings when not set

#### 9.1.3 Store Detail Page
- Full store information
- List of warehouses belonging to this store
- List of assigned store managers
- Summary stats: total customers, total invoices, monthly revenue, total stock value

#### 9.1.4 Delete Store
- Only if no customers, invoices, or orders exist for this store (soft-delete or block)

### 9.2 Warehouse Management

#### 9.2.1 Warehouse Directory
- List of all warehouses, **grouped by store**
- Store managers see only warehouses in their store(s)
- Admin sees all

#### 9.2.2 Add / Edit Warehouse
- **Store** (select from stores, required — the store this warehouse belongs to)
- **Name** (required)
- **Code** (short identifier, e.g., "WH-01", unique within the store)
- **Location / City**
- **Full address**
- **Contact person**
- **Phone**
- **Notes**
- **Is active** (toggle)
- **Delete Warehouse**: only if no stock is held (must transfer stock out first)

### 9.3 Per-Warehouse Stock Levels
- Each part's stock is tracked per warehouse
- **Part detail page** shows a breakdown table grouped by store:
  | Store / Warehouse | Stock | Min. Stock | Status |
  |-------------------|-------|------------|--------|
  | **Store A**       |       |            |        |
  | └ Main WH         | 50    | 10         | OK     |
  | └ Overflow WH      | 20    | 5          | OK     |
  | **Store B**       |       |            |        |
  | └ Branch WH        | 3     | 5          | Low    |
  | **Total**         | **73**|            |        |
- **Parts list** shows total stock across all warehouses (or per-store for store managers)

### 9.4 Stock Transfers
- Create a transfer to move stock between warehouses
- Transfers can be **within a store** or **between stores** (admin only for cross-store)
- **Fields**:
  - Source warehouse (required)
  - Destination warehouse (required, different from source)
  - Transfer date (default: today)
  - Notes
- **Transfer items**: select parts and quantities to transfer
  - Quantity cannot exceed available stock in source warehouse
- **Transfer status workflow**:
  ```
  Pending → In Transit → Completed → Cancelled
  ```
- **On "In Transit"**: stock is reduced in source warehouse
- **On "Completed"**: stock is added to destination warehouse
- **On "Cancelled"**: stock is restored to source warehouse (if was in transit)

### 9.5 Store & Warehouse-Aware Operations
- **Purchase orders**: placed by a store, received into a warehouse within that store
- **Invoice creation**: issued from a store, stock sourced from a warehouse within that store
- **Stock adjustments**: select the specific warehouse being adjusted
- **Returns**: restocked to a warehouse within the store
- **Client orders**: placed against a store, fulfilled from a warehouse within that store

### 9.6 Transfers List
- Paginated list of all stock transfers
- **Filters**: status, source warehouse, destination warehouse, store, date range
- **Columns**: transfer number, source (store/warehouse), destination (store/warehouse), status, items count, date

---

## 10. Order Management (from Client Portal)

Back-office view of orders placed by customers through the client portal.

### 10.1 Orders List
- Paginated, searchable list of all client orders
- **Search**: by order number, customer name
- **Filters**: status, customer, date range
- **Sortable columns**: order number, customer, status, total amount, order date

### 10.2 Order Status Workflow
```
Pending → Confirmed → Processing → Shipped → Delivered → Completed
       → Cancelled
                   → Cancelled
```
- **Pending**: order just placed by customer, awaiting staff review
- **Confirmed**: staff confirmed the order, stock is reserved
- **Processing**: order is being prepared/packed
- **Shipped**: order has been dispatched (optional tracking number)
- **Delivered**: order received by customer
- **Completed**: order finalized
- **Cancelled**: order cancelled (by staff or customer), stock restored

### 10.3 Order Detail Page
- Customer information
- Order items: part number, name, quantity, unit price, line total
- Order totals: subtotal, tax, discount, shipping, grand total
- Shipping address
- **Status timeline**: visual history of status changes
- **Actions**:
  - Confirm (if Pending)
  - Mark as Processing / Shipped / Delivered / Completed
  - Cancel (with reason, restores stock)
  - Generate Invoice (creates a linked invoice from this order)
  - Create Return

### 10.4 Order-to-Invoice Conversion
- From an order detail page, click "Generate Invoice"
- Pre-fills an invoice with the order's customer, line items, and totals
- Invoice is linked to the order for traceability
- Staff can edit before finalizing

---

## 11. Settings & Configuration

Settings exist at two levels: **Company** (global defaults) and **Store** (overrides per store).

### 11.1 Company Settings (Global — Admin only)

#### Company Profile
- **Business name**
- **Logo** (default logo for all stores)
- **Address** (street, city, state/province, postal code, country)
- **Tax ID / VAT number**
- **NINEA** (Numéro d'Identification National des Entreprises et des Associations)
- **RCCM** (Registre du Commerce et du Crédit Mobilier)
- **Phone**, **Email**

#### Tax Settings
- **Default tax rate** (percentage, e.g., 18%)
- Multiple tax rates with labels (e.g., "VAT 18%", "Reduced VAT 10%")
- Default tax rate for new invoices

#### Invoice Defaults
- **Proforma prefix** (e.g., "PRO")
- **Invoice prefix** (e.g., "INV")
- **Deposit prefix** (e.g., "DEP")
- **Credit note prefix** (e.g., "CN")
- **Order prefix** (e.g., "ORD")
- **Default payment terms** (days, e.g., 30)
- **Default proforma validity** (days, e.g., 30)
- **Default invoice notes**
- **Sequential number reset**: yearly or continuous
- **Default invoice template**

#### Currency Settings
- **Display currency**: symbol (e.g., FCFA, $, EUR) and position (before/after)
- **Decimal places**: 0, 2, or 3
- Single currency in v1

#### Client Portal Settings
- **Portal enabled** (toggle)
- **Minimum order amount** (optional)
- **Shipping options**: flat rate, free above threshold, or custom
- **Terms & conditions text**

### 11.2 Store Settings (Per-Store — Store Manager or Admin)

Each store can override the following company defaults. If a field is left empty, the company-level value is used.

- **Logo** (overrides company logo on invoices and portal)
- **Address**
- **NINEA**, **RCCM**, **Tax ID**
- **Phone**, **Email**
- **Invoice prefixes** (proforma, invoice, deposit, credit note, order)
- **Default payment terms**
- **Default proforma validity**
- **Default invoice template**
- **Default invoice notes**
- **Default warehouse** (pre-selected when creating invoices/POs within this store)
- **Portal fulfillment warehouse** (used for client portal orders in this store)

> **Inheritance rule**: Store setting > Company setting. For example, if Store A has NINEA = "12345" and the company has NINEA = "99999", invoices from Store A will show "12345".

---

## 12. Authentication & User Management

> **Note**: This module is planned for a future phase. The initial version will operate without authentication (single-user mode for back-office). However, the data model will include user/customer auth fields to support the client portal.

### 12.1 Back-Office Users
- Email and password authentication
- Session management
- Password reset via email

### 12.2 Roles & Permissions

Three roles with hierarchical access:

#### Admin
- Full access to **all stores**, **all warehouses**, **all features**
- Manage company settings, stores, users
- View cross-store reports and dashboards
- No store/warehouse assignment needed — implicit access to everything

#### Store Manager
- Assigned to **one or more stores**
- Full access to all operations **within their assigned store(s)**:
  - All warehouses in the store (automatic, no per-warehouse assignment needed)
  - All customers, invoices, orders, POs, returns within the store
  - Store-level settings (logo, NINEA, RCCM, prefixes, etc.)
  - User management within the store (assign warehouse operators)
- **Cannot** access other stores, company-level settings, or manage other store managers
- **Example**: Manager "Bob" manages Store A → sees all of Store A's warehouses, customers, invoices, etc.

#### Warehouse Operator
- Assigned to **one or more specific warehouses**
- Access scoped to operations within their assigned warehouse(s):
  - **Per-warehouse permissions** (granular, can differ per warehouse):
    - **Stock Manage**: view/adjust stock, manage stock movements
    - **Order Manage**: view/process client orders fulfilled from this warehouse
    - **Invoice Manage**: create/edit invoices sourced from this warehouse, record payments
    - **Procurement Manage**: create/receive purchase orders destined for this warehouse
    - **Transfer Manage**: create/manage stock transfers involving this warehouse
    - **Return Manage**: process returns restocked to this warehouse
- Read access to parts catalog and categories (global, read-only)
- Read access to customers within their store (read-only)
- **Example**: User "Alice" operates in Store A → Warehouse A1 [STOCK, ORDER] and Warehouse A2 [INVOICE, PROCUREMENT]

#### Access summary

| Feature | Admin | Store Manager | Warehouse Operator |
|---------|-------|---------------|-------------------|
| Company settings | Full | Read | No |
| Store settings | All stores | Own store(s) | No |
| Store management | Create/edit/delete | View own store(s) | No |
| Warehouse management | All | Within own store(s) | View own warehouse(s) |
| Parts catalog | Full CRUD | Full CRUD | Read only |
| Customers | All stores | Own store(s) | Read (own store) |
| Invoices | All stores | Own store(s) | Own warehouse(s) + permission |
| Purchase orders | All stores | Own store(s) | Own warehouse(s) + permission |
| Client orders | All stores | Own store(s) | Own warehouse(s) + permission |
| Stock management | All warehouses | Own store warehouses | Own warehouse(s) + permission |
| Transfers | All | Within/across own store | Own warehouse(s) + permission |
| Reports | All stores | Own store(s) | Own warehouse(s) |
| User management | All users | Warehouse operators in own store | No |

### 12.3 User Management
- **Admin** can:
  - List all users across all stores
  - Create users with any role (Admin, Store Manager, Warehouse Operator)
  - Assign Store Managers to stores
  - Assign Warehouse Operators to warehouses in any store
  - Deactivate users
- **Store Manager** can:
  - List Warehouse Operators in their store(s)
  - Create Warehouse Operators and assign them to warehouses within their store(s)
  - Cannot create Admins or Store Managers

### 12.4 Client Portal Customers
- Customer registration (email + password)
- Login / logout
- Password reset via email
- Customers are linked to their Customer record in the back-office

### 12.5 Audit Log
- Track all create, update, and delete actions
- **Fields**: timestamp, user, action type, entity type, entity ID, changes (before/after)
- Searchable and filterable log page

---

# Part B — Client Portal (Phase 2)

> The client portal is a customer-facing storefront where registered customers can browse parts, add them to a shopping cart, and place orders. It shares the same backend and database as the back-office.
>
> All client portal routes are under `/` (public-facing root).
> Each store can have its own portal presence. Customers are scoped to the store they registered with.

---

## 13. Client Portal — Catalog Browsing

### 13.1 Homepage
- Company branding (logo, name from settings)
- Featured categories grid
- Search bar (prominent)
- Latest/popular parts showcase

### 13.2 Category Browsing
- Grid of categories with name, image, and part count
- Click a category to see its parts

### 13.3 Parts Catalog Page
- Paginated grid/list of published parts (only parts with `published = true`)
- **Search**: by part name, part number, description
- **Filters**:
  - Category
  - Price range
  - Availability (in stock only)
- **Sorting**: name, price (low-high, high-low), newest
- Each part card shows: image, name, part number, price, availability badge

### 13.4 Part Detail Page
- Large image gallery
- Part name, part number, description
- Selling price
- Availability status (In Stock / Out of Stock / Low Stock shown as "Limited")
- **Add to Cart** button with quantity selector
- Related parts (same category)

---

## 14. Client Portal — Shopping Cart

### 14.1 Add to Cart
- Click "Add to Cart" from catalog or part detail page
- Select quantity (default: 1)
- Cart persists across sessions (stored in database for logged-in users, localStorage for guests)
- Visual feedback: cart icon badge updates with item count

### 14.2 Cart Page
- List of all items in the cart:
  - Part image (thumbnail)
  - Part name and part number
  - Unit price
  - Quantity (editable, with +/- buttons)
  - Line total
  - Remove button
- **Stock validation**: if requested quantity exceeds available stock, show a warning and cap the quantity
- **Cart totals**:
  - Subtotal
  - Estimated tax
  - Shipping (based on settings)
  - Grand total
- **Actions**:
  - Continue Shopping (back to catalog)
  - Proceed to Checkout
  - Clear Cart

### 14.3 Cart Persistence
- **Logged-in customers**: cart is saved in the database (Cart + CartItem tables), synced across devices
- **Guest users**: cart is stored in localStorage; on login/registration, merged into the database cart

### 14.4 Cart Validation
- Before checkout, validate:
  - All items are still published and available
  - Requested quantities do not exceed current stock
  - Prices are up to date (if a price changed since adding to cart, notify the customer)
  - Minimum order amount is met (if configured in settings)

---

## 15. Client Portal — Checkout & Orders

### 15.1 Checkout Flow
1. **Cart Review**: final review of items and totals
2. **Shipping Address**: use address on file or enter a new one
3. **Order Notes**: optional message to the seller
4. **Order Summary**: final total with tax and shipping
5. **Place Order**: submit the order

> **Note**: Payment is handled offline (bank transfer, cash on delivery, etc.) — no online payment gateway in v1. The order is placed with status "Pending" and the back-office staff processes payment manually.

### 15.2 Order Confirmation
- Confirmation page with order number and summary
- Email confirmation sent to customer (future enhancement)

### 15.3 Order placed
- On order placement:
  - Order record is created with status "Pending"
  - Cart is cleared
  - Back-office receives the order in the Orders list (section 10)
  - Stock is NOT deducted yet (deducted when staff confirms the order)

---

## 16. Client Portal — Customer Account

### 16.1 Registration
- Register with: name, email, password, company name (optional), phone (optional)
- Creates a linked Customer record in the back-office
- Portal access must be enabled by admin (or auto-approved, configurable)

### 16.2 Login / Logout
- Email and password login
- Session management
- Password reset via email

### 16.3 My Account Dashboard
- Welcome message with customer name
- Quick stats: total orders, pending orders, outstanding balance

### 16.4 Order History
- List of all past orders with: order number, date, status, total
- Click to view order detail: items, quantities, prices, current status, status timeline
- Option to reorder (add all items from a past order to the cart)

### 16.5 My Invoices
- List of invoices issued to this customer
- View invoice detail
- Download invoice PDF

### 16.6 My Returns
- List of returns requested by this customer
- View return status and details
- Request a return from an order (creates a return request in the back-office)

### 16.7 Profile Management
- Edit: name, company, phone, address
- Change password
- Email is read-only (or changeable with verification)

---

# Appendices

---

## Appendix A: Data Model Overview

### Multi-Store Hierarchy
```
Company (CompanySettings)
 └── Store             1 ← N   Warehouse
     Store             1 ← N   Customer
     Store             1 ← N   Invoice
     Store             1 ← N   ClientOrder
     Store             1 ← N   PurchaseOrder
```

### Catalog & Stock
```
Category            1 ← N   Part            (global catalog)
Part                1 ← N   PartImage
Part                1 ← N   WarehouseStock  (stock per warehouse)
Part                1 ← N   StockMovement   (audit trail)
```

### Procurement
```
Supplier            1 ← N   PurchaseOrder
PurchaseOrder       1 ← N   PurchaseOrderItem
```

### Invoicing & Payments
```
Customer            1 ← N   Invoice
Invoice             1 ← N   InvoiceItem
Invoice             1 ← N   Payment
InvoiceTemplate     1 ← N   Invoice
Invoice (proforma)  1 ← 0..1 Invoice (standard)
Invoice (deposit)   1 ← 0..1 Invoice (standard)
```

### Returns
```
Invoice/Order       1 ← N   Return
Return              1 ← N   ReturnItem
Return              1 ← 1   CreditNote
Return              1 ← N   Refund
```

### Warehouse & Transfers
```
Store               1 ← N   Warehouse
Warehouse           1 ← N   WarehouseStock
StockTransfer       1 ← N   StockTransferItem
```

### Users & Permissions
```
User (ADMIN)          → full access, no assignments needed
User (STORE_MANAGER)  → UserStore    1 ← N  (assigned stores)
User (WAREHOUSE_OP)   → UserWarehouse 1 ← N (assigned warehouses + permissions)
```

### Client Portal
```
Customer            1 ← 1   Cart
Cart                1 ← N   CartItem
Customer            1 ← N   ClientOrder
ClientOrder         1 ← N   OrderItem
ClientOrder         1 ← 0..1 Invoice
```

---

## Appendix B: Page Map

### Back-Office Routes (`/admin/...`)

| Route                              | Page                         |
|------------------------------------|------------------------------|
| `/admin`                           | Dashboard                    |
| `/admin/stores`                    | Stores list (admin only)     |
| `/admin/stores/new`                | Create store                 |
| `/admin/stores/[id]`              | Store detail                 |
| `/admin/stores/[id]/edit`         | Edit store                   |
| `/admin/stores/[id]/settings`     | Store settings               |
| `/admin/parts`                     | Parts list                   |
| `/admin/parts/new`                 | Create part                  |
| `/admin/parts/[id]`               | Part detail                  |
| `/admin/parts/[id]/edit`          | Edit part                    |
| `/admin/categories`                | Categories list              |
| `/admin/suppliers`                 | Suppliers list               |
| `/admin/suppliers/new`             | Create supplier              |
| `/admin/suppliers/[id]`           | Supplier detail              |
| `/admin/suppliers/[id]/edit`      | Edit supplier                |
| `/admin/procurement`               | Purchase orders list         |
| `/admin/procurement/new`           | Create purchase order        |
| `/admin/procurement/[id]`         | Purchase order detail        |
| `/admin/procurement/[id]/edit`    | Edit purchase order          |
| `/admin/procurement/[id]/receive` | Receive items                |
| `/admin/customers`                 | Customers list               |
| `/admin/customers/new`             | Create customer              |
| `/admin/customers/[id]`           | Customer detail              |
| `/admin/customers/[id]/edit`      | Edit customer                |
| `/admin/invoices`                  | Invoices list (all types)    |
| `/admin/invoices/new?type=proforma`| Create proforma invoice      |
| `/admin/invoices/new?type=standard`| Create standard invoice      |
| `/admin/invoices/new?type=deposit` | Create deposit invoice       |
| `/admin/invoices/[id]`            | Invoice detail               |
| `/admin/invoices/[id]/edit`       | Edit invoice                 |
| `/admin/invoices/[id]/pdf`        | Invoice PDF preview          |
| `/admin/invoices/[id]/convert`    | Convert proforma → standard  |
| `/admin/invoice-templates`         | Invoice templates list       |
| `/admin/invoice-templates/new`     | Create template              |
| `/admin/invoice-templates/[id]`   | Edit template                |
| `/admin/invoice-templates/[id]/preview` | Preview with sample data|
| `/admin/payments`                  | Payments list                |
| `/admin/orders`                    | Client orders list           |
| `/admin/orders/[id]`              | Client order detail          |
| `/admin/returns`                   | Returns list                 |
| `/admin/returns/new?invoice=[id]` | Create return                |
| `/admin/returns/[id]`             | Return detail                |
| `/admin/warehouses`                | Warehouses list              |
| `/admin/warehouses/new`            | Create warehouse             |
| `/admin/warehouses/[id]`          | Warehouse detail             |
| `/admin/warehouses/[id]/edit`     | Edit warehouse               |
| `/admin/transfers`                 | Stock transfers list         |
| `/admin/transfers/new`             | Create transfer              |
| `/admin/transfers/[id]`           | Transfer detail              |
| `/admin/reports`                   | Reports overview             |
| `/admin/reports/sales`             | Sales report                 |
| `/admin/reports/inventory`         | Inventory report             |
| `/admin/reports/top-parts`         | Top-selling parts report     |
| `/admin/reports/procurement`       | Procurement report           |
| `/admin/reports/customers`         | Customer report              |
| `/admin/settings`                  | Company settings (admin)     |
| `/admin/users`                     | Users list                   |
| `/admin/users/new`                 | Create user                  |
| `/admin/users/[id]`              | User detail / edit           |

### Client Portal Routes (`/`)

| Route                     | Page                         |
|---------------------------|------------------------------|
| `/`                       | Homepage                     |
| `/catalog`                | Parts catalog (browsing)     |
| `/catalog/[category]`    | Parts by category            |
| `/parts/[id]`            | Part detail page             |
| `/cart`                   | Shopping cart                |
| `/checkout`               | Checkout flow                |
| `/order-confirmation/[id]`| Order confirmation           |
| `/account`                | Customer account dashboard   |
| `/account/orders`         | Order history                |
| `/account/orders/[id]`   | Order detail                 |
| `/account/invoices`       | My invoices                  |
| `/account/invoices/[id]` | Invoice detail               |
| `/account/returns`        | My returns                   |
| `/account/profile`        | Profile management           |
| `/login`                  | Customer login               |
| `/register`               | Customer registration        |
| `/forgot-password`        | Password reset               |
