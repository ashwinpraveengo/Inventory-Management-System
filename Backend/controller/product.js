const Product = require("../models/product");

const Purchase = require("../models/purchase");

const Sales = require("../models/sales");

const { Op } = require("sequelize");


// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const newProduct = await Product.create({
      userID: req.user.id,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      stock: req.body.stock || 0,
      description: req.body.description,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// GET PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        userID: req.user.id,
      },

      order: [["id", "DESC"]],
    });

    res.json(products);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// DELETE PRODUCT
const deleteSelectedProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        userID: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Purchase.destroy({
      where: {
        ProductID: req.params.id,
      },
    });

    await Sales.destroy({
      where: {
        ProductID: req.params.id,
      },
    });

    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Product deleted",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// UPDATE PRODUCT
const updateSelectedProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        id: req.params.id,
        userID: req.user.id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.update(
      {
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    const updatedProduct = await Product.findByPk(
      req.params.id
    );

    res.json(updatedProduct);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// SEARCH PRODUCT
const searchProduct = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm;

    const products = await Product.findAll({
      where: {
        userID: req.user.id,

        name: {
          [Op.iLike]: `%${searchTerm}%`,
        },
      },
    });

    res.json(products);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteSelectedProduct,
  updateSelectedProduct,
  searchProduct,
};