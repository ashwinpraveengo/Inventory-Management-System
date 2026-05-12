const Product = require("../models/product");

const soldStock = async (productID, stockSoldData) => {
  // Updating sold stock
  try {
    const myProductData = await Product.findByPk(productID);
    let myUpdatedStock = myProductData.stock - stockSoldData;
    console.log("MY SOLD STOCK: ", myUpdatedStock);

    const SoldStock = await Product.update(
      { stock: myUpdatedStock },
      { where: { id: productID }, returning: true }
    );
    console.log(SoldStock);
  } catch (error) {
    console.error("Error updating sold stock ", error);
  }
};

module.exports = soldStock;
