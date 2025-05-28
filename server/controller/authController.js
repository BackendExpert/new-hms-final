const bcrypt = require('bcrypt');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const Role = require('../model/Role');
const User = require('../model/User');
const transporter = require('../utils/emailTransporter');
const UserOTP = require('../model/UserOTP');

const authController = {
    // signup
    signup: async (req, res) => {
        try {
            const {
                username,
                email,
                password,
            } = req.body

            if (!password || password.length < 6) {
                return res.json({ Error: "Password must be at least 6 characters long" });
            }

            // const emailRegex = /^[a-zA-Z0-9._%+-]+@pdn\.ac\.lk$/;
            // if (!emailRegex.test(email)) {
            //     return res.json({ Error: "Email must end with '@pdn.ac.lk'" });
            // }

            const checkUser = await User.findOne({
                $or: [
                    { username: username },
                    { email: email }
                ]
            });

            if (checkUser) {
                return res.json({ Error: "User already exists in the system" })
            }

            const getroleforsignup = await Role.findOne({ name: 'warden' })

            if (!getroleforsignup) {
                return res.json({ Error: "Default role 'warden' not found in system" });
            }

            const hashpass = await bcrypt.hash(password, 10)

            const newUser = new User({
                username: username,
                email: email,
                password: hashpass,
                roles: [getroleforsignup._id],
            })

            const resultNewUser = await newUser.save()

            if (resultNewUser) {
                const generateRandomCode = (length = 10) => {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}';
                    let code = '';
                    for (let i = 0; i < length; i++) {
                        code += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    return code;
                };

                const verificationCode = generateRandomCode();

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Pdn Account Verification Code',
                    html: `
                            <p>Dear ${username},</p>
                            <p>Thank you for registering at the University of Peradeniya Hostel Management System.</p>
                            <p>Your Email verification code is:</p>
                            <h2 style="color:#7c340c;">${verificationCode}</h2>
                            <p>Please wait until your account is activated by an administrator.</p>
                            <br>
                            <p style="color:gray;">Do not share this code with anyone.</p>
                        `,
                };


                const hashotp = await bcrypt.hash(verificationCode, 10)

                const storeOTP = new UserOTP({
                    email: email,
                    otp: hashotp
                })

                const resultStoreOTP = await storeOTP.save()

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        return res.json({ Error: "Registration succeeded, but failed to send verification email." });
                    } else {
                        const tokenemailVerify = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5min' });

                        return res.json({
                            Status: "Success",
                            verifyToken: tokenemailVerify,
                            Message: "Registration successful. Verification code sent to your email. Verify Email Please wait and wait for activation."
                        });
                    }
                });
            }

            else {
                return res.json({ Error: "Internal Server Error while Creating User" })
            }
        }
        catch (err) {
            console.log(err)
        }
    },


    // verify otp for email verify
    otpverifyforemail: async (req, res) => {
        try {
            const { otp } = req.body;

            // 1. Get token from Authorization header
            const token = req.header('Authorization');
            if (!token || !token.startsWith('Bearer ')) {
                return res.json({ Error: "Missing or invalid token" });
            }

            // 2. Verify token and extract email
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            const email = decoded.email;

            // 3. Check for OTP record in DB
            const userOtpRecord = await UserOTP.findOne({ email });
            if (!userOtpRecord) {
                return res.json({ Error: "No OTP found for this email" });
            }

            // 4. Compare provided OTP with hashed OTP in DB
            const isMatch = await bcrypt.compare(otp, userOtpRecord.otp);
            if (!isMatch) {
                return res.json({ Error: "Invalid OTP" });
            }

            // 5. Mark email as verified & remove OTP from DB
            await User.updateOne({ email }, { emailVerified: true });
            await UserOTP.deleteOne({ email });

            res.json({ Status: "Success", Message: "Email verified successfully" });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.json({ Error: "Verification token expired" });
            }
            console.error(err);
            res.status(500).json({ Error: "Server error during email verification" });
        }
    },

    signin: async(req, res) => {
        try{
            const {
                email,
                password
            } = req.body


            const checkuser = await User.findOne({ email: email })

            if(!checkuser){
                return res.json({ Error: "The User not Found by Given Email Address"})
            }

            if(checkuser.emailVerified === false){
                return res.json({ Error: "The Email Not Verified"})
            }

            if(checkuser.active === false){
                return res.json({ Error: "The Account is not Active, wait for admin to active the account"})
            }

            const checkpass = await bcrypt.compare(password, checkuser.password)

            if(!checkpass){
                return res.json({ Error: "The Password is Not Match"})
            }

            const token = jwt.sign({ id: checkuser._id, role: checkuser.roles, user: checkuser }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            if(token){
                return res.json({ Status: "Success", Message: "Login Success", Token: token })
            }
            else{
                return res.json({ Error: "Internal Server Error while signin"})
            }            
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