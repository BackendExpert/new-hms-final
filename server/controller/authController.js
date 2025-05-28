const bcrypt = require('bcrypt');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const Role = require('../model/Role');

const authController = {
    signup: async(req, res) => {
        try{
            const {
                staffID,
                email,
                password,
            } = req.body

            const checkuser = await 
        }
        catch(err){
            console.log(err)
        }
    },


    // create new permissions
    createPermissions: async (req, res) => {
        try {
            const { role, permission } = req.body;

            if (!role || !permission) {
                return res.status(400).json({ Status: "Error", Message: "Role and Permission are required" });
            }

            let existingRole = await Role.findOne({ name: role.toLowerCase() });

            if (!existingRole) {
                // Create new role
                const newRole = new Role({
                    name: role.toLowerCase(),
                    permissions: [permission] // Wrap in array
                });

                const savedRole = await newRole.save();
                return res.json({
                    Status: "Success",
                    Message: "New Role Created with Permission",
                    data: savedRole
                });
            } else {
                // Update permissions only if not already present
                if (!existingRole.permissions.includes(permission)) {
                    existingRole.permissions.push(permission);
                    await existingRole.save();
                    return res.json({
                        Status: "Success",
                        Message: "Permission added to existing Role",
                        data: existingRole
                    });
                } else {
                    return res.json({
                        Status: "Success",
                        Message: "Permission already exists in Role",
                        data: existingRole
                    });
                }
            }
        }
        catch (err) {
            console.log(err)
        }
    }
};

module.exports = authController;