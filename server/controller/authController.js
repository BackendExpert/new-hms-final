const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const Role = require('../model/Role');


const authController = {

    createPermissions: async(req, res) => {
        try{
            const {
                role,
                permission,
            } = req.body

            const checkpermaission = await Role.findOne({ name:  role })

            if(!checkpermaission){
                const newPermission = new Role({
                    name: role,
                    permissions: 'defult_permissions'
                })

                const resultNewPermission = await newPermission.save()

                if(resultNewPermission){
                    return res.json({ Status: "Success", Message: "New Role Created and set as Defult Permissions"})
                }
            }

            


        }
        catch(err){
            console.log(err)
        }
    }
};

module.exports = authController;