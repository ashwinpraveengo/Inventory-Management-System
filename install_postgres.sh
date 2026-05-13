#!/bin/bash

# Inventory Management System - Setup Script (PostgreSQL Version)

echo "🔧 Installing Inventory Management System (PostgreSQL)..."
echo ""

# -----------------------------
# Check Docker
# -----------------------------

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo ""
    echo "Install Docker first:"
    echo "https://docs.docker.com/engine/install/"
    exit 1
fi

echo "✓ Docker detected"

# -----------------------------
# Check Modern Docker Compose
# -----------------------------

if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ Modern Docker Compose plugin not found!"
    echo ""
    echo "Install it using:"
    echo "sudo apt update"
    echo "sudo apt install docker-compose-plugin"
    exit 1
fi

echo "✓ Compose command: $COMPOSE_CMD"
echo ""

# -----------------------------
# Start PostgreSQL Containers
# -----------------------------

read -p "Do you want to start PostgreSQL using Docker? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then

    echo ""
    echo "🐳 Starting PostgreSQL with Docker..."
    echo ""

    # Stop existing containers
    $COMPOSE_CMD down

    # Start containers
    $COMPOSE_CMD up -d

    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Docker containers failed to start!"
        echo ""
        echo "Possible causes:"
        echo "  • Docker daemon not running"
        echo "  • Invalid docker-compose.yml"
        echo "  • Port conflict"
        echo ""
        exit 1
    fi

    echo ""
    echo "✓ PostgreSQL container started"
    echo "✓ pgAdmin container started"
    echo ""

    echo "🌐 Services:"
    echo "  PostgreSQL: localhost:5433"
    echo "  pgAdmin: http://localhost:5050"
    echo ""

    sleep 3
fi

# -----------------------------
# Check Node.js
# -----------------------------

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Install Node.js first:"
    echo "https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js detected: $(node -v)"

# -----------------------------
# Check npm
# -----------------------------

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✓ npm detected: $(npm -v)"
echo ""

# -----------------------------
# Install Backend Dependencies
# -----------------------------

echo "📦 Installing Backend Dependencies..."

cd Backend || {
    echo "❌ Backend directory not found!"
    exit 1
}

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Backend installation failed!"
    exit 1
fi

cd ..

echo "✓ Backend dependencies installed"
echo ""

# -----------------------------
# Install Frontend Dependencies
# -----------------------------

echo "📦 Installing Frontend Dependencies..."

cd Frontend || {
    echo "❌ Frontend directory not found!"
    exit 1
}

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Frontend installation failed!"
    exit 1
fi

cd ..

echo "✓ Frontend dependencies installed"
echo ""

# -----------------------------
# Final Instructions
# -----------------------------

echo "✅ Installation Complete!"
echo ""

echo "🚀 To start the project:"
echo ""

echo "Terminal 1 - Backend:"
echo "  cd Backend && npm run dev"
echo ""

echo "Terminal 2 - Frontend:"
echo "  cd Frontend && npm start"
echo ""

echo "🌐 Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:4000"
echo "  pgAdmin: http://localhost:5050"
echo ""

echo "🗄 PostgreSQL Connection:"
echo "  Host: localhost"
echo "  Port: 5433"
echo "  User: postgres"
echo "  Password: postgres"
echo "  Database: inventory_management"
echo ""

echo "📖 For detailed setup instructions, see SETUP_POSTGRESQL.md"