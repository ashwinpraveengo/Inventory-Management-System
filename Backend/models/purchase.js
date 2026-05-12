const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./users');
const Product = require('./product');

const Purchase = sequelize.define('purchase', {
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
  QuantityPurchased: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PurchaseDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  TotalPurchaseAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: true,
});

Purchase.belongsTo(User, { foreignKey: 'userID' });
Purchase.belongsTo(Product, { foreignKey: 'ProductID' });

module.exports = Purchase;

