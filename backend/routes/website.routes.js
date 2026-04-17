import express from 'express';
import {
  getWebsites, getWebsite, createWebsite,
  reorderWebsites, updateWebsite, deleteWebsite,
} from '../controllers/website.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public
router.get('/',    getWebsites);
router.get('/:id', getWebsite);

// Admin — /reorder MUST be before /:id or Express treats "reorder" as an id param
router.post('/',          requireAdmin, createWebsite);
router.put('/reorder',    requireAdmin, reorderWebsites);
router.put('/:id',        requireAdmin, updateWebsite);
router.delete('/:id',     requireAdmin, deleteWebsite);

export default router;
