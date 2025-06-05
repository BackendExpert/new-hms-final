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

    signin: async (req, res) => {
        try {
            const {
                email,
                password
            } = req.body


            const checkuser = await User.findOne({ email }).populate('roles');


            if (!checkuser) {
                return res.json({ Error: "The User not Found by Given Email Address" })
            }

            if (checkuser.emailVerified === false) {
                return res.json({ Error: "The Email Not Verified" })
            }

            if (checkuser.active === false) {
                return res.json({ Error: "The Account is not Active, wait for admin to active the account" })
            }

            const checkpass = await bcrypt.compare(password, checkuser.password)

            if (!checkpass) {
                return res.json({ Error: "The Password is Not Match" })
            }

            const token = jwt.sign({ id: checkuser._id, role: checkuser.roles, user: checkuser }, process.env.JWT_SECRET, { expiresIn: '1h' });

            if (token) {
                return res.json({ Status: "Success", Message: "Login Success", Token: token })
            }
            else {
                return res.json({ Error: "Internal Server Error while signin" })
            }
        }
        catch (err) {
            console.log(err)
        }
    },


    // forgetpass and send opt

    forgetpass: async (req, res) => {
        try {
            const { email } = req.body

            const checkuser = await User.findOne({ email: email })

            if (!checkuser) {
                return res.json({ Error: "User Cannot Find In System" })
            }

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
                            <p>Dear ${checkuser.username},</p>
                            <p>The OTP for Password Reset</p>
                            <p>Your Password Resest verification code is:</p>
                            <h2 style="color:#7c340c;">${verificationCode}</h2>
                            <br>
                            <p style="color:gray;">Do not share this code with anyone.</p>
                        `,
            };


            const hashotp = await bcrypt.hash(verificationCode, 10)

            const storeOTP = new UserOTP({
                email: email,
                otp: hashotp
            })

            const deleteallotpsforemail = await UserOTP.findOneAndDelete({ email: email })

            const resultStoreOTP = await storeOTP.save()

            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return res.json({ Error: "Registration succeeded, but failed to send verification email." });
                } else {
                    return res.json({
                        Status: "Success",
                        Message: "Password Reset OTP has been send to your email Address, check emails"
                    });
                }
            });

        }
        catch (err) {
            console.log(err)
        }
    },

    // check and verify otp

    checkotpforforgetpass: async (req, res) => {
        try {
            const { email, otp } = req.body;

            const checkotp = await UserOTP.findOne({ email: email });

            // If OTP record not found
            if (!checkotp) {
                return res.json({ Error: 'OTP Not Found for this Email' });
            }

            // Compare OTP
            const isMatch = await bcrypt.compare(otp, checkotp.otp);
            if (!isMatch) {
                return res.json({ Error: 'OTP does not match' });
            }

            // Delete OTP record after successful verification
            const deleterecode = await UserOTP.findOneAndDelete({ email: email });

            if (deleterecode) {
                const tokenforgetpass = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5min' });

                return res.json({
                    Status: "Success",
                    Token: tokenforgetpass,
                    Message: "OTP Verified. You can now update your password within 5 minutes."
                });
            } else {
                return res.json({ Error: "Failed to delete OTP record" });
            }
        } catch (err) {
            console.error("OTP verification error:", err);
            return res.json({ Error: 'Server Error' });
        }
    },

    updatepasswordviaforgetpass: async (req, res) => {
        try {
            // 1. Get token from Authorization header
            const token = req.header('Authorization');
            if (!token || !token.startsWith('Bearer ')) {
                return res.json({ Error: "Missing or invalid token" });
            }

            // 2. Verify token and extract email
            const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
            const tokenEmail = decoded.email;

            // 3. Extract email and newPassword from body
            const { newPassword, email } = req.body;

            // 4. Check if email from body matches token email
            if (!email || email !== tokenEmail) {
                return res.json({ Error: "Email mismatch" });
            }

            // 5. Find user
            const checkuser = await User.findOne({ email: email });
            if (!checkuser) {
                return res.json({ Error: "User not found" });
            }

            // 6. Validate newPassword presence
            if (!newPassword) {
                return res.json({ Error: "New password is required" });
            }

            // 7. Hash new password and update
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            checkuser.password = hashedPassword;
            await checkuser.save();

            return res.json({ Status: "Success", Message: "Password updated successfully" });
        } catch (err) {
            console.log("Password update error:", err);
            return res.json({ Error: "Something went wrong" });
        }
    },

    getmebyemail: async(req, res) => {
        try{
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.json({ Error: "Unauthorized: Missing or invalid token" });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.user.email;

            const user = await User.findOne({ email }).populate('roles');

            return res.json({ Result: user })

        }
        catch(err){
            console.log(err)
        }
    },

    updatepassviaDash: async (req, res) => {
        try {
            const { currentpass, newpass } = req.body;

            if (!currentpass || !newpass) {
                return res.json({ Error: "Current and new password are required" });
            }

            if (currentpass === newpass) {
                return res.json({ Error: "Current password and new password cannot be the same" });
            }

            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.json({ Error: "Unauthorized: Missing or invalid token" });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const email = decoded.user.email;

            const user = await User.findOne({ email });
            if (!user) {
                return res.json({ Error: "User not found" });
            }

            const isMatch = await bcrypt.compare(currentpass, user.password);
            if (!isMatch) {
                return res.json({ Error: "Current password is incorrect" });
            }

            const hashedPassword = await bcrypt.hash(newpass, 10);

            user.password = hashedPassword;
            await user.save();

            return res.json({ Status: "Success", Message: "Password updated successfully" });
        } catch (err) {
            console.error(err);
            return res.json({ Error: "Internal Server Error" });
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
    },

    getallrolesWithPermissions: async (req, res) => {
        try {
            const getalldata = await Role.find()

            return res.json({ Result: getalldata })
        }
        catch (err) {
            console.log(err)
        }
    },

    viewoneROleWithPermissions: async (req, res) => {
        try {
            const { id } = req.params

            const getdataone = await Role.findById(id)

            return res.json({ Result: getdataone })
        }
        catch (err) {
            console.log(err)
        }
    },

    deleteRolePermission: async (req, res) => {
        try {
            const { roleId, permission } = req.body;

            if (!roleId || !permission) {
                return res.json({ message: 'Role ID and permission are required' });
            }

            const updatedRole = await Role.findByIdAndUpdate(
                roleId,
                { $pull: { permissions: permission } },
                { new: true }
            );

            if (!updatedRole) {
                return res.json({ message: 'Role not found' });
            }

            res.json({
                Status: "Success",
                Message: 'Permission removed successfully',
                role: updatedRole,
            });
        }
        catch (err) {
            console.log(err)
        }
    }
};


module.exports = authController;