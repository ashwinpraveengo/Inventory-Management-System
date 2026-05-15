/**
 * Database Seed Script
 * Run: node seed.js
 * 
 * Creates:
 * - 1 Admin user (admin@inventory.com / admin123)
 * - 1 Regular user (user@inventory.com / user123)
 * - 5 Stores
 * - 10 Products (with stock)
 * - 15 Purchase records
 * - 10 Sale records
 */

require("dotenv").config();

const bcrypt = require("bcryptjs");
const sequelize = require("./config/database");
const User = require("./models/users");
const Product = require("./models/product");
const Store = require("./models/store");
const Purchase = require("./models/purchase");
const Sales = require("./models/sales");

const seed = async () => {
  try {
    // Connect and sync
    await sequelize.authenticate();
    console.log("✓ Database connected");
    await sequelize.sync({ force: true }); // WARNING: drops all tables!
    console.log("✓ Tables recreated");

    // ─── USERS ───────────────────────────────────────
    const hashedAdmin = await bcrypt.hash("admin123", 10);
    const hashedUser = await bcrypt.hash("user123", 10);

    const admin = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@inventory.com",
      password: hashedAdmin,
      phoneNumber: "9876543210",
      role: "admin",
    });

    const regularUser = await User.create({
      firstName: "Regular",
      lastName: "User",
      email: "user@inventory.com",
      password: hashedUser,
      phoneNumber: "9876543211",
      role: "user",
    });

    console.log("✓ Users created");
    console.log(`  Admin: admin@inventory.com / admin123`);
    console.log(`  User:  user@inventory.com / user123`);

    // ─── STORES ──────────────────────────────────────
    const storesData = [
      { userID: admin.id, name: "MegaMart Central", category: "Electronics", address: "42 MG Road", city: "Bangalore", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400" },
      { userID: admin.id, name: "QuickStop Express", category: "Grocery", address: "15 Brigade Road", city: "Bangalore", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400" },
      { userID: admin.id, name: "TechZone Hub", category: "Electronics", address: "8 Koramangala", city: "Bangalore", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400" },
      { userID: admin.id, name: "FreshBasket", category: "Grocery", address: "23 Indiranagar", city: "Bangalore", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" },
      { userID: admin.id, name: "StyleVault", category: "Fashion", address: "77 Whitefield", city: "Bangalore", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400" },
    ];

    const stores = await Store.bulkCreate(storesData);
    console.log(`✓ ${stores.length} Stores created`);

    // ─── PRODUCTS ────────────────────────────────────
    const productsData = [
      { userID: admin.id, name: "MacBook Pro 14\"", manufacturer: "Apple", stock: 0, description: "M3 Pro chip, 18GB RAM, 512GB SSD" },
      { userID: admin.id, name: "iPhone 16 Pro", manufacturer: "Apple", stock: 0, description: "6.3-inch Super Retina XDR, A18 Pro chip" },
      { userID: admin.id, name: "Galaxy S25 Ultra", manufacturer: "Samsung", stock: 0, description: "6.9-inch Dynamic AMOLED, Snapdragon 8 Elite" },
      { userID: admin.id, name: "Sony WH-1000XM5", manufacturer: "Sony", stock: 0, description: "Wireless Noise Cancelling Headphones" },
      { userID: admin.id, name: "Dell XPS 15", manufacturer: "Dell", stock: 0, description: "Intel Core i7, 16GB RAM, 512GB SSD" },
      { userID: admin.id, name: "iPad Air M2", manufacturer: "Apple", stock: 0, description: "11-inch Liquid Retina, M2 chip" },
      { userID: admin.id, name: "Logitech MX Master 3S", manufacturer: "Logitech", stock: 0, description: "Wireless Ergonomic Mouse, 8K DPI" },
      { userID: admin.id, name: "Samsung 4K Monitor 32\"", manufacturer: "Samsung", stock: 0, description: "32-inch UHD, HDR10, 60Hz IPS Panel" },
      { userID: admin.id, name: "AirPods Pro 2", manufacturer: "Apple", stock: 0, description: "Active Noise Cancellation, USB-C" },
      { userID: admin.id, name: "Mechanical Keyboard K8", manufacturer: "Keychron", stock: 0, description: "Wireless TKL, Gateron Brown Switches, RGB" },
    ];

    const products = await Product.bulkCreate(productsData);
    console.log(`✓ ${products.length} Products created`);

    // ─── PURCHASES (adds stock) ──────────────────────
    const purchasesData = [
      { userID: admin.id, ProductID: products[0].id, QuantityPurchased: 25, PurchaseDate: "2025-01-15", TotalPurchaseAmount: 49975.00 },
      { userID: admin.id, ProductID: products[1].id, QuantityPurchased: 50, PurchaseDate: "2025-01-20", TotalPurchaseAmount: 54950.00 },
      { userID: admin.id, ProductID: products[2].id, QuantityPurchased: 40, PurchaseDate: "2025-02-05", TotalPurchaseAmount: 47960.00 },
      { userID: admin.id, ProductID: products[3].id, QuantityPurchased: 60, PurchaseDate: "2025-02-10", TotalPurchaseAmount: 17940.00 },
      { userID: admin.id, ProductID: products[4].id, QuantityPurchased: 20, PurchaseDate: "2025-02-18", TotalPurchaseAmount: 25980.00 },
      { userID: admin.id, ProductID: products[5].id, QuantityPurchased: 35, PurchaseDate: "2025-03-01", TotalPurchaseAmount: 24465.00 },
      { userID: admin.id, ProductID: products[6].id, QuantityPurchased: 100, PurchaseDate: "2025-03-10", TotalPurchaseAmount: 9900.00 },
      { userID: admin.id, ProductID: products[7].id, QuantityPurchased: 15, PurchaseDate: "2025-03-15", TotalPurchaseAmount: 5985.00 },
      { userID: admin.id, ProductID: products[8].id, QuantityPurchased: 80, PurchaseDate: "2025-04-01", TotalPurchaseAmount: 18320.00 },
      { userID: admin.id, ProductID: products[9].id, QuantityPurchased: 45, PurchaseDate: "2025-04-10", TotalPurchaseAmount: 4455.00 },
      // Second wave of purchases
      { userID: admin.id, ProductID: products[0].id, QuantityPurchased: 15, PurchaseDate: "2025-05-01", TotalPurchaseAmount: 29985.00 },
      { userID: admin.id, ProductID: products[1].id, QuantityPurchased: 30, PurchaseDate: "2025-05-05", TotalPurchaseAmount: 32970.00 },
      { userID: admin.id, ProductID: products[3].id, QuantityPurchased: 40, PurchaseDate: "2025-05-10", TotalPurchaseAmount: 11960.00 },
      { userID: admin.id, ProductID: products[5].id, QuantityPurchased: 20, PurchaseDate: "2025-05-15", TotalPurchaseAmount: 13980.00 },
      { userID: admin.id, ProductID: products[8].id, QuantityPurchased: 50, PurchaseDate: "2025-05-20", TotalPurchaseAmount: 11450.00 },
    ];

    await Purchase.bulkCreate(purchasesData);

    // Update product stock based on purchases
    const stockUpdates = {};
    purchasesData.forEach(p => {
      stockUpdates[p.ProductID] = (stockUpdates[p.ProductID] || 0) + p.QuantityPurchased;
    });
    for (const [productId, qty] of Object.entries(stockUpdates)) {
      await Product.update({ stock: qty }, { where: { id: productId } });
    }

    console.log(`✓ ${purchasesData.length} Purchases created (stock updated)`);

    // ─── SALES (reduces stock) ───────────────────────
    const salesData = [
      { userID: admin.id, ProductID: products[0].id, StoreID: stores[0].id, StockSold: 10, SaleDate: "2025-02-01", TotalSaleAmount: 21990.00 },
      { userID: admin.id, ProductID: products[1].id, StoreID: stores[0].id, StockSold: 20, SaleDate: "2025-02-15", TotalSaleAmount: 23980.00 },
      { userID: admin.id, ProductID: products[2].id, StoreID: stores[2].id, StockSold: 15, SaleDate: "2025-03-01", TotalSaleAmount: 19485.00 },
      { userID: admin.id, ProductID: products[3].id, StoreID: stores[1].id, StockSold: 30, SaleDate: "2025-03-10", TotalSaleAmount: 9870.00 },
      { userID: admin.id, ProductID: products[4].id, StoreID: stores[2].id, StockSold: 8, SaleDate: "2025-03-20", TotalSaleAmount: 11192.00 },
      { userID: admin.id, ProductID: products[5].id, StoreID: stores[0].id, StockSold: 15, SaleDate: "2025-04-05", TotalSaleAmount: 11235.00 },
      { userID: admin.id, ProductID: products[6].id, StoreID: stores[3].id, StockSold: 40, SaleDate: "2025-04-15", TotalSaleAmount: 4360.00 },
      { userID: admin.id, ProductID: products[8].id, StoreID: stores[1].id, StockSold: 35, SaleDate: "2025-04-25", TotalSaleAmount: 8715.00 },
      { userID: admin.id, ProductID: products[9].id, StoreID: stores[4].id, StockSold: 20, SaleDate: "2025-05-01", TotalSaleAmount: 2180.00 },
      { userID: admin.id, ProductID: products[1].id, StoreID: stores[2].id, StockSold: 15, SaleDate: "2025-05-10", TotalSaleAmount: 17985.00 },
    ];

    await Sales.bulkCreate(salesData);

    // Reduce stock based on sales
    const soldUpdates = {};
    salesData.forEach(s => {
      soldUpdates[s.ProductID] = (soldUpdates[s.ProductID] || 0) + s.StockSold;
    });
    for (const [productId, qty] of Object.entries(soldUpdates)) {
      const product = await Product.findByPk(productId);
      if (product) {
        await Product.update(
          { stock: Math.max(0, product.stock - qty) },
          { where: { id: productId } }
        );
      }
    }

    console.log(`✓ ${salesData.length} Sales created (stock adjusted)`);

    // ─── SUMMARY ─────────────────────────────────────
    const finalProducts = await Product.findAll({ order: [["id", "ASC"]] });
    console.log("\n═══════════════════════════════════════");
    console.log("  DATABASE SEEDED SUCCESSFULLY!");
    console.log("═══════════════════════════════════════");
    console.log("\nFinal Inventory:");
    finalProducts.forEach(p => {
      console.log(`  ${p.name.padEnd(28)} → ${p.stock} units`);
    });
    console.log("\nLogin Credentials:");
    console.log("  Admin: admin@inventory.com / admin123");
    console.log("  User:  user@inventory.com  / user123\n");

    process.exit(0);
  } catch (err) {
    console.error("✗ Seed failed:", err);
    process.exit(1);
  }
};

seed();
