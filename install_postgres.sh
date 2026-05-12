#!/bin/bash

# Inventory Management System - Setup Script (PostgreSQL Version)

echo "🔧 Installing Inventory Management System (PostgreSQL)..."
echo ""

# Check if Docker is available for PostgreSQL setup
if command -v docker-compose &> /dev/null; then
    read -p "Do you want to start PostgreSQL using Docker? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🐳 Starting PostgreSQL with Docker..."
        docker-compose up -d
        echo "✓ PostgreSQL running on localhost:5432"
        echo "✓ pgAdmin running on http://localhost:5050"
        echo ""
        sleep 3
    fi
fi

# Install Backend Dependencies
echo "📦 Installing Backend Dependencies..."
cd Backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed!"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"
echo ""

# Install Frontend Dependencies
echo "📦 Installing Frontend Dependencies..."
cd Frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed!"
    exit 1
fi
cd ..
echo "✓ Frontend dependencies installed"
echo ""

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
echo "📖 For detailed setup instructions, see SETUP_POSTGRESQL.md"
echo ""
echo "🌐 Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:4000"
echo "  pgAdmin: http://localhost:5050 (admin@example.com / admin)"
