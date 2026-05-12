const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./users');
const Product = require('./product');
const Store = require('./store');

const Sales = sequelize.define('sales', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  ProductID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
  StoreID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Store,
      key: 'id',
    },
  },
  StockSold: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  SaleDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  TotalSaleAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: true,
});

Sales.belongsTo(User, { foreignKey: 'userID' });
Sales.belongsTo(Product, { foreignKey: 'ProductID' });
Sales.belongsTo(Store, { foreignKey: 'StoreID' });

module.exports = Sales;

