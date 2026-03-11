const { Router } = require("express");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
