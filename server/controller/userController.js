const Role = require("../model/Role");
const User = require("../model/User");


const UserController = {
    getallusers: async (req, res) => {
        try {
            const getalluserdata = await User.find().populate('roles');

            return res.json({ Result: getalluserdata })
        }
        catch (err) {
            console.log(err)
        }
    },

    getoneuser: async (req, res) => {
        try {
            const { id } = req.params

            const getoneuserdata = await User.findById(id).populate('roles');

            return res.json({ Result: getoneuserdata })
        }
        catch (err) {
            console.log(err)
        }
    },

    verifyEmailBydir: async (req, res) => {
        try {
            const { id } = req.params

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                id,
                { $set: { emailVerified: !user.emailVerified } },
                { new: true }
            );

            if (updatedUser) {
                return res.json({ Status: "Success", Message: "User Updated Success" })
            }
            else {
                return res.json({ Error: "Internal Server Error while Updating User" })
            }


        }
        catch (err) {
            console.log(err)
        }
    },

    avtiveAnddactiveUser: async (req, res) => {
        try {
            const { id } = req.params

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                id,
                { $set: { active: !user.active } },
                { new: true }
            );

            if (updatedUser) {
                return res.json({ Status: "Success", Message: "User Updated Success" })
            }
            else {
                return res.json({ Error: "Internal Server Error while Updating User" })
            }
        }
        catch (err) {
            console.log(err)
        }
    },

    updateUserRole: async (req, res) => {
        try {
            const { userID, roleID } = req.body;

            const user = await User.findById(userID);
            if (!user) {
                return res.json({ error: "User not found" });
            }

            const roleExists = await Role.findById(roleID);
            if (!roleExists) {
                return res.json({ error: "Role not found" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userID,
                { $set: { roles: [roleID] } }, 
                { new: true }
            );

            return res.json({ message: "User role updated successfully", user: updatedUser });
        } catch (err) {
            console.error(err);
            return res.json({ error: "Server error" });
        }
    }

};

module.exports = UserController;