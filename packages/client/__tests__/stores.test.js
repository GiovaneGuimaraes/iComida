const request = require("supertest");

// Mock the db module before requiring the app
jest.mock("db", () => {
  const stores = [];
  let storeIdCounter = 1;

  const Store = {
    findAll: jest.fn(async () => stores),
    findByPk: jest.fn(async (id) => {
      const store = stores.find((s) => String(s.id) === String(id));
      if (!store) return null;
      return {
        ...store,
        update: jest.fn(async (data) => {
          Object.assign(store, data);
          return store;
        }),
        destroy: jest.fn(async () => {
          const idx = stores.findIndex((s) => String(s.id) === String(id));
          if (idx !== -1) stores.splice(idx, 1);
        }),
        toJSON: () => ({ ...store }),
      };
    }),
    create: jest.fn(async (data) => {
      const store = { id: storeIdCounter++, ...data };
      stores.push(store);
      return { ...store, toJSON: () => ({ ...store }) };
    }),
  };

  const Product = {
    destroy: jest.fn(async () => {}),
  };

  return {
    Store,
    Product,
    sequelize: { sync: jest.fn(async () => {}) },
    _stores: stores,
    _resetStores: () => {
      stores.length = 0;
      storeIdCounter = 1;
    },
  };
});

const app = require("../src/index");
const db = require("db");

beforeEach(() => {
  db._resetStores();
  jest.clearAllMocks();
});

describe("GET /api/stores", () => {
  it("should return an empty list when no stores exist", async () => {
    const res = await request(app).get("/api/stores");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return stores after creation", async () => {
    await request(app).post("/api/stores").send({
      name: "Pizza Place",
      category: "PIZZA",
      user_id: "user-1",
    });

    const res = await request(app).get("/api/stores");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });
});

describe("POST /api/stores", () => {
  it("should create a new store", async () => {
    const res = await request(app).post("/api/stores").send({
      name: "Burger Joint",
      category: "BURGER",
      user_id: "user-1",
      image_path: "burger.jpg",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Burger Joint");
  });
});

describe("GET /api/stores/:id", () => {
  it("should return 404 for non-existent store", async () => {
    const res = await request(app).get("/api/stores/999");
    expect(res.status).toBe(404);
  });

  it("should return a store by id", async () => {
    await request(app).post("/api/stores").send({
      name: "Sushi Bar",
      category: "JAPANESE",
      user_id: "user-1",
    });

    const res = await request(app).get("/api/stores/1");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Sushi Bar");
  });
});

describe("PUT /api/stores/:id", () => {
  it("should update a store", async () => {
    await request(app).post("/api/stores").send({
      name: "Old Name",
      category: "PIZZA",
      user_id: "user-1",
    });

    const res = await request(app).put("/api/stores/1").send({
      name: "New Name",
    });
    expect(res.status).toBe(200);
  });

  it("should return 404 for non-existent store", async () => {
    const res = await request(app).put("/api/stores/999").send({
      name: "New Name",
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/stores/:id", () => {
  it("should delete a store with correct user_id", async () => {
    await request(app).post("/api/stores").send({
      name: "To Delete",
      category: "PIZZA",
      user_id: "user-1",
    });

    const res = await request(app)
      .delete("/api/stores/1")
      .set("x-user-id", "user-1");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 403 when user_id does not match", async () => {
    await request(app).post("/api/stores").send({
      name: "To Delete",
      category: "PIZZA",
      user_id: "user-1",
    });

    const res = await request(app)
      .delete("/api/stores/1")
      .set("x-user-id", "user-2");
    expect(res.status).toBe(403);
  });

  it("should return 404 for non-existent store", async () => {
    const res = await request(app)
      .delete("/api/stores/999")
      .set("x-user-id", "user-1");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/health", () => {
  it("should return ok status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
