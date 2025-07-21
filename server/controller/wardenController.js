const Allocation = require("../model/Allocation");
const SpecialNeeds = require("../model/SpecialNeeds");
const Student = require("../model/Student");
const User = require("../model/User");
const Warden = require("../model/Warden");
const { jwtDecode } = require('jwt-decode');
const { getoneHostel } = require("./hostelController");
const Hostel = require("../model/Hostel");
const Room = require("../model/Room");

const WardenController = {
    getstdextraneeds: async (req, res) => {
        try {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.replace('Bearer ', '');
            if (!token) return res.json({ message: 'Unauthorized: No token provided' });

            const decoded = jwtDecode(token);
            const email = decoded.email || decoded.user?.email;

            // Find logged in user
            const userid = await User.findOne({ email: email });
            if (!userid) return res.json({ message: 'User not found' });

            // Find warden record
            const getwarden = await Warden.findOne({ userId: userid._id }).populate('hostelId');
            if (!getwarden) return res.json({ message: 'Warden record not found' });

            // Find students allocated to warden's hostel
            const getstudents = await Allocation.find({ hostelID: getwarden.hostelId._id });
            if (!getstudents.length) return res.json({ message: 'No students allocated' });

            // Extract regNos
            const regNos = getstudents.map(s => s.regNo);

            // Find special needs of these students
            const getstduntneeds = await SpecialNeeds.find({ regNo: { $in: regNos } }).populate('regNo');

            // ✅ Only log special needs data
            // console.log("Special needs records:", JSON.stringify(getstduntneeds, null, 2));

            return res.json({ Result: getstduntneeds });
        }
        catch (err) {
            console.error("Error occurred:", err);
            return res.json({ message: 'Server error', error: err.message });
        }
    },


    approveneeds: async (req, res) => {
        try {
            const id = req.params.id;

            const udpdateneed = await SpecialNeeds.findByIdAndUpdate(
                id,
                { $set: { isAccpeted: true } },
                { new: true }
            );

            if (udpdateneed) {
                return res.json({ Status: "Success", data: udpdateneed });
            } else {
                return res.json({ Error: "SpecialNeed not found" });
            }

        }
        catch (err) {
            console.log(err)
        }
    },

    getallwardenrooms: async (req, res) => {
        try {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.replace('Bearer ', '');
            if (!token) return res.json({ message: 'Unauthorized: No token provided' });

            const decoded = jwtDecode(token);
            const email = decoded.email || decoded.user?.email;

            const getwardendata = await User.findOne({ email });
            if (!getwardendata) return res.json({ message: 'Warden not found' });

            const gethostel = await Hostel.findOne({ warden: getwardendata._id });
            if (!gethostel) return res.json({ message: 'Hostel not assigned to this warden' });

            const rooms = await Room.find({ hostelID: gethostel._id });

            console.log(rooms)

            return res.json({ message: 'Rooms fetched successfully', rooms });
        }
        catch (err) {
            console.log(err)
        }
    },

    assignstdtorooms_via_sp: async (req, res) => {
        try {
            const stdid = req.params.id
        }
        catch (err) {
            console.log(err)
        }
    }
};

module.exports = WardenController;  