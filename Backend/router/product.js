const express = require("express");

const router = express.Router();

const product = require("../controller/product");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ADD PRODUCT
router.post(
  "/add",
  authMiddleware,
  roleMiddleware(['admin', 'manager']),
  product.addProduct
);


// GET PRODUCTS
router.get(
  "/get",
  authMiddleware,
  product.getAllProducts
);


// DELETE PRODUCT
router.delete(
  "/delete/:id",
  authMiddleware,
  product.deleteSelectedProduct
);


// UPDATE PRODUCT
router.put(
  "/update/:id",
  authMiddleware,
  product.updateSelectedProduct
);


// SEARCH PRODUCT
router.get(
  "/search",
  authMiddleware,
  product.searchProduct
);

module.exports = router;