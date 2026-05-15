const express = require("express");
const app = express();
const purchase = require("../controller/purchase");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Add Purchase
app.post("/add", authMiddleware, roleMiddleware(['admin']), purchase.addPurchase);

// Get All Purchase Data
app.get("/get", authMiddleware, purchase.getPurchaseData);

app.get("/get/totalpurchaseamount", authMiddleware, purchase.getTotalPurchaseAmount);

// Delete Purchase
app.delete("/delete/:id", authMiddleware, roleMiddleware(['admin']), purchase.deletePurchase);

// Update Purchase
app.put("/update/:id", authMiddleware, roleMiddleware(['admin']), purchase.updatePurchase);

module.exports = app;
