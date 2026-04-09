 const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
        return res.status(401).json({ error: 'Please Login First' });
    } else {
        try {
            const deCodeToken = jwt.verify(accessToken, process.env.SECRET);
            
            req.role = deCodeToken.role;
            req.id = deCodeToken.id;

            console.log("Decoded Token:", deCodeToken);
            console.log("req.id:", req.id, "req.role:", req.role);

            next();
        } catch (error) {
            console.error("JWT Verify Error:", error.message);
            return res.status(401).json({ error: 'Invalid or expired token, please login again' });
        }
    }
};
