const express = require("express");
const app = express();
const store = require("../controller/store");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Add Store 
app.post("/add", authMiddleware, roleMiddleware(['admin']), store.addStore);

// Get All Store
app.get("/get", authMiddleware, store.getAllStores);

// Delete Store
app.delete("/delete/:id", authMiddleware, store.deleteStore);

// Update Store
app.put("/update/:id", authMiddleware, store.updateStore);

module.exports = app;
