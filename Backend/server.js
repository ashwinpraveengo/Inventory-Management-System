require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const xss = require("xss-clean");
const csurf = require("csurf");

const { main } = require("./models");

const productRouter = require("./router/product");
const purchaseRouter = require("./router/purchase");
const salesRouter = require("./router/sales");
const storeRouter = require("./router/store");
const authRouter = require("./router/auth");

const app = express();

// Trust proxy for rate limiting behind proxies like development servers
app.set("trust proxy", 1);

// SECURITY HEADERS
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// COOKIES
app.use(cookieParser());

// BODY PARSER
app.use(express.json());

// PREVENT XSS
app.use(xss());

// RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests",
});

app.use(limiter);

// CSRF PROTECTION
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});
// We apply csrfProtection globally to all routes except API Auth routes initially to allow login
// Then apply CSRF to all other routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api/auth/login") || req.path.startsWith("/api/auth/register")) {
    next();
  } else {
    csrfProtection(req, res, next);
  }
});



// Serve uploaded files statically
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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