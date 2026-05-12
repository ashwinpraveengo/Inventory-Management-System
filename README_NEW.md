# 📦 Inventory Management System

A full-stack inventory management application built with **Express.js**, **React**, and **PostgreSQL**.

## ✨ Features

- 📊 Dashboard with charts and analytics
- 📦 Product management (Add, Update, Delete)
- 🏪 Store management
- 📥 Purchase tracking
- 📤 Sales management
- 👤 User authentication
- 📱 Responsive design with Tailwind CSS

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL + Sequelize ORM
- CORS enabled
- File upload with Multer

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS
- ApexCharts & Chart.js
- HeadlessUI + HeroIcons

## 📋 Prerequisites

- Node.js (v14+)
- PostgreSQL (v13+) or Docker
- npm or yarn

## 🚀 Quick Start

### 1️⃣ Automated Installation (Recommended)
```bash
chmod +x install.sh
./install.sh
```

### 2️⃣ Manual Installation

**Start PostgreSQL (if using Docker):**
```bash
docker-compose up -d
```

**Backend:**
```bash
cd Backend
npm install
npm run dev
```

**Frontend (in new terminal):**
```bash
cd Frontend
npm install
npm start
```

### 3️⃣ Access the Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- pgAdmin (Database UI): `http://localhost:5050` (if using Docker)

## 📖 Detailed Setup Guide

See [SETUP_POSTGRESQL.md](./SETUP_POSTGRESQL.md) for comprehensive installation and troubleshooting guide.

## 📁 Project Structure

```
├── Backend/
│   ├── config/              # Database configuration
│   ├── models/              # Sequelize models
│   ├── controller/          # Business logic
│   ├── router/              # API endpoints
│   ├── server.js            # Express server
│   ├── package.json
│   ├── .env                 # Environment variables
│   └── .env.example         # Example env file
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
├── docker-compose.yml       # PostgreSQL + pgAdmin services
├── SETUP_POSTGRESQL.md      # Detailed setup guide
├── install.sh               # Auto-install script
└── README.md                # This file
```

## 🔗 API Endpoints

```
POST   /api/login              - User login
POST   /api/register           - User registration
GET    /api/login              - Get logged in user

GET    /api/product            - Get all products
POST   /api/product            - Add new product
PUT    /api/product/:id        - Update product
DELETE /api/product/:id        - Delete product

GET    /api/store              - Get all stores
POST   /api/store              - Add new store

GET    /api/purchase           - Get all purchases
POST   /api/purchase           - Add new purchase

GET    /api/sales              - Get all sales
POST   /api/sales              - Add new sale
```

## 🔧 Environment Configuration

Create `.env` file in `Backend/` folder:

```env
# PostgreSQL Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_management
DB_USER=postgres
DB_PASSWORD=postgres

# Server Port
PORT=4000

# Environment
NODE_ENV=development
```

## 📦 Updated Dependencies

All dependencies have been updated to latest stable versions:

**Backend:** 
- Express 4.18
- Sequelize 6.35.2
- PostgreSQL driver (pg 8.11)
- Nodemon 3.0
- Dotenv 16.3

**Frontend:** 
- React 18
- Tailwind 3.3
- React Router 6.20
- ApexCharts 4.0
- And more...

## ✅ Database Initialization

Database tables are automatically created when the backend starts using Sequelize's `sync()` method. The following tables are created:

- `users` - User accounts
- `product` - Product inventory
- `store` - Store locations
- `purchase` - Purchase records
- `sales` - Sales records

## 🐛 Troubleshooting

**Common Issues:**

1. **PostgreSQL Connection Error**
   - Ensure PostgreSQL is running
   - Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in `.env`
   - For Docker: Ensure containers are running (`docker-compose ps`)

2. **Port Already in Use**
   - Backend: Change `PORT` in `.env`
   - Frontend: `PORT=3001 npm start`

3. **Database Not Created**
   - Sequelize will auto-create tables on first run
   - Manually create database: `createdb inventory_management` (local) or Docker exec

See [SETUP_POSTGRESQL.md](./SETUP_POSTGRESQL.md) for more troubleshooting tips.

## 📝 Scripts Reference

### Backend
```bash
npm run dev      # Development with auto-reload
npm start        # Production server
npm test         # Run tests
```

### Frontend
```bash
npm start        # Development server
npm build        # Production build
npm test         # Run tests
```

## 🤝 Contributing

Feel free to fork this project and submit pull requests.

## 📄 License

ISC

## 👨‍💻 Author

Inventory Management System

---

**Ready to start?** 👉 See [SETUP_POSTGRESQL.md](./SETUP_POSTGRESQL.md) for detailed instructions.

**Using Docker?** 👉 Run `docker-compose up -d` to start PostgreSQL and pgAdmin
