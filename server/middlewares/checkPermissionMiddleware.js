const User = require('../model/User');
const Role = require('../model/Role');

const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id; // Assumes req.user is set by auth middleware

            if (!userId) {
                return res.json({ Error: "Unauthorized. No user ID found." });
            }

            // Find user and populate roles
            const user = await User.findById(userId).populate('roles');

            if (!user) {
                return res.json({ Error: "User not found" });
            }

            // Collect all permissions from user's roles
            const allPermissions = user.roles.flatMap(role => role.permissions);

            // Check if required permission exists
            if (!allPermissions.includes(requiredPermission)) {
                return res.json({ Error: "Forbidden: You do not have permission." });
            }

            next(); // ✅ Permission granted

        } catch (err) {
            console.error(err);
            return res.status(500).json({ Error: "Internal Server Error" });
        }
    };
};

module.exports = checkPermission;
