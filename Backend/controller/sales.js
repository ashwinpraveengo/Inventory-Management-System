const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");
const { sequelize } = require("../models/index");

// Add Sales
const addSales = async (req, res) => {
  try {
    const addSale = await Sales.create({
      userID: req.body.userID,
      ProductID: req.body.productID,
      StoreID: req.body.storeID,
      StockSold: req.body.stockSold,
      SaleDate: req.body.saleDate,
      TotalSaleAmount: req.body.totalSaleAmount,
    });
    soldStock(req.body.productID, req.body.stockSold);
    res.status(200).send(addSale);
  } catch (err) {
    res.status(402).send(err);
  }
};

// Get All Sales Data
const getSalesData = async (req, res) => {
  try {
    const findAllSalesData = await Sales.findAll({
      where: { userID: req.params.userID },
      include: [
        {
          association: 'product',
          model: require("../models/product"),
        },
        {
          association: 'store',
          model: require("../models/store"),
        }
      ],
      order: [['id', 'DESC']],
    });
    res.json(findAllSalesData);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get total sales amount
const getTotalSalesAmount = async (req, res) => {
  try {
    const salesData = await Sales.findAll({
      where: { userID: req.params.userID },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('TotalSaleAmount')), 'totalSaleAmount']
      ],
      raw: true,
    });
    const totalSaleAmount = salesData[0]?.totalSaleAmount || 0;
    res.json({ totalSaleAmount });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getMonthlySales = async (req, res) => {
  try {
    const sales = await Sales.findAll({
      raw: true,
    });

    // Initialize array with 12 zeros
    const salesAmount = [];
    salesAmount.length = 12;
    salesAmount.fill(0);

    sales.forEach((sale) => {
      const monthIndex = parseInt(sale.SaleDate.split("-")[1]) - 1;
      salesAmount[monthIndex] += sale.TotalSaleAmount;
    });

    res.status(200).json({ salesAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addSales, getMonthlySales, getSalesData, getTotalSalesAmount };
