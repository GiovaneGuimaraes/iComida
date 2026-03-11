const request = require("supertest");

// Mock the db module before requiring the app
jest.mock("db", () => {
  const products = [];
  let idCounter = 1;

  const Product = {
    findAll: jest.fn(async ({ where } = {}) => {
      if (where && where.store_id) {
        return products.filter(
          (p) => String(p.store_id) === String(where.store_id)
        );
      }
      return products;
    }),
    findByPk: jest.fn(async (id) => {
      const product = products.find((p) => String(p.id) === String(id));
      if (!product) return null;
      return {
        ...product,
        update: jest.fn(async (data) => {
          Object.assign(product, data);
          return product;
        }),
        destroy: jest.fn(async () => {
          const idx = products.findIndex((p) => String(p.id) === String(id));
          if (idx !== -1) products.splice(idx, 1);
        }),
        toJSON: () => ({ ...product }),
      };
    }),
    create: jest.fn(async (data) => {
      const product = { id: String(idCounter++), ...data };
      products.push(product);
      return { ...product, toJSON: () => ({ ...product }) };
    }),
    destroy: jest.fn(async () => {}),
  };

  const Store = {
    findAll: jest.fn(async () => []),
    findByPk: jest.fn(async () => null),
    create: jest.fn(async () => ({})),
  };

  return {
    Store,
    Product,
    sequelize: { sync: jest.fn(async () => {}) },
    _products: products,
    _resetProducts: () => {
      products.length = 0;
      idCounter = 1;
    },
  };
});

const app = require("../src/index");
const db = require("db");

beforeEach(() => {
  db._resetProducts();
  jest.clearAllMocks();
});

describe("GET /api/products", () => {
  it("should return an empty list when no products exist", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should filter products by store_id", async () => {
    await request(app).post("/api/products").send({
      name: "Margherita",
      store_id: 1,
      metadata: { price: 25.0 },
    });
    await request(app).post("/api/products").send({
      name: "Burger",
      store_id: 2,
      metadata: { price: 30.0 },
    });

    const res = await request(app).get("/api/products?store_id=1");
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Margherita");
  });
});

describe("POST /api/products", () => {
  it("should create a new product", async () => {
    const res = await request(app).post("/api/products").send({
      name: "Pepperoni Pizza",
      description: "Classic pepperoni",
      store_id: 1,
      image: "pepperoni.jpg",
      metadata: { price: 35.0 },
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Pepperoni Pizza");
  });
});

describe("GET /api/products/:id", () => {
  it("should return 404 for non-existent product", async () => {
    const res = await request(app).get("/api/products/999");
    expect(res.status).toBe(404);
  });

  it("should return a product by id", async () => {
    await request(app).post("/api/products").send({
      name: "Sushi Roll",
      store_id: 1,
      metadata: { price: 40.0 },
    });

    const res = await request(app).get("/api/products/1");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Sushi Roll");
  });
});

describe("PUT /api/products/:id", () => {
  it("should update a product", async () => {
    await request(app).post("/api/products").send({
      name: "Old Product",
      store_id: 1,
      metadata: { price: 10.0 },
    });

    const res = await request(app).put("/api/products/1").send({
      name: "Updated Product",
      metadata: { price: 15.0 },
    });
    expect(res.status).toBe(200);
  });

  it("should return 404 for non-existent product", async () => {
    const res = await request(app).put("/api/products/999").send({
      name: "Updated",
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/products/:id", () => {
  it("should delete a product", async () => {
    await request(app).post("/api/products").send({
      name: "To Delete",
      store_id: 1,
      metadata: { price: 5.0 },
    });

    const res = await request(app).delete("/api/products/1");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 for non-existent product", async () => {
    const res = await request(app).delete("/api/products/999");
    expect(res.status).toBe(404);
  });
});
