const express = require("express");
const app = express();
const purchase = require("../controller/purchase");
const authMiddleware = require("../middleware/authMiddleware");

// Add Purchase
app.post("/add", authMiddleware, purchase.addPurchase);

// Get All Purchase Data
app.get("/get", authMiddleware, purchase.getPurchaseData);

app.get("/get/totalpurchaseamount", authMiddleware, purchase.getTotalPurchaseAmount);

module.exports = app;
