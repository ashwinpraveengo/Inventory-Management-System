const Store = require("../models/store");

// Add Store
const addStore = async (req, res) => {
  try {
    console.log(req.body);
    const newStore = await Store.create({
      userID: req.user.id,
      name: req.body.name,
      category: req.body.category,
      address: req.body.address,
      city: req.body.city,
      image: req.body.image
    });
    res.status(200).send(newStore);
  } catch (err) {
    res.status(402).send(err);
  }
};

// Get All Stores
const getAllStores = async (req, res) => {
  try {
    const findAllStores = await Store.findAll({
      where: { userID: req.user.id },
      order: [['id', 'DESC']],
    });
    res.json(findAllStores);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { addStore, getAllStores };
