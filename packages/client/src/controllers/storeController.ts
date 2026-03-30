import { Request, Response } from "express";
import db from "@i-comida/db";

const { Store } = db;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Internal server error";
}

function getStoreUserId(store: {
  get?: (key: string) => unknown;
  user_id?: unknown;
}) {
  if (typeof store.get === "function") {
    return store.get("user_id");
  }

  return store.user_id;
}

async function listStores(_req: Request, res: Response) {
  try {
    const stores = await Store.findAll({ order: [["created_at", "DESC"]] });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
}

async function getStore(req: Request<{ id: string }>, res: Response) {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    return res.json(store);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

async function createStore(req: Request, res: Response) {
  try {
    const { name, image_path, category, user_id, active } = req.body;
    const store = await Store.create({
      name,
      image_path,
      category,
      user_id,
      active: active !== undefined ? active : true,
    });
    return res.status(201).json(store);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

async function updateStore(req: Request<{ id: string }>, res: Response) {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const { name, image_path, category, active } = req.body;
    await store.update({
      ...(name !== undefined && { name }),
      ...(image_path !== undefined && { image_path }),
      ...(category !== undefined && { category }),
      ...(active !== undefined && { active }),
    });

    return res.json(store);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

async function deleteStore(req: Request<{ id: string }>, res: Response) {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    const userId =
      typeof req.headers["x-user-id"] === "string"
        ? req.headers["x-user-id"]
        : undefined;
    if (!userId || getStoreUserId(store) !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this store" });
    }

    await store.destroy();
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

export { listStores, getStore, createStore, updateStore, deleteStore };
