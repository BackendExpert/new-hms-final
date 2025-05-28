import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

        // Ensure 'id' exists in token payload
        if (!decoded.id) {
            return res.status(400).json({ message: 'Invalid token payload: missing user ID' });
        }

        req.user = { id: decoded.id };
        next();

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export { authMiddleware };
