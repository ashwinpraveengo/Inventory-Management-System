const Product = require("../models/product");
const Purchase = require("../models/purchase");
const Sales = require("../models/sales");
const { Op } = require("sequelize");

// Add Post
const addProduct = async (req, res) => {
  try {
    console.log("req: ", req.body.userId);
    const newProduct = await Product.create({
      userID: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      stock: 0,
      description: req.body.description,
    });
    res.status(200).send(newProduct);
  } catch (err) {
    res.status(402).send(err);
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const findAllProducts = await Product.findAll({
      where: {
        userID: req.params.userId,
      },
      order: [['id', 'DESC']],
    });
    res.json(findAllProducts);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Delete Selected Product
const deleteSelectedProduct = async (req, res) => {
  try {
    const deleteProduct = await Product.destroy({
      where: { id: req.params.id }
    });
    const deletePurchaseProduct = await Purchase.destroy({
      where: { ProductID: req.params.id }
    });
    const deleteSaleProduct = await Sales.destroy({
      where: { ProductID: req.params.id }
    });
    res.json({ deleteProduct, deletePurchaseProduct, deleteSaleProduct });
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update Selected Product
const updateSelectedProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(
      {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
      },
      {
        where: { id: req.body.productID },
        returning: true,
      }
    );
    const updatedProduct = await Product.findByPk(req.body.productID);
    res.json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(402).send("Error");
  }
};

// Search Products
const searchProduct = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;
    const products = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
    });
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProduct,
};

