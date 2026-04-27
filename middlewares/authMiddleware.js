const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {
    const token =
        req.cookies.customerToken ||
        req.cookies.sellerToken ||
        req.cookies.adminToken;

    console.log(" Token:", token);

    if (!token) {
        return res.status(401).json({ error: 'Please Login First' });
    }

    try {
        const deCodeToken = jwt.verify(token, process.env.SECRET);

        req.role = deCodeToken.role;
        req.id = deCodeToken.id;
        console.log("Type of id in middleware",typeof(req.id))
            console.log("req.id",req.id)
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid or expired token'
        });
    }
};