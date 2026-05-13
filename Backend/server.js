require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const { main } = require("./models");

const productRouter = require("./router/product");
const purchaseRouter = require("./router/purchase");
const salesRouter = require("./router/sales");
const storeRouter = require("./router/store");
const authRouter = require("./router/auth");

const app = express();


// SECURITY HEADERS
app.use(helmet());


// CORS
app.use(cors());


// BODY PARSER
app.use(express.json());


// RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests",
});

app.use(limiter);


// ROUTES
app.use("/api/auth", authRouter);

app.use("/api/product", productRouter);

app.use("/api/purchase", purchaseRouter);

app.use("/api/sales", salesRouter);

app.use("/api/store", storeRouter);


// DATABASE
main();


// START SERVER
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});