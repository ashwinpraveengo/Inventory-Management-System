const Product = require("../models/product");

const purchaseStock = async (productID, purchaseStockData) => {
  // Updating Purchase stock
  try {
    const myProductData = await Product.findByPk(productID);
    let myUpdatedStock = parseInt(myProductData.stock) + parseInt(purchaseStockData);

    const PurchaseStock = await Product.update(
      { stock: myUpdatedStock },
      { where: { id: productID }, returning: true }
    );
    console.log(PurchaseStock);
  } catch (error) {
    console.error("Error updating Purchase stock ", error);
  }
};

module.exports = purchaseStock;
