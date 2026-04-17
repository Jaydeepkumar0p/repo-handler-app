import cloudinary from '../config/cloudinary.js';
import { asyncHandler } from '../middleware/error.middleware.js';

const MAX_SIZE = 4 * 1024 * 1024; // 4 MB
const ALLOWED  = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const { mimetype, size, buffer } = req.file;

  if (!ALLOWED.includes(mimetype)) {
    return res.status(400).json({ error: 'Only JPEG, PNG, WEBP, GIF allowed' });
  }

  if (size > MAX_SIZE) {
    return res.status(400).json({ error: 'File too large. Max 4 MB.' });
  }

  // Validate Cloudinary env vars are actually set
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: 'Cloudinary credentials not configured in .env' });
  }

  const base64   = buffer.toString('base64');
  const dataUri  = `data:${mimetype};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'folio-showcase',
      transformation: [
        { width: 1200, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
      ],
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    const msg = err?.message || '';
    const http = err?.http_code || err?.error?.http_code;

    // Provide clear, actionable error messages for common Cloudinary problems
    if (msg.includes('allowlist') || msg.includes('allowList') || http === 403) {
      return res.status(500).json({
        error: 'Cloudinary blocked this request (Host not in allowlist). '
             + 'Go to Cloudinary Dashboard → Settings → Security → '
             + 'Allowed fetch domains — and either clear all restrictions, '
             + 'or add your server hostname to the allowlist.',
      });
    }
    if (http === 401 || msg.toLowerCase().includes('invalid')) {
      return res.status(500).json({
        error: 'Cloudinary authentication failed — check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env',
      });
    }

    // Re-throw for generic error handler
    throw err;
  }
});
