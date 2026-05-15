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

// Delete Store
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { id: req.params.id, userID: req.user.id },
    });
    if (!store) return res.status(404).json({ message: "Store not found" });

    await Store.destroy({ where: { id: req.params.id } });
    res.json({ message: "Store deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Store
const updateStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { id: req.params.id, userID: req.user.id },
    });
    if (!store) return res.status(404).json({ message: "Store not found" });

    await Store.update(
      {
        name: req.body.name,
        category: req.body.category,
        address: req.body.address,
        city: req.body.city,
        image: req.body.image,
      },
      { where: { id: req.params.id } }
    );

    const updatedStore = await Store.findByPk(req.params.id);
    res.json(updatedStore);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addStore, getAllStores, deleteStore, updateStore };
