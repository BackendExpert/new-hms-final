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

            // console.log(rooms)

            return res.json({ Result: rooms });
        }
        catch (err) {
            console.log(err)
        }
    },

    assignstdtorooms_via_sp: async (req, res) => {
        try {
            const { studentId, roomId } = req.body;

            const gethostel = await Room.findById(roomId);
            const getstudent = await Student.findById(studentId);

            if (!getstudent || !gethostel) {
                return res.json({ error: "Invalid student or room ID" });
            }

            const getid = getstudent.enrolmentNo;
            const parts = getid.split('/');
            const yearofenroll = parseInt(parts[1], 10);

            if (yearofenroll >= 22 && yearofenroll <= 40) {
                const fullyear = 2000 + yearofenroll;

                const checkallocation = await Allocation.findOne({ regNo: studentId })

                if(checkallocation){
                    return res.json({ Error: "Already Assign" })
                }

                const createroomAllocation = new Allocation({
                    regNo: studentId,
                    roomId: roomId,
                    hostelID: gethostel.hostelID,
                    academicYear: fullyear,
                    inDate: new Date(),
                    active: true
                });

                const resultcreateroomAllocation = await createroomAllocation.save();

                if (resultcreateroomAllocation) {
                    await Room.findByIdAndUpdate(
                        roomId,
                        { $inc: { currentOccupants: 1 } }, // Use atomic increment
                        { new: true }
                    );

                    return res.json({ Status: "Success", Message: "Allocation successful" });
                } else {
                    return res.json({ Error: "Failed to save allocation" });
                }
            } else {
                return res.json({ Error: "Invalid enrolment year in student ID" });
            }
        } catch (err) {
            console.log(err);
            return res.json({ Error: "Something went wrong" });
        }
    },

    assigned_students: async(req, res) =>{
        try{
            const getallstds = await Allocation.find()
                .populate('regNo')
                .populate('roomId')
            
            console.log(getallstds)

        }
        catch(err){
            console.log(err)
        }
    }

};

module.exports = WardenController;  