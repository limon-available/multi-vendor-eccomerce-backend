const jwt = require('jsonwebtoken');

const COOKIE_NAMES = ['customerToken', 'sellerToken', 'adminToken'];

// Decode every token present in the request, keyed by its role. This lets
// authorizeRoles select the token that matches the route's required role,
// instead of blindly using whichever cookie happens to come first. All three
// role tokens share the backend's cookie jar, so "first available" could
// authenticate a customer route with a leftover admin/seller token.
const authMiddleware = async (req, res, next) => {
    req.authByRole = {};
    for (const name of COOKIE_NAMES) {
        const token = req.cookies[name];
        if (!token) continue;
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            req.authByRole[decoded.role] = decoded;
        } catch (error) {
            // ignore invalid/expired token; other cookies may still be valid
        }
    }

    const roles = Object.keys(req.authByRole);
    if (roles.length === 0) {
        return res.status(401).json({ error: 'Please Login First' });
    }

    // Default identity for routes that use authMiddleware without authorizeRoles
    // (e.g. /get_user_info, /logout). authorizeRoles refines this below.
    const first = req.authByRole[roles[0]];
    req.role = first.role;
    req.id = first.id;
    next();
};

const authorizeRoles = (...roles) => (req, res, next) => {
    const match = roles.find((role) => req.authByRole && req.authByRole[role]);
    if (!match) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    req.role = match;
    req.id = req.authByRole[match].id;
    return next();
};

module.exports = {
    authMiddleware,
    authorizeRoles,
};
