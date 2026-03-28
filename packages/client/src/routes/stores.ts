import { Router } from "express";
import {
  createStore,
  deleteStore,
  getStore,
  listStores,
  updateStore,
} from "../controllers/storeController";

const router = Router();

router.get("/", listStores);
router.get("/:id", getStore);
router.post("/", createStore);
router.put("/:id", updateStore);
router.delete("/:id", deleteStore);

export default router;
