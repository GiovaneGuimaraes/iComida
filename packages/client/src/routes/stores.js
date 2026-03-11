const { Router } = require("express");
const {
  listStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
} = require("../controllers/storeController");

const router = Router();

router.get("/", listStores);
router.get("/:id", getStore);
router.post("/", createStore);
router.put("/:id", updateStore);
router.delete("/:id", deleteStore);

module.exports = router;
