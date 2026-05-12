# Inventory Management System - Setup & Run Guide

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (either local or cloud instance)
  - Local: [Download MongoDB Community](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Recommended)

Verify installations:
```bash
node --version
npm --version
```

---

## 🗄️ Database Setup

### Option 1: Local MongoDB (Recommended for Development)
1. Install MongoDB Community Edition
2. Start MongoDB service:
   - **Windows**: `mongod` or use MongoDB Compass
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Database will be created automatically at `mongodb://localhost:27017/InventoryManagementApp`

### Option 2: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user with credentials
4. Get connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/InventoryManagementApp?retryWrites=true&w=majority`)
5. Add your connection string to `Backend/.env` file

---

## 🚀 Installation & Running

### Step 1: Install Backend Dependencies
```bash
cd Backend
npm install
```

### Step 2: Configure Backend Environment
1. Copy `.env.example` to `.env` (already done)
2. Edit `Backend/.env` and add your MongoDB URI:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

### Step 3: Start Backend Server
```bash
npm run dev
```
✓ Server will start on `http://localhost:4000`

### Step 4: Install Frontend Dependencies (in a new terminal)
```bash
cd Frontend
npm install
```

### Step 5: Start Frontend Development Server
```bash
npm start
```
✓ Frontend will open at `http://localhost:3000`

---

## 📝 Available Scripts

### Backend
```bash
npm run dev     # Start with auto-reload (nodemon)
npm start       # Start production server
npm test        # Run tests
```

### Frontend
```bash
npm start       # Start development server
npm build       # Create production build
npm test        # Run tests
npm eject       # Eject from create-react-app (⚠️ irreversible)
```

---

## 🔧 Troubleshooting

### Backend won't start
- **Error**: `Cannot find module 'dotenv'`
  - Solution: Run `npm install` in Backend folder
  
- **Error**: `MongoDB Connection Error`
  - Check MongoDB service is running
  - Verify `MONGODB_URI` in `.env` file is correct
  - If using MongoDB Atlas, ensure your IP is whitelisted

### Frontend won't start
- **Error**: `ENOSPC: System limit for number of file watchers exceeded`
  - Solution: `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`
  
- **Error**: `Port 3000 already in use`
  - Solution: Kill the process or use a different port: `PORT=3001 npm start`

### CORS Issues
- Frontend proxy is configured in `Frontend/package.json`
- Backend CORS is enabled - should work automatically

---

## 🔗 Project Structure

```
├── Backend/
│   ├── models/          # Database schemas
│   ├── controller/      # Business logic
│   ├── router/          # API routes
│   ├── package.json     # Backend dependencies
│   └── server.js        # Main server file
│
├── Frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   ├── public/          # Static files
│   └── package.json     # Frontend dependencies
```

---

## 📦 Updated Dependencies

### Backend
- Express: ^4.18.2
- Mongoose: ^7.7.0
- Nodemon: ^3.0.1
- CORS: ^2.8.5
- Multer: ^1.4.5-lts.1
- Dotenv: ^16.3.1

### Frontend
- React: ^18.2.0
- React Router DOM: ^6.20.0
- React Scripts: 5.0.1
- Tailwind CSS: ^3.3.6
- HeadlessUI & HeroIcons: Latest versions
- ApexCharts & Chart.js: Latest versions

---

## ✅ Quick Start (One Command)

### Terminal 1 - Backend
```bash
cd Backend && npm install && npm run dev
```

### Terminal 2 - Frontend  
```bash
cd Frontend && npm install && npm start
```

---

## 🎯 Default Login Credentials
Check your MongoDB database for user credentials, or create a new user through the registration page.

---

## ❓ Need Help?

1. Check MongoDB service is running
2. Verify `.env` file exists with correct `MONGODB_URI`
3. Ensure both ports 3000 (Frontend) and 4000 (Backend) are available
4. Check browser console and terminal for errors

Happy coding! 🚀
