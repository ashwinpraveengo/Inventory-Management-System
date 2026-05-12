#!/bin/bash

# Inventory Management System - Setup Script

echo "🔧 Installing Inventory Management System..."
echo ""

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
echo "📖 For detailed setup instructions, see SETUP.md"
