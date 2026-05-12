# Inventory Management System - Setup & Run Guide (PostgreSQL)

## 📋 Prerequisites

Make sure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v13 or higher)
  - [Download PostgreSQL](https://www.postgresql.org/download/)
  - OR use Docker (recommended for easier setup)

Verify installations:
```bash
node --version
npm --version
psql --version  # PostgreSQL (optional if using Docker)
```

---

## 🗄️ Database Setup

### Option 1: PostgreSQL with Docker (Recommended for Development)

**Prerequisites:** Docker and Docker Compose installed

1. **Start PostgreSQL in Docker:**
```bash
cd /path/to/project
docker-compose up -d
```

This will start:
- **PostgreSQL** on `localhost:5432`
- **pgAdmin** (Web UI) on `http://localhost:5050`

2. **pgAdmin Credentials:**
   - Email: `admin@example.com`
   - Password: `admin`

3. **Database Credentials:**
   - Host: `postgres` (from Docker) or `localhost` (from local)
   - Port: `5432`
   - Database: `inventory_management`
   - Username: `postgres`
   - Password: `postgres`

### Option 2: Local PostgreSQL Installation

1. **Install PostgreSQL**
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql@15`
   - **Linux/Fedora**: `sudo dnf install -y postgresql postgresql-server`

2. **Start PostgreSQL Service**
   - **Windows**: Already running after installation
   - **macOS**: `brew services start postgresql@15`
   - **Linux**: `sudo systemctl start postgresql`

3. **Create Database**
```bash
sudo -u postgres psql
CREATE DATABASE inventory_management;
\q
```

---

## 🚀 Installation & Running

### Step 1: Install Backend Dependencies
```bash
cd Backend
npm install
```

### Step 2: Configure Backend Environment
1. The `.env` file already exists with PostgreSQL configuration
2. Verify `Backend/.env` has correct PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_management
DB_USER=postgres
DB_PASSWORD=postgres
PORT=4000
NODE_ENV=development
```

**For Docker PostgreSQL:** Use `postgres` as `DB_HOST` when connecting from another container, or `localhost` from your local machine.

### Step 3: Start Backend Server
```bash
npm run dev
```
✓ Server will start on `http://localhost:4000`
✓ Database tables will be created automatically by Sequelize

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

**Error**: `Cannot find module 'pg'` or `Cannot find module 'sequelize'`
- Solution: Run `npm install` in Backend folder

**Error**: `connect ECONNREFUSED` or database connection error
- Check PostgreSQL service is running
- Verify `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in `.env` file
- Try: `psql -U postgres -h localhost` to test connection

**Error**: `database "inventory_management" does not exist`
- Create database: 
  - For Docker: `docker exec -u postgres inventory-postgres createdb inventory_management`
  - For local: `sudo -u postgres createdb inventory_management`

### Frontend won't start

**Error**: `ENOSPC: System limit for number of file watchers exceeded`
- Solution (Linux): `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

**Error**: `Port 3000 already in use`
- Solution: Kill the process or use a different port: `PORT=3001 npm start`

### Docker Issues

**PostgreSQL container won't start**
- Check Docker daemon is running: `docker ps`
- View logs: `docker logs inventory-postgres`
- Remove and restart: `docker-compose down && docker-compose up -d`

---

## 📊 Database Management

### Using pgAdmin (Web Interface)
1. Open `http://localhost:5050`
2. Login with: `admin@example.com` / `admin`
3. Add server:
   - Host: `postgres` (if Docker) or `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`

### Using Command Line (psql)
```bash
# Connect to database
psql -U postgres -h localhost -d inventory_management

# List tables
\dt

# View table structure
\d+ product

# Execute SQL
SELECT * FROM users;

# Exit
\q
```

---

## 🔗 Project Structure

```
├── Backend/
│   ├── config/
│   │   └── database.js      # Sequelize configuration
│   ├── models/              # Sequelize models
│   ├── controller/          # Business logic
│   ├── router/              # API routes
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
├── docker-compose.yml       # PostgreSQL + pgAdmin
├── SETUP.md                 # This file
├── install.sh               # Auto-install script
└── README.md
```

---

## 📦 Technology Stack

**Backend:**
- Node.js + Express.js ^4.18.2
- PostgreSQL 13+
- Sequelize 6.35.2 (ORM)
- CORS enabled
- Multer for file uploads

**Frontend:**
- React 18
- React Router DOM 6.20
- Tailwind CSS 3.3
- ApexCharts & Chart.js
- HeadlessUI + HeroIcons

---

## ✅ Verification Checklist

After setup, verify:
- [ ] PostgreSQL running (check port 5432)
- [ ] Backend database connected (`✓ Database Connected Successfully`)
- [ ] Backend server running on port 4000
- [ ] Frontend running on port 3000
- [ ] Can access database via pgAdmin (port 5050) or psql

---

## 🎯 Quick Start (One Command)

### Using Docker (Recommended)
```bash
# Terminal 1 - Start PostgreSQL
docker-compose up -d

# Terminal 2 - Backend
cd Backend && npm install && npm run dev

# Terminal 3 - Frontend
cd Frontend && npm install && npm start
```

### Local PostgreSQL
```bash
# Ensure PostgreSQL is running first

# Terminal 1 - Backend
cd Backend && npm install && npm run dev

# Terminal 2 - Frontend
cd Frontend && npm install && npm start
```

---

## ❓ Need Help?

1. Check PostgreSQL service is running: `docker-compose ps` or `psql --version`
2. Verify database credentials in `.env`
3. Check both ports 3000 and 4000 are available
4. Review browser console and terminal for errors
5. Check pgAdmin at `http://localhost:5050` to verify database and tables

Happy coding! 🚀
