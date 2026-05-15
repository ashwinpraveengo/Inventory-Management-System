const express = require("express");
const app = express();
const sales = require("../controller/sales");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Add Sales
app.post("/add", authMiddleware, roleMiddleware(['admin']), sales.addSales);

// Get All Sales
app.get("/get", authMiddleware, sales.getSalesData);
app.get("/getmonthly", authMiddleware, sales.getMonthlySales);

app.get("/get/totalsaleamount", authMiddleware, sales.getTotalSalesAmount);

// Delete Sale
app.delete("/delete/:id", authMiddleware, roleMiddleware(['admin']), sales.deleteSale);

// Update Sale
app.put("/update/:id", authMiddleware, roleMiddleware(['admin']), sales.updateSale);

module.exports = app;
