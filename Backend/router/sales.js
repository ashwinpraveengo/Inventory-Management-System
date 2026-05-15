const express = require("express");
const app = express();
const sales = require("../controller/sales");
const authMiddleware = require("../middleware/authMiddleware");

// Add Sales
app.post("/add", authMiddleware, sales.addSales);

// Get All Sales
app.get("/get", authMiddleware, sales.getSalesData);
app.get("/getmonthly", authMiddleware, sales.getMonthlySales);

app.get("/get/totalsaleamount", authMiddleware, sales.getTotalSalesAmount);

// Delete Sale
app.delete("/delete/:id", authMiddleware, sales.deleteSale);

// Update Sale
app.put("/update/:id", authMiddleware, sales.updateSale);

module.exports = app;
