# 🍽️ Aaditya's Midway

### AI-Powered Digital Growth System

A modern full-stack restaurant management and digital ordering platform built for **Aaditya's Midway & Restaurant**.

The project combines a customer-facing restaurant website with a secure administration dashboard for managing menu items, categories, customers, orders, restaurant settings, and business analytics.

---

## 📌 Project Overview

**Aaditya's Midway** is a full-stack restaurant web application designed to provide a complete digital experience for both customers and restaurant administrators.

Customers can:

* Browse the restaurant menu
* Explore menu categories
* View item details and images
* Add items to a cart
* Modify quantities
* Register and log in
* Place orders
* Select delivery or dine-in ordering options
* View previous orders
* Track order status

Administrators can:

* Manage menu items
* Manage menu categories
* Manage customers
* View and manage orders
* Update order statuses
* View business analytics
* Configure restaurant settings
* Monitor restaurant activity

The project is also structured with DevOps practices such as Git branching, environment configuration, database migration scripts, security considerations, and deployment readiness.

---

# 🚀 Features

## 👨‍🍳 Customer Features

### Restaurant Website

* Responsive restaurant landing page
* Restaurant information and branding
* Menu browsing
* Category-based menu navigation
* Featured menu items
* Restaurant location section
* Contact information
* Responsive mobile and desktop UI

### Menu

* Menu items organized by categories
* Item descriptions
* Pricing
* Availability status
* Dietary information
* Images with provider/photographer attribution
* Lazy-loaded menu images

### Shopping Cart

* Add items to cart
* Increase/decrease quantity
* Remove items
* Persistent cart using browser local storage
* Automatic subtotal calculation
* Cart item count

### Authentication

* Customer registration
* Customer login
* JWT-based authentication
* Password hashing using bcrypt
* Customer/admin roles
* Persistent login session
* Protected customer functionality
* Protected admin functionality

### Orders

* Authenticated order placement
* Order summary
* Customer information
* Delivery address
* Table number support
* Payment method
* GST calculation
* Order history
* Individual order details
* Order status tracking

### Order Status

Orders can progress through:

```text
RECEIVED
    ↓
PREPARING
    ↓
READY_TO_SERVE
    ↓
SERVED
    ↓
COMPLETED
```

Orders can also be cancelled when applicable.

---

# 🔐 Admin Dashboard

The administration panel provides a centralized interface for restaurant management.

## Dashboard

Provides an overview of:

* Total orders
* Today's orders
* Revenue
* Pending orders
* Recent orders
* Quick management actions

## Menu Management

Administrators can:

* Create menu items
* Edit menu items
* Delete menu items
* Search menu items
* Filter by category
* Filter by availability
* Manage prices
* Manage descriptions
* Manage dietary information
* Manage item availability
* Manage menu images

## Category Management

Categories are stored independently from menu items.

Administrators can:

* Create categories
* Edit categories
* Delete categories
* Activate/deactivate categories
* Set display order
* Search categories
* View the number of menu items in categories

Example categories include:

* Pizzas
* Chinese Starters
* Beverages
* Shakes
* South Indian
* Rice
* Indian Breads
* Desserts
* Mocktails
* Soups
* Sizzlers
* Pastas
* Sandwiches
* Rolls Mania

## Order Management

Administrators can:

* View all customer orders
* View customer information
* View ordered items
* View payment information
* View order totals
* Update order status
* Refresh order data

## Customer Management

Administrators can:

* View registered customers
* View customer information
* View customer roles
* View customer order history

## Analytics

The analytics dashboard provides:

* Total orders
* Revenue
* Average order value
* Active business orders
* Revenue trends
* Order status distribution
* Top-selling items
* Order type breakdown
* Recent orders

Analytics can be filtered by:

* Last 7 days
* Last 30 days
* All time

## Restaurant Settings

Administrators can manage:

* Restaurant name
* Restaurant tagline
* Phone number
* Restaurant location
* GST percentage
* Default payment method
* Order acceptance settings

---

# 🏗️ Technology Stack

## Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* React Router
* Context API
* Fetch API

## Backend

* Node.js
* Express.js
* JavaScript
* REST APIs
* JWT
* bcryptjs
* CORS

## Database

* MongoDB
* Mongoose

## Development & DevOps

* Git
* GitHub
* Git branching workflow
* Environment variables
* Database migration scripts
* Seed scripts
* Pull Request workflow
* CI/CD-ready project structure

---

# 📁 Project Structure

```text
aadityas-midway/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   │
│   ├── scripts/
│   │   ├── migrate-categories.js
│   │   └── migrate-menuitem-category-refs.js
│   │
│   ├── .env
│   └── package.json
│
├── data/
│
├── scripts/
│   ├── generate-image-manifest.js
│   └── seed-menu.js
│
├── .github/
│   └── pull_request_template.md
│
├── .gitignore
├── package.json
└── README.md
```

---

# 🔄 Application Architecture

```text
                    ┌─────────────────────┐
                    │      Customer       │
                    │   React + Vite UI   │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │                     │
                    │ Authentication      │
                    │ Menu Management     │
                    │ Categories          │
                    │ Orders              │
                    │ Users               │
                    └──────────┬──────────┘
                               │
                               │ Mongoose
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    │                     │
                    │ Users               │
                    │ MenuItems           │
                    │ Categories          │
                    │ Orders              │
                    └─────────────────────┘

                    ┌─────────────────────┐
                    │   Admin Dashboard   │
                    │   React + Vite UI   │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                         Express API
```

---

# 🔑 Authentication Architecture

Authentication uses JWT tokens.

### Customer registration

```text
Customer
   ↓
POST /api/auth/register
   ↓
Password hashed using bcrypt
   ↓
User created
   ↓
Customer role assigned
```

### Login

```text
User
 ↓
POST /api/auth/login
 ↓
Credentials validated
 ↓
JWT generated
 ↓
Token stored by frontend
 ↓
Authenticated requests
```

### Role-based access

Two roles are supported:

```text
customer
admin
```

Admin APIs require:

```text
Authorization: Bearer <JWT>
```

and an authenticated user with the `admin` role.

---

# 📡 API Overview

## Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Menu

```http
GET    /api/menu
GET    /api/menu/categories
GET    /api/menu/category/:slug
GET    /api/menu/:slug
GET    /api/menu/:slug/image
```

Admin menu operations include creating, updating and deleting menu items.

## Categories

### Public

```http
GET /api/categories
GET /api/categories/:id
```

### Admin

```http
GET    /api/categories/admin/all
POST   /api/categories/admin
PATCH  /api/categories/admin/:id
DELETE /api/categories/admin/:id
```

## Orders

```http
POST  /api/orders
GET   /api/orders/my-orders
GET   /api/orders/:id
PATCH /api/orders/:id/status
```

### Admin

```http
GET /api/orders/admin/all
GET /api/orders/admin/user/:userId
```

## Users

### Admin

```http
GET /api/users/admin/all
GET /api/users/admin/:id
```

## Health Check

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "Aaditya's Midway API is running",
  "environment": "development"
}
```

---

# ⚙️ Environment Configuration

Environment variables are used to keep configuration and secrets outside the source code.

## Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000
```

A template is provided as:

```text
frontend/.env.example
```

## Backend

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_secret

FRONTEND_URL=http://localhost:5173
```

> Never commit `.env` files or production secrets to Git.

---

# 💻 Local Development

## Prerequisites

Install:

* Node.js 22+
* npm
* MongoDB or MongoDB Atlas
* Git

---

## 1. Clone the repository

```bash
git clone <repository-url>
cd aadityas-midway
```

---

## 2. Install dependencies

### Root

```bash
npm install
```

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd ../backend
npm install
```

---

# ▶️ Running the Application

You need two terminals.

## Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

---

## Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🗄️ Database

The application uses MongoDB with Mongoose.

Main collections/models:

```text
User
MenuItem
Category
Order
```

### Category architecture

Categories are stored independently:

```text
Category
   │
   ├── _id
   ├── name
   ├── slug
   ├── description
   ├── isActive
   └── displayOrder
          │
          ▼
       MenuItem
          │
          └── category → Category ObjectId
```

This provides a cleaner relational reference between menu items and categories instead of storing category information directly inside every menu item.

---

# 🔄 Database Migration

Category data was migrated from the previous embedded category structure to dedicated MongoDB `Category` documents.

Migration scripts are available under:

```text
backend/scripts/
```

### Create categories

```bash
node scripts/migrate-categories.js
```

### Convert menu item category references

```bash
node scripts/migrate-menuitem-category-refs.js
```

The migration process:

```text
Existing MenuItems
       ↓
Extract unique categories
       ↓
Create Category documents
       ↓
Map MenuItems to Category IDs
       ↓
Update MenuItems
```

The migration scripts are designed to preserve existing menu data while moving the application toward a normalized category structure.

---

# 🌱 Menu Seeding

The project also contains scripts for menu data generation/seeding.

From the project root:

```bash
npm run seed:menu
```

Image manifest generation:

```bash
npm run generate:image-manifest
```

---

# 🌿 Git Workflow

The project follows a feature-based Git workflow.

Recommended structure:

```text
main
  │
  └── development
        │
        ├── feature/frontend
        ├── feature/backend
        ├── feature/authentication
        ├── feature/menu-management
        ├── feature/category-management
        └── feature/admin-dashboard
```

### Typical workflow

```bash
git checkout development

git pull origin development

git checkout -b feature/category-management
```

Make changes and commit:

```bash
git add .

git commit -m "feat: add category management"
```

Push:

```bash
git push -u origin feature/category-management
```

Then create a Pull Request into:

```text
development
```

After testing and review, changes can be merged toward:

```text
main
```

---

# 🔒 Security

The application follows several security practices:

* Passwords are hashed using bcrypt
* Authentication uses signed JWT tokens
* Admin APIs use role-based authorization
* Password fields are excluded from admin user responses
* Secrets are stored in environment variables
* `.env` files are excluded from Git
* CORS is configured through environment variables
* Protected routes require authentication
* User roles are validated on the backend

### Production recommendations

Before production deployment:

* Generate a strong random `JWT_SECRET`
* Use HTTPS
* Restrict CORS to the production frontend
* Use secure production database credentials
* Never expose MongoDB credentials
* Add request rate limiting
* Add stronger request validation
* Add security headers
* Configure centralized logging
* Monitor API errors and uptime

---

# 📊 DevOps Scope

The project is structured to support the following DevOps responsibilities:

### Version Control

* Git
* GitHub
* Feature branches
* Pull Requests
* Code review workflow

### Environment Management

* `.env`
* `.env.example`
* Development configuration
* Production configuration

### Database Operations

* MongoDB
* Mongoose
* Database migration scripts
* Seed scripts
* Backup/migration readiness

### CI/CD

The repository structure is prepared for automated:

```text
Code Push
   ↓
CI Pipeline
   ↓
Install Dependencies
   ↓
Lint / Test
   ↓
Build
   ↓
Deployment
```

### Monitoring

Production monitoring can be integrated for:

* API uptime
* Application errors
* Database connectivity
* Request failures
* Deployment health

---

# 🧪 Testing Checklist

Before merging a feature, verify:

### Frontend

* [ ] Application builds successfully
* [ ] No console errors
* [ ] Responsive layout works
* [ ] Forms validate correctly
* [ ] Loading states work
* [ ] Error states work

### Backend

* [ ] API starts successfully
* [ ] MongoDB connects successfully
* [ ] Protected routes reject unauthorized requests
* [ ] Admin routes reject customer accounts
* [ ] Invalid requests return appropriate status codes
* [ ] CRUD operations work correctly

### Authentication

* [ ] Customer registration works
* [ ] Customer login works
* [ ] Admin login works
* [ ] Invalid credentials are rejected
* [ ] Protected APIs require JWT
* [ ] Admin APIs require admin role

### Orders

* [ ] Customer can place an order
* [ ] Order appears in order history
* [ ] Admin can view orders
* [ ] Admin can update order status
* [ ] Order totals calculate correctly

### Categories

* [ ] Categories load
* [ ] Category creation works
* [ ] Category editing works
* [ ] Category activation/deactivation works
* [ ] Category deletion works
* [ ] Menu items reference categories correctly

---

# 🎨 Design System

The application uses a restaurant-inspired visual identity.

### Primary Colors

```text
Deep Forest Green  #173F35
Green Light        #28594C
Green Dark         #0F2D26

Aaditya Gold       #D4A72C
Gold Light         #E4C35F
Gold Dark          #AD831C

Cream              #FAF6EC
Warm White         #FFFDF8

Tamarind Brown     #6B4632
Terracotta         #B85C38
```

### Typography

Primary display font:

```text
Playfair Display
```

Body/UI font:

```text
DM Sans
```

The design focuses on a warm, family-friendly Indian restaurant aesthetic while maintaining a modern digital interface.

---

# 📱 Responsive Design

The frontend is designed for:

* Desktop
* Laptop
* Tablet
* Mobile

The customer website and admin dashboard both use responsive Tailwind CSS layouts.

---

# 🛣️ Current Project Status

### Completed

* [x] Restaurant customer website
* [x] Responsive UI
* [x] Menu browsing
* [x] Menu categories
* [x] Shopping cart
* [x] Customer authentication
* [x] Admin authentication
* [x] JWT authorization
* [x] Order creation
* [x] Order history
* [x] Order status management
* [x] Admin dashboard
* [x] Menu CRUD
* [x] Category CRUD
* [x] Customer management
* [x] Analytics dashboard
* [x] Restaurant settings
* [x] MongoDB integration
* [x] Category database migration
* [x] Environment configuration
* [x] Git/GitHub workflow structure

### Planned / Deployment Phase

* [ ] Automated CI/CD pipeline
* [ ] Production frontend deployment
* [ ] Production backend deployment
* [ ] Production MongoDB configuration
* [ ] Automated database backup
* [ ] Production monitoring
* [ ] Centralized error logging
* [ ] Production security hardening

---

# 📍 Restaurant Information

**AADITYA MIDWAY & Restaurant**

> Good food, Good mood

📞 **Phone:** 8435172222

📍 **Location:** Gokuldham, Aaditya Smart City, Kairitaigaon, Nagpur–Chhindwara Road

The application is designed around a casual family-friendly midway restaurant experience featuring Indian/desi food, Punjabi dishes, Chinese/Indo-Chinese food, fast food, snacks, beverages and more.

---

# 👨‍💻 Project

**Project:** Aaditya's Midway — AI-Powered Digital Growth System

**Role:** DevOps Intern

**Organization:** AD TECH ENTERPRISES PVT. LTD.

**Application Type:** Full-Stack Restaurant Management & Ordering Platform

**Architecture:** MERN-style full-stack architecture

```text
React + Vite
     │
     ▼
Express + Node.js
     │
     ▼
MongoDB + Mongoose
```

---

# 📄 License

This project is developed as part of an internship/project assignment for **AD TECH ENTERPRISES PVT. LTD.**

All rights reserved unless otherwise specified.
