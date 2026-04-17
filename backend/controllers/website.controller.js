import Website from '../models/Website.model.js';
import { asyncHandler } from '../middleware/error.middleware.js';

// GET /api/websites
export const getWebsites = asyncHandler(async (_req, res) => {
  const websites = await Website.find({}).sort({ order: 1, createdAt: -1 }).lean();
  res.json(websites);
});

// GET /api/websites/:id  — also increments visitor count
export const getWebsite = asyncHandler(async (req, res) => {
  const website = await Website.findByIdAndUpdate(
    req.params.id,
    { $inc: { visitors: 1 } },
    { new: true }
  ).lean();
  if (!website) return res.status(404).json({ error: 'Project not found' });
  res.json(website);
});

// POST /api/websites
export const createWebsite = asyncHandler(async (req, res) => {
  const { name, description, longDescription, images, techStack,
          liveUrl, githubUrl, status, featured } = req.body;

  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

  const count = await Website.countDocuments();
  const website = await Website.create({
    name: name.trim(), description, longDescription,
    images, techStack, liveUrl, githubUrl, status, featured,
    order: count,
  });

  res.status(201).json(website);
});

// PUT /api/websites/reorder  — MUST be registered before /:id in router
export const reorderWebsites = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds) || !orderedIds.length)
    return res.status(400).json({ error: 'orderedIds must be a non-empty array' });

  await Promise.all(
    orderedIds.map((id, index) => Website.findByIdAndUpdate(id, { order: index }))
  );
  res.json({ success: true });
});

// PUT /api/websites/:id
export const updateWebsite = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  delete body._id;
  delete body.__v;
  delete body.visitors;  // never allow visitor count to be overwritten

  const website = await Website.findByIdAndUpdate(
    req.params.id,
    { $set: body },
    { new: true, runValidators: true }
  ).lean();

  if (!website) return res.status(404).json({ error: 'Project not found' });
  res.json(website);
});

// DELETE /api/websites/:id
export const deleteWebsite = asyncHandler(async (req, res) => {
  const website = await Website.findByIdAndDelete(req.params.id);
  if (!website) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});
