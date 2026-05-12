const sequelize = require('../config/database');
const User = require('./users');
const Product = require('./product');
const Store = require('./store');
const Purchase = require('./purchase');
const Sales = require('./sales');

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✓ Database Connected Successfully');
    
    // Sync all models with database
    await sequelize.sync({ alter: true });
    console.log('✓ Database Models Synced');
  } catch (err) {
    console.error('✗ Database Connection Error: ', err.message);
    process.exit(1);
  }
}

module.exports = { 
  main,
  sequelize,
  User,
  Product,
  Store,
  Purchase,
  Sales,
};