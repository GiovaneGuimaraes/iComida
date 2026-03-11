const { Product } = require("db");

async function listProducts(req, res) {
  try {
    const where = {};
    if (req.query.store_id) {
      where.store_id = req.query.store_id;
    }
    const products = await Product.findAll({ where });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, image, store_id, active, metadata } = req.body;
    const product = await Product.create({
      name,
      description,
      image,
      store_id,
      active: active !== undefined ? active : true,
      metadata: metadata || {},
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const { name, description, image, store_id, active, metadata } = req.body;
    await product.update({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(store_id !== undefined && { store_id }),
      ...(active !== undefined && { active }),
      ...(metadata !== undefined && { metadata }),
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
