import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']; // ✅ Standard header access

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(400).json({ message: 'Invalid token payload: missing user ID' });
        }

        req.user = { id: decoded.id };
        next();

    } catch (error) {
        console.error('JWT Error:', error.message);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export { authMiddleware };
