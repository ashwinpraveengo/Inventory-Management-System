#!/bin/bash

# Inventory Management System - Setup Script

echo "🔧 Installing Inventory Management System..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Install Node.js first: https://nodejs.org/"
    exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✓ Node.js detected: $(node -v)"
echo "✓ npm detected: $(npm -v)"
echo ""

# Install Backend Dependencies
echo "📦 Installing Backend Dependencies..."
cd Backend || exit

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Backend installation failed!"
    exit 1
fi

cd ..
echo "✓ Backend dependencies installed"
echo ""

# Install Frontend Dependencies
echo "📦 Installing Frontend Dependencies..."
cd Frontend || exit

npm install

if [ $? -ne 0 ]; then
    echo ""
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
echo "🌐 Application URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:4000"
echo ""
echo "📖 For detailed setup instructions, see SETUP.md"