const { Store, Product } = require("db");

async function listStores(_req, res) {
  try {
    const stores = await Store.findAll({ order: [["created_at", "DESC"]] });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getStore(req, res) {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ error: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createStore(req, res) {
  try {
    const { name, image_path, category, user_id, active } = req.body;
    const store = await Store.create({
      name,
      image_path,
      category,
      user_id,
      active: active !== undefined ? active : true,
    });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateStore(req, res) {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ error: "Store not found" });

    const { name, image_path, category, active } = req.body;
    await store.update({
      ...(name !== undefined && { name }),
      ...(image_path !== undefined && { image_path }),
      ...(category !== undefined && { category }),
      ...(active !== undefined && { active }),
    });

    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteStore(req, res) {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ error: "Store not found" });

    const userId = req.headers["x-user-id"];
    if (!userId || store.user_id !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this store" });
    }

    // Delete associated products first
    await Product.destroy({ where: { store_id: store.id } });
    await store.destroy();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  listStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
};
