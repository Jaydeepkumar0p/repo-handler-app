function makeToken(password) {
  return Buffer.from(`folio-admin:${password}`).toString('base64');
}

export const requireAdmin = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD not configured' });
  }

  const expected = makeToken(adminPassword.trim());

  // Accept token from multiple sources (in priority order):
  // 1. httpOnly cookie (normal browser requests)
  // 2. X-Admin-Token header (multipart/form-data uploads — can't set Authorization easily)
  // 3. Authorization: Bearer <token> header (API clients)
  const token =
    req.cookies?.admin_token ||
    req.headers?.['x-admin-token'] ||
    req.headers?.authorization?.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated — please log in' });
  }

  if (token !== expected) {
    return res.status(401).json({ error: 'Invalid or expired session — please log in again' });
  }

  next();
};
