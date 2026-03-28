import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "db";

const router = Router();
const { User } = db;
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Registro
import { Request, Response, NextFunction } from "express";

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: "Missing fields" });
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ error: "User already exists" });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash, name });
  const userData = user.get();
  res.json({ id: userData.id, email: userData.email, name: userData.name });
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const userData = user.get();
  const valid = await bcrypt.compare(password, userData.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign(
    { id: userData.id, email: userData.email },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
  res.json({
    token,
    user: { id: userData.id, email: userData.email, name: userData.name },
  });
});

// Middleware para autenticação
interface AuthRequest extends Request {
  user?: any;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Obter usuário autenticado
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const userData = user.get();
  res.json({ id: userData.id, email: userData.email, name: userData.name });
});

export default router;
