import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, WEBP, GIF allowed'), false);
  },
});

// requireAdmin reads from cookies OR x-admin-token header
// multer parses the multipart body AFTER auth check (cookies are in headers, not body — safe)
router.post('/', requireAdmin, upload.single('file'), uploadImage);

export default router;
