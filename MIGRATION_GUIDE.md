# MongoDB → PostgreSQL Migration Guide

This document outlines all changes made to migrate from MongoDB to PostgreSQL.

## 📊 Database Changes

### Technology Stack

| Component | Before | After |
|-----------|--------|-------|
| Database | MongoDB | PostgreSQL 13+ |
| ODM/ORM | Mongoose | Sequelize 6.35.2 |
| Driver | Mongoose | pg 8.11.3 |
| Connection | MongoDB URI | PostgreSQL credentials |

---

## 📝 Files Modified

### Backend - Models (`/Backend/models/`)

All models have been converted from Mongoose to Sequelize ORM.

**Changes in each model file:**

1. **models/index.js**
   - Removed: `mongoose.connect()`
   - Added: Sequelize connection with `sequelize.authenticate()`
   - Added: `sequelize.sync()` for auto-table creation
   - Now exports: sequelize instance + all models

2. **models/users.js**
   - Removed: `mongoose.Schema`
   - Added: Sequelize `DataTypes` and table definition
   - Added: `id` as auto-increment primary key
   - Added: Foreign key references where needed

3. **models/product.js**
   - Changed: ObjectId references → integer IDs
   - Added: Proper relationships with `belongsTo()`
   - Changed: Timestamps handling for PostgreSQL

4. **models/store.js**
   - Converted to Sequelize table definition
   - Added: Foreign key to users table
   - Changed: MongoDB refs to Sequelize associations

5. **models/purchase.js**
   - Converted to Sequelize model
   - Added: Foreign key references (users, products)
   - Changed: ._populate() → .include() in queries

6. **models/sales.js**
   - Converted to Sequelize model
   - Added: Three foreign keys (users, products, stores)
   - Changed: Query methods to Sequelize syntax

### Backend - Controllers (`/Backend/controller/`)

All controllers updated to use Sequelize query methods instead of Mongoose.

**Key Query Changes:**

| Mongoose | Sequelize |
|----------|-----------|
| `Model.find({})` | `Model.findAll({})` |
| `Model.findOne({})` | `Model.findOne({ where: {} })` |
| `Model.findByIdAndUpdate()` | `Model.update()` with where clause |
| `Model.deleteOne()` | `Model.destroy({ where: {} })` |
| `.save()` | `Model.create()` |
| `populate()` | `include` option |
| `{ $regex: term }` | `Op.iLike: %term%` |
| `sort({ _id: -1 })` | `order: [['id', 'DESC']]` |

**Modified Files:**

1. **controller/product.js** ✅
   - `addProduct`: Changed from `.save()` to `.create()`
   - `getAllProducts`: Updated with `findAll()` + `where`
   - `deleteSelectedProduct`: Using `.destroy()` for all related records
   - `updateSelectedProduct`: Using `.update()` method
   - `searchProduct`: Using Sequelize `Op.iLike` for regex search

2. **controller/store.js** ✅
   - Updated all methods to Sequelize queries
   - Changed `.save()` to `.create()`
   - Changed `.find()` to `.findAll()`

3. **controller/purchase.js** ✅
   - Updated purchase creation
   - Changed `.populate()` to `.include()`
   - Using aggregation for total amount: `sequelize.fn('SUM')`

4. **controller/sales.js** ✅
   - Similar updates as purchase controller
   - Added `.include()` for relationships
   - Using Sequelize aggregation functions

5. **controller/purchaseStock.js** ✅
   - Changed `.findOne()` → `.findByPk()`
   - Changed `.findByIdAndUpdate()` → `.update()`

6. **controller/soldStock.js** ✅
   - Same changes as purchaseStock.js

### Backend - Server (`/Backend/server.js`)

1. **Login endpoint** - `/api/login` (POST)
   - Before: `User.findOne({ email, password })`
   - After: `User.findOne({ where: { email, password } })`

2. **Registration endpoint** - `/api/register` (POST)
   - Before: `new User().save()`
   - After: `User.create({})`

3. **Model imports**
   - Now imports from models/index.js exports
   - Cleaner structure

### Backend - Configuration

1. **New file: config/database.js** ✅
   - Sequelize connection setup
   - PostgreSQL driver configuration
   - Connection pooling ready

2. **Environment variables**
   - Before: `MONGODB_URI`
   - After: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

3. **package.json**
   - Removed: `mongoose` ^7.7.0
   - Added: `sequelize` ^6.35.2
   - Added: `pg` ^8.11.3
   - Added: `pg-hstore` ^2.3.4

### Docker & Deployment

1. **docker-compose.yml**
   - Removed: MongoDB + mongo-express services
   - Added: PostgreSQL (Alpine image) + pgAdmin
   - Added: Volume for data persistence
   - Simplified configuration

2. **.env** configuration
   ```
   # Before:
   MONGODB_URI=mongodb+srv://...

   # After:
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=inventory_management
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

---

## 🔄 Query Methods Mapping

### Find Operations

```javascript
// Mongoose
Product.find({ userID })
Product.findOne({ email, password })
Product.findById(id)

// Sequelize
Product.findAll({ where: { userID } })
User.findOne({ where: { email, password } })
Product.findByPk(id)
```

### Create Operations

```javascript
// Mongoose
const user = new User({ ... });
await user.save();

// Sequelize
const user = await User.create({ ... });
```

### Update Operations

```javascript
// Mongoose
Model.findByIdAndUpdate(
  { _id: id },
  { field: value },
  { new: true }
)

// Sequelize
await Model.update(
  { field: value },
  { where: { id }, returning: true }
)
```

### Delete Operations

```javascript
// Mongoose
await Model.deleteOne({ _id: id })
await Model.deleteMany({ condition })

// Sequelize
await Model.destroy({ where: { id } })
await Model.destroy({ where: { condition } })
```

### Relationships

```javascript
// Mongoose
Product.find().populate('userID')

// Sequelize
Product.findAll({
  include: [{
    association: 'user',
    model: User
  }]
})
```

### Aggregation

```javascript
// Mongoose
const total = [];
purchases.forEach(p => total += p.amount);

// Sequelize
const [result] = await Purchase.findAll({
  attributes: [
    [sequelize.fn('SUM', sequelize.col('amount')), 'total']
  ]
})
```

---

## 📋 Table Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  phoneNumber VARCHAR(20),
  imageUrl VARCHAR(255),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Product Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  userID INTEGER REFERENCES users(id),
  name VARCHAR(255),
  manufacturer VARCHAR(255),
  stock INTEGER,
  description TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Store Table
```sql
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  userID INTEGER REFERENCES users(id),
  name VARCHAR(255),
  category VARCHAR(255),
  address VARCHAR(255),
  city VARCHAR(255),
  image VARCHAR(255),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Purchase Table
```sql
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  userID INTEGER REFERENCES users(id),
  ProductID INTEGER REFERENCES products(id),
  QuantityPurchased INTEGER,
  PurchaseDate VARCHAR(255),
  TotalPurchaseAmount FLOAT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Sales Table
```sql
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  userID INTEGER REFERENCES users(id),
  ProductID INTEGER REFERENCES products(id),
  StoreID INTEGER REFERENCES stores(id),
  StockSold INTEGER,
  SaleDate VARCHAR(255),
  TotalSaleAmount FLOAT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

---

## ✅ Benefits of PostgreSQL Migration

| Aspect | MongoDB | PostgreSQL |
|--------|---------|------------|
| **Data Integrity** | Limited | Strong ACID transactions |
| **Relationships** | Manual handling | Native foreign keys |
| **Querying** | Document-based | SQL queries |
| **Scaling** | Horizontal | Vertical + Horizontal |
| **Free Tier** | Limited | Excellent |
| **Industry Use** | Growing | Enterprise standard |
| **Local Development** | Large footprint | Lightweight containers |

---

## 🚀 Setup & Installation

### Using Docker (Recommended)
```bash
docker-compose up -d
```

### Manual PostgreSQL Setup
1. Install PostgreSQL 13+
2. Create database: `createdb inventory_management`
3. Run Backend: `npm run dev`

Tables will be automatically created via Sequelize sync().

---

## 🔍 Testing the Migration

### Verify Database Connection
```bash
cd Backend
npm run dev
# Check console for: "✓ Database Connected Successfully"
# Check for: "✓ Database Models Synced"
```

### Test API Endpoints
```bash
# Register a user
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"test@test.com","password":"123"}'

# Login
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123"}'
```

---

## 📚 References

- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Sequelize vs Mongoose](https://www.npmjs.com/package/sequelize)

---

## ✨ Summary

✅ All MongoDB code has been converted to PostgreSQL + Sequelize
✅ All 6 models properly defined with relationships
✅ All controllers updated with Sequelize methods
✅ Server endpoints converted to SQL queries
✅ Docker support with PostgreSQL + pgAdmin
✅ Auto-migration on startup via Sequelize sync()
✅ Ready for production deployment

The application is now using a robust, SQL-based database with strong data integrity and enterprise-level support.
