
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];

  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized: admin access required' });
  }

  next(); //if key is correct let the request continue to the actual route
}

module.exports = requireAdmin;