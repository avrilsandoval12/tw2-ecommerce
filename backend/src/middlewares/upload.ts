import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads/products';
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `product-${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
