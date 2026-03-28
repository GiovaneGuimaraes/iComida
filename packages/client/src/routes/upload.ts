import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configuração do multer para salvar arquivos em packages/app-nextjs/public/uploads
const uploadDir = path.join(__dirname, "../../../app-nextjs/public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Rota para upload de imagem
import { Request } from "express";
import { File as MulterFile } from "multer";

interface MulterRequest extends Request {
  file?: MulterFile;
}

router.post("/upload", upload.single("image"), (req: MulterRequest, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // URL pública do arquivo
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;
