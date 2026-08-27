// This function runs BEFORE any route it's attached to.
// It checks for a secret key in the request headers and blocks
// the request entirely if it's missing or wrong.
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'];

  if (!key || key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized: admin access required' });
  }

  next(); // key is correct — let the request continue to the actual route
}

module.exports = requireAdmin;