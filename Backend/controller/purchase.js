const Purchase = require("../models/purchase");
const purchaseStock = require("./purchaseStock");
const { sequelize } = require("../models/index");

// Add Purchase Details
const addPurchase = async (req, res) => {
  try {
    const addPurchaseDetails = await Purchase.create({
      userID: req.body.userID,
      ProductID: req.body.productID,
      QuantityPurchased: req.body.quantityPurchased,
      PurchaseDate: req.body.purchaseDate,
      TotalPurchaseAmount: req.body.totalPurchaseAmount,
    });
    purchaseStock(req.body.productID, req.body.quantityPurchased);
    res.status(200).send(addPurchaseDetails);
  } catch (err) {
    res.status(402).send(err);
  }
};

// Get All Purchase Data
const getPurchaseData = async (req, res) => {
  try {
    const findAllPurchaseData = await Purchase.findAll({
      where: { userID: req.params.userID },
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
      where: { userID: req.params.userID },
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

module.exports = { addPurchase, getPurchaseData, getTotalPurchaseAmount };
