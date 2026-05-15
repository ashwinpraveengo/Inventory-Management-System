const Sales = require("../models/sales");
const soldStock = require("../controller/soldStock");
const { sequelize } = require("../models/index");

// Add Sales
const addSales = async (req, res) => {
  try {
    const productID = parseInt(req.body.productID);
    const storeID = parseInt(req.body.storeID);
    const stockSold = parseInt(req.body.stockSold);
    const totalSaleAmount = parseFloat(req.body.totalSaleAmount);

    if (isNaN(productID) || isNaN(storeID) || isNaN(stockSold) || isNaN(totalSaleAmount)) {
      return res.status(400).json({ message: "Invalid input. Please select a valid product/store and ensure numbers are correct." });
    }

    const addSale = await Sales.create({
      userID: req.user.id,
      ProductID: productID,
      StoreID: storeID,
      StockSold: stockSold,
      SaleDate: req.body.saleDate,
      TotalSaleAmount: totalSaleAmount,
    });
    soldStock(req.body.productID, stockSold);
    res.status(200).send(addSale);
  } catch (err) {
    console.log("Database error in addSales:", err.message);
    res.status(500).json({ message: "Server error while adding sale." });
  }
};

// Get All Sales Data
const getSalesData = async (req, res) => {
  try {
    const findAllSalesData = await Sales.findAll({
      where: { userID: req.user.id },
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
      where: { userID: req.user.id },
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

// Delete Sale (reverses stock)
const Product = require("../models/product");

const deleteSale = async (req, res) => {
  try {
    const sale = await Sales.findOne({
      where: { id: req.params.id, userID: req.user.id },
    });
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    // Reverse stock: add back the sold units
    const product = await Product.findByPk(sale.ProductID);
    if (product) {
      await Product.update(
        { stock: parseInt(product.stock) + parseInt(sale.StockSold) },
        { where: { id: sale.ProductID } }
      );
    }

    await Sales.destroy({ where: { id: req.params.id } });
    res.json({ message: "Sale deleted and stock restored" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Sale
const updateSale = async (req, res) => {
  try {
    const sale = await Sales.findOne({
      where: { id: req.params.id, userID: req.user.id },
    });
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    const newStockSold = parseInt(req.body.stockSold);
    const oldStockSold = parseInt(sale.StockSold);

    // Adjust product stock: reverse old, apply new
    if (!isNaN(newStockSold) && newStockSold !== oldStockSold) {
      const product = await Product.findByPk(sale.ProductID);
      if (product) {
        const adjustedStock = parseInt(product.stock) + oldStockSold - newStockSold;
        await Product.update({ stock: adjustedStock }, { where: { id: sale.ProductID } });
      }
    }

    await Sales.update(
      {
        StockSold: newStockSold || sale.StockSold,
        SaleDate: req.body.saleDate || sale.SaleDate,
        TotalSaleAmount: parseFloat(req.body.totalSaleAmount) || sale.TotalSaleAmount,
      },
      { where: { id: req.params.id } }
    );

    const updatedSale = await Sales.findByPk(req.params.id);
    res.json(updatedSale);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addSales, getMonthlySales, getSalesData, getTotalSalesAmount, deleteSale, updateSale };
