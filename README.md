# 📦 InventoryPro — Inventory Management System

A full-stack, role-based inventory management application built with **React**, **Express.js**, **Sequelize**, and **PostgreSQL**. Features a modern SaaS-style UI with Tailwind CSS, JWT authentication, and complete CRUD operations for products, purchases, sales, and stores.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Real-time analytics with sales charts, revenue summaries, and inventory overview |
| 📦 **Inventory Management** | Add, update, delete, and search products with live stock tracking |
| 📥 **Purchase Tracking** | Record purchases — stock automatically increases |
| 📤 **Sales Management** | Record sales — stock automatically decreases |
| 🏪 **Store Management** | Manage multiple store locations with images |
| 🔐 **Authentication** | JWT-based login/register with CAPTCHA verification |
| 🛡️ **Role-Based Access** | Admin (full CRUD) vs User (read-only) permissions |
| 🎨 **Modern UI** | Tailwind CSS with Headless UI modals and Heroicons |
| 📱 **Responsive** | Works on desktop and mobile devices |

---

## 🖥️ Screenshots

### Admin View
- **Dashboard** — Charts, revenue cards, and monthly sales trends
- **Inventory** — Full CRUD with Edit/Delete actions
- **Sales & Purchases** — Add, view, and manage all transactions
- **Store Management** — Card-based store grid with images

### User View
- **Read-only** access to Inventory, Purchase Details, and Stores
- No action buttons (Add, Edit, Delete) are visible

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express.js** | REST API server |
| **PostgreSQL** | Relational database |
| **Sequelize** | ORM for database models |
| **JWT** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **Helmet** | Security headers |
| **express-rate-limit** | API rate limiting |
| **svg-captcha** | Login CAPTCHA |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **React Router 6** | Client-side routing |
| **Tailwind CSS 3** | Utility-first styling |
| **Headless UI** | Accessible modal dialogs |
| **Heroicons** | SVG icon library |
| **ApexCharts + Chart.js** | Dashboard visualizations |

---

## 📋 Prerequisites

- **Node.js** v16 or higher
- **PostgreSQL** v13 or higher
- **npm** v8 or higher

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/ashwinpraveengo/Inventory-Management-System.git
cd Inventory-Management-System
```

### 2. Set up the database

Create a PostgreSQL database:

```sql
CREATE DATABASE inventory_management;
```

### 3. Configure environment variables

```bash
cp Backend/.env.example Backend/.env
```

Edit `Backend/.env` with your credentials:

```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_management
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=4000
NODE_ENV=development

# JWT (generate a strong secret)
JWT_SECRET=your_random_secret_key_here
JWT_EXPIRES=7d
```

### 4. Install dependencies

```bash
# Backend
cd Backend
npm install

# Frontend (new terminal)
cd Frontend
npm install
```

### 5. Seed the database (optional)

Populate the database with sample data:

```bash
cd Backend
node seed.js
```

> ⚠️ This drops all existing tables and recreates them with sample data.

This creates:
| Data | Count | Details |
|------|-------|---------|
| Users | 2 | Admin + Regular user |
| Stores | 5 | Various categories |
| Products | 10 | Electronics with realistic stock |
| Purchases | 15 | Two waves of stock purchases |
| Sales | 10 | Distributed across stores/months |

**Default credentials after seeding:**
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@inventory.com` | `admin123` |
| User | `user@inventory.com` | `user123` |

### 6. Start the application

```bash
# Terminal 1 — Backend
cd Backend
node server.js

# Terminal 2 — Frontend
cd Frontend
npm start
```

### 7. Open in browser

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |

---

## 📁 Project Structure

```
Inventory-Management-System/
│
├── Backend/
│   ├── config/
│   │   └── database.js          # Sequelize PostgreSQL connection
│   ├── controller/
│   │   ├── auth.js              # Login & Register logic
│   │   ├── product.js           # Product CRUD
│   │   ├── purchase.js          # Purchase CRUD + stock adjustment
│   │   ├── sales.js             # Sales CRUD + stock adjustment
│   │   ├── store.js             # Store CRUD
│   │   ├── purchaseStock.js     # Stock increment on purchase
│   │   └── soldStock.js         # Stock decrement on sale
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT token verification
│   │   └── roleMiddleware.js    # Role-based access control
│   ├── models/
│   │   ├── users.js             # User model (admin/user roles)
│   │   ├── product.js           # Product model
│   │   ├── purchase.js          # Purchase model
│   │   ├── sales.js             # Sales model
│   │   ├── store.js             # Store model
│   │   └── index.js             # DB sync & associations
│   ├── router/
│   │   ├── auth.js              # Auth routes
│   │   ├── product.js           # Product routes (role-protected)
│   │   ├── purchase.js          # Purchase routes (role-protected)
│   │   ├── sales.js             # Sales routes (role-protected)
│   │   └── store.js             # Store routes (role-protected)
│   ├── server.js                # Express app entry point
│   ├── seed.js                  # Database seeder script
│   ├── .env.example             # Environment template
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.js        # App shell (sidebar + content)
│   │   │   ├── Header.js        # Top navigation bar
│   │   │   ├── SideMenu.js      # Role-aware sidebar navigation
│   │   │   ├── AddProduct.js    # Add product modal
│   │   │   ├── AddSale.js       # Add sale modal
│   │   │   ├── AddPurchaseDetails.js  # Add purchase modal
│   │   │   ├── AddStore.js      # Add store modal
│   │   │   ├── UpdateProduct.js # Edit product modal
│   │   │   ├── UpdateSale.js    # Edit sale modal
│   │   │   ├── UpdatePurchase.js # Edit purchase modal
│   │   │   └── UpdateStore.js   # Edit store modal
│   │   ├── pages/
│   │   │   ├── Dashboard.js     # Analytics dashboard (admin only)
│   │   │   ├── Inventory.js     # Product inventory (read-only for users)
│   │   │   ├── Sales.js         # Sales records (admin only)
│   │   │   ├── PurchaseDetails.js # Purchase records (read-only for users)
│   │   │   ├── Store.js         # Store management (read-only for users)
│   │   │   ├── Login.js         # Login with CAPTCHA
│   │   │   ├── Register.js      # User registration
│   │   │   ├── Profile.js       # User profile page
│   │   │   ├── ForgotPassword.js
│   │   │   └── ResetPassword.js
│   │   ├── utils/
│   │   │   └── fetchWithAuth.js # Auth-aware fetch wrapper
│   │   ├── App.js               # Root component & routing
│   │   ├── AuthContext.js       # React auth context
│   │   └── ProtectedWrapper.js  # Route guard
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🔗 API Reference

All endpoints require `Authorization: Bearer <token>` unless noted.

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login & get JWT token |
| `GET` | `/api/auth/captcha` | Public | Get CAPTCHA SVG |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/product/get` | All users | List all products |
| `GET` | `/api/product/search?searchTerm=` | All users | Search products |
| `POST` | `/api/product/add` | Admin | Add new product |
| `PUT` | `/api/product/update/:id` | Admin | Update product |
| `DELETE` | `/api/product/delete/:id` | Admin | Delete product + related data |

### Sales
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/sales/get` | All users | List all sales |
| `GET` | `/api/sales/get/totalsaleamount` | All users | Get total sales revenue |
| `GET` | `/api/sales/getmonthly` | All users | Monthly sales breakdown |
| `POST` | `/api/sales/add` | Admin | Record a sale (decrements stock) |
| `PUT` | `/api/sales/update/:id` | Admin | Update sale |
| `DELETE` | `/api/sales/delete/:id` | Admin | Delete sale (restores stock) |

### Purchases
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/purchase/get` | All users | List all purchases |
| `GET` | `/api/purchase/get/totalpurchaseamount` | All users | Get total purchase cost |
| `POST` | `/api/purchase/add` | Admin | Record a purchase (increments stock) |
| `PUT` | `/api/purchase/update/:id` | Admin | Update purchase |
| `DELETE` | `/api/purchase/delete/:id` | Admin | Delete purchase (adjusts stock) |

### Stores
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/store/get` | All users | List all stores |
| `POST` | `/api/store/add` | Admin | Add new store |
| `PUT` | `/api/store/update/:id` | Admin | Update store |
| `DELETE` | `/api/store/delete/:id` | Admin | Delete store |

---

## 🛡️ Role-Based Access Control

| Feature | Admin | User |
|---------|:-----:|:----:|
| Dashboard | ✅ | ❌ |
| View Inventory | ✅ | ✅ |
| Add/Edit/Delete Products | ✅ | ❌ |
| View Purchase Details | ✅ | ✅ |
| Add/Edit/Delete Purchases | ✅ | ❌ |
| View Sales | ✅ | ❌ |
| Add/Edit/Delete Sales | ✅ | ❌ |
| View Stores | ✅ | ✅ |
| Add/Edit/Delete Stores | ✅ | ❌ |
| Profile | ✅ | ✅ |

---

## 🔧 Security Features

- **JWT Authentication** — Stateless token-based auth with configurable expiry
- **Password Hashing** — bcryptjs with 10 salt rounds
- **Helmet** — Secure HTTP headers
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **CAPTCHA** — SVG-based CAPTCHA on login
- **Role Middleware** — Server-side enforcement of admin-only operations
- **CORS** — Cross-origin resource sharing configured

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` on port 5432 | Ensure PostgreSQL is running: `sudo systemctl start postgresql` |
| `relation does not exist` | Run the seed script or restart the server (tables auto-sync) |
| `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` | Already handled — `trust proxy` is set in `server.js` |
| Frontend proxy error | Ensure backend is running on port 4000 before starting frontend |
| `ENOSPC` error (Linux) | Run: `echo fs.inotify.max_user_watches=524288 \| sudo tee -a /etc/sysctl.conf && sudo sysctl -p` |

---

## 📝 Scripts

### Backend
```bash
node server.js       # Start production server
npm run dev          # Start with nodemon (auto-reload)
node seed.js         # Seed database with sample data
```

### Frontend
```bash
npm start            # Development server (port 3000)
npm run build        # Production build
npm test             # Run tests
```
