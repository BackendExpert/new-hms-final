// checkPermissionMiddleware.js
const User = require('../model/User');
const Role = require('../model/Role');

const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized: No user ID found.' });
            }

            const user = await User.findById(userId).populate('roles');

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const allPermissions = user.roles.flatMap(role => role.permissions);

            if (!allPermissions.includes(requiredPermission)) {
                return res.status(403).json({ message: 'Forbidden: You do not have permission.' });
            }

            next();
        } catch (err) {
            console.error('Permission Check Error:', err);
            res.status(500).json({ message: 'Internal Server Error during permission check.' });
        }
    };
};

module.exports = checkPermission;
