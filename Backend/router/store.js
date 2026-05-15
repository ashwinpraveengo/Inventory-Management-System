const express = require("express");
const app = express();
const store = require("../controller/store");
const authMiddleware = require("../middleware/authMiddleware");

// Add Store 
app.post("/add", authMiddleware, store.addStore);

// Get All Store
app.get("/get", authMiddleware, store.getAllStores)

module.exports = app;
