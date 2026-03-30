import { Request, Response } from "express";
import db from "@i-comida/db";

const { Product } = db;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Internal server error";
}

async function listProducts(req: Request, res: Response) {
  try {
    const where: { store_id?: number } = {};
    if (typeof req.query.store_id === "string") {
      const storeId = Number(req.query.store_id);

      if (!Number.isNaN(storeId)) {
        where.store_id = storeId;
      }
    }
    const products = await Product.findAll({ where });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

async function getProduct(req: Request<{ id: string }>, res: Response) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

async function createProduct(req: Request, res: Response) {
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
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

async function updateProduct(req: Request<{ id: string }>, res: Response) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { name, description, image, store_id, active, metadata } = req.body;
    await product.update({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(store_id !== undefined && { store_id }),
      ...(active !== undefined && { active }),
      ...(metadata !== undefined && { metadata }),
    });

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

async function deleteProduct(req: Request<{ id: string }>, res: Response) {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

export {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
