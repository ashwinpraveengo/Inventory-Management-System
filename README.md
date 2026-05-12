# 📦 Inventory Management System

A full-stack inventory management application built with **Express.js**, **React**, and **MongoDB**.

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
- MongoDB + Mongoose
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
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1️⃣ Automated Installation (Recommended)
```bash
chmod +x install.sh
./install.sh
```

### 2️⃣ Manual Installation

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

## 📖 Detailed Setup Guide

See [SETUP.md](./SETUP.md) for comprehensive installation and troubleshooting guide.

## 📁 Project Structure

```
├── Backend/
│   ├── models/          # Database schemas
│   ├── controller/      # Business logic
│   ├── router/          # API endpoints
│   ├── server.js        # Express server
│   ├── package.json
│   ├── .env             # Environment variables
│   └── .env.example     # Example env file
│
├── Frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
├── SETUP.md             # Detailed setup guide
├── install.sh           # Auto-install script
└── README.md            # This file
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
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/InventoryManagementApp

# Server Port
PORT=4000

# Environment
NODE_ENV=development
```

## 📦 Updated Dependencies

All dependencies have been updated to latest stable versions:

**Backend:** Express 4.18, Mongoose 7.7, Nodemon 3.0, Dotenv 16.3

**Frontend:** React 18, Tailwind 3.3, React Router 6.20, and more

## ✅ Verification Checklist

- [x] Dependencies updated
- [x] Environment variables configured
- [x] Database connection setup
- [x] CORS enabled
- [x] Frontend proxy configured
- [x] Scripts optimized
- [x] Ready for development and production

## 🐛 Troubleshooting

**Common Issues:**

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`

2. **Port Already in Use**
   - Backend: Change `PORT=4000` in `.env`
   - Frontend: `PORT=3001 npm start`

3. **ENOSPC Error (Linux)**
   - Run: `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

See [SETUP.md](./SETUP.md) for more troubleshooting tips.

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

**Ready to start?** 👉 See [SETUP.md](./SETUP.md) for detailed instructions.
