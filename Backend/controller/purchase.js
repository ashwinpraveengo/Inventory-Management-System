const Purchase = require("../models/purchase");
const purchaseStock = require("./purchaseStock");
const { sequelize } = require("../models/index");

// Add Purchase Details
const addPurchase = async (req, res) => {
  try {
    const productID = parseInt(req.body.productID);
    const quantityPurchased = parseInt(req.body.quantityPurchased);
    const totalPurchaseAmount = parseFloat(req.body.totalPurchaseAmount);

    if (isNaN(productID) || isNaN(quantityPurchased) || isNaN(totalPurchaseAmount)) {
      return res.status(400).json({ message: "Invalid input. Please select a valid product and ensure numbers are correct." });
    }

    const addPurchaseDetails = await Purchase.create({
      userID: req.user.id,
      ProductID: productID,
      QuantityPurchased: quantityPurchased,
      PurchaseDate: req.body.purchaseDate,
      TotalPurchaseAmount: totalPurchaseAmount,
    });
    purchaseStock(req.body.productID, quantityPurchased);
    res.status(200).send(addPurchaseDetails);
  } catch (err) {
    console.log("Database error in addPurchase:", err.message);
    res.status(500).json({ message: "Server error while adding purchase." });
  }
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  try {
    const findAllPurchaseData = await Purchase.findAll({
      include: [{
        association: 'product',
        model: require("../models/product"),
      }],
      order: [['id', 'DESC']],
    });
    res.json(findAllPurchaseData);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get total purchase amount
const getTotalPurchaseAmount = async (req, res) => {
  try {
    const purchaseData = await Purchase.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('TotalPurchaseAmount')), 'totalPurchaseAmount']
      ],
      raw: true,
    });
    const totalPurchaseAmount = purchaseData[0]?.totalPurchaseAmount || 0;
    res.json({ totalPurchaseAmount });
  } catch (err) {
    res.status(500).send(err);
  }
};

// Delete Purchase (reverses stock)
const Product = require("../models/product");

const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      where: { id: req.params.id, userID: req.user.id },
    });
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    // Reverse stock: subtract the purchased units
    const product = await Product.findByPk(purchase.ProductID);
    if (product) {
      const newStock = Math.max(0, parseInt(product.stock) - parseInt(purchase.QuantityPurchased));
      await Product.update({ stock: newStock }, { where: { id: purchase.ProductID } });
    }

    await Purchase.destroy({ where: { id: req.params.id } });
    res.json({ message: "Purchase deleted and stock adjusted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Purchase
const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      where: { id: req.params.id, userID: req.user.id },
    });
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    const newQty = parseInt(req.body.quantityPurchased);
    const oldQty = parseInt(purchase.QuantityPurchased);

    // Adjust product stock: reverse old, apply new
    if (!isNaN(newQty) && newQty !== oldQty) {
      const product = await Product.findByPk(purchase.ProductID);
      if (product) {
        const adjustedStock = parseInt(product.stock) - oldQty + newQty;
        await Product.update({ stock: Math.max(0, adjustedStock) }, { where: { id: purchase.ProductID } });
      }
    }

    await Purchase.update(
      {
        QuantityPurchased: newQty || purchase.QuantityPurchased,
        PurchaseDate: req.body.purchaseDate || purchase.PurchaseDate,
        TotalPurchaseAmount: parseFloat(req.body.totalPurchaseAmount) || purchase.TotalPurchaseAmount,
      },
      { where: { id: req.params.id } }
    );

    const updatedPurchase = await Purchase.findByPk(req.params.id);
    res.json(updatedPurchase);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount, deletePurchase, updatePurchase };
