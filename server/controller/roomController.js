const Allocation = require("../model/Allocation");
const Room = require("../model/Room");
const SpecialNeeds = require("../model/SpecialNeeds");
const Student = require("../model/Student");
const User = require("../model/User");
const Warden = require("../model/Warden");


const RoomController = {
    getallrooms: async (req, res) => {
        try {
            const getAllRooms = await Room.find()
                .populate('students')
                .populate('hostelID');

            return res.json({ Result: getAllRooms })

        }
        catch (err) {
            console.log(err)
        }
    },

    getoneRoom: async (req, res) => {
        try {
            const { id } = req.params

            const getroomdata = await Room.findById(id)
                .populate('students')
                .populate('hostelID');

            return res.json({ Result: getroomdata })
        }
        catch (err) {
            console.log(err)
        }
    },

    updateRoomCapasity: async (req, res) => {
        try {
            const {
                roomID,
                capasity,
            } = req.body

            if (capasity > 7) {
                return res.json({ Error: "The Max capasity is 6" })
            }

            const checkroom = await Room.findById(roomID)

            const updatedRoom = await Room.findByIdAndUpdate(
                roomID,
                { $set: { capasity } },
                { new: true }
            );

            if (updatedRoom) {
                return res.json({ Status: "Success", Message: "Room Capasity Updated Success" })
            }
            else {
                return res.json({ Error: "Internal Server Error Whilte Updating Room Capasity" })
            }
        }
        catch (err) {
            console.log(err)
        }
    },

    wardenRooms: async (req, res) => {
        try {
            const userId = req.user.id;

            const warden = await Warden.findOne({ userId, active: true });
            if (!warden) {
                return res.json({ rooms: [] });
            }

            const rooms = await Room.find({ hostelID: warden.hostelId }).populate('students');

            return res.json({ rooms });
        } catch (err) {
            console.log(err);
        }
    },

    stundetassigntoroom: async (req, res) => {
        try {
            // 1. Get current warden's email from req.user or token middleware
            const wardenEmail = req.user?.email;
            if (!wardenEmail) {
                return res.status(401).json({ message: 'Unauthorized: Warden email not found' });
            }

            // 2. Find the warden's hostel
            const warden = await Warden.findOne({ email: wardenEmail });
            if (!warden) {
                return res.status(404).json({ message: 'Warden not found' });
            }
            const wardenHostelId = warden.hostelID;

            // 3. Find all rooms in the warden's hostel that are available
            const rooms = await Room.find({
                hostelID: wardenHostelId,
                status: 'Available' // Correct the spelling if needed
            });

            if (rooms.length === 0) {
                return res.json({ message: 'No available rooms in your hostel.' });
            }

            // 4. Get all students who are unassigned (isAssign !== true) and have active allocation in Allocation table (assuming active:true)
            // Also ensure allocation is for current academic year if needed
            const unassignedAllocations = await Allocation.find({
                active: true,
                regNo: { $exists: true }, // just to ensure regNo exists
                roomId: { $exists: false }, // Not assigned a room yet
            }).populate('regNo'); // Populate student info from regNo

            const unassignedStudents = unassignedAllocations
                .map(allocation => allocation.regNo)
                .filter(student => student && student.isAssign !== true);

            if (unassignedStudents.length === 0) {
                return res.json({ message: 'No unassigned students with active allocations found.' });
            }

            // 5. Organize rooms by gender
            const roomsByGender = {
                male: rooms.filter(r => r.gender.toLowerCase() === 'male'),
                female: rooms.filter(r => r.gender.toLowerCase() === 'female')
            };

            // 6. Helper to assign student to a room
            const assignStudentToRoom = async (student, allocation) => {
                const gender = (student.sex || '').toLowerCase();
                const availableRooms = roomsByGender[gender];

                if (!availableRooms || availableRooms.length === 0) {
                    return false;
                }

                for (let room of availableRooms) {
                    if (room.currentOccupants < room.capasity) {
                        room.students.push(student._id);
                        room.currentOccupants += 1;

                        if (room.currentOccupants >= room.capasity) {
                            room.status = 'Full';
                        }

                        await room.save();

                        student.isAssign = true;
                        await student.save();

                        allocation.roomId = room._id;  // Assign room to allocation
                        allocation.hostelID = room.hostelID;
                        allocation.inDate = new Date();
                        allocation.note = 'Auto assigned by system';
                        await allocation.save();

                        return true;
                    }
                }

                return false;
            };

            // 7. Assign each unassigned student
            let assignedCount = 0;
            for (const allocation of unassignedAllocations) {
                const student = allocation.regNo;
                if (!student || student.isAssign === true) continue;

                const assigned = await assignStudentToRoom(student, allocation);
                if (assigned) assignedCount++;
                else console.log(`No available room for student: ${student._id}`);
            }

            res.json({ message: `Assigned ${assignedCount} students to rooms in your hostel.` });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error during student assignment' });
        }
    }


    // studentAssignNeed: async (req, res) => {
    //     try {
    //         // Get email from query params (adjust as per your frontend)
    //         const userEmail = req.query.email || req.params.email;
    //         console.log('Logged in user email:', userEmail);

    //         if (!userEmail) {
    //             return res.json({ message: 'Unauthorized: user email missing', students: [] });
    //         }

    //         // Find user by email
    //         const user = await User.findOne({ email: userEmail });
    //         if (!user) {
    //             console.log('User not found for email:', userEmail);
    //             return res.json({ message: 'User not found', students: [] });
    //         }

    //         // Find active warden linked to user
    //         const warden = await Warden.findOne({ userId: user._id, active: true });
    //         if (!warden) {
    //             console.log('Warden not found or inactive for user:', user._id);
    //             return res.json({ message: 'Warden not found or inactive', students: [] });
    //         }

    //         console.log('Warden found:', warden._id, 'hostelId:', warden.hostelId);

    //         // Get active allocations for the warden's hostel
    //         const allocations = await Allocation.find({ hostelID: warden.hostelId, active: true });
    //         if (!allocations.length) {
    //             console.log('No allocations found for hostel:', warden.hostelId);
    //             return res.json({ students: [] });
    //         }

    //         console.log(`Found ${allocations.length} allocations`);

    //         // Collect regNos from allocations
    //         const regNos = allocations.map(a => a.regNo);
    //         console.log('Registration numbers in allocations:', regNos);

    //         // Get special needs entries for these regNos
    //         const specialNeedsList = await SpecialNeeds.find({ regNo: { $in: regNos } }).sort({ createdAt: -1 });
    //         console.log(`Found ${specialNeedsList.length} special needs records`);

    //         // Map specialNeeds by regNo for quick access
    //         const specialNeedsMap = {};
    //         specialNeedsList.forEach(sn => {
    //             specialNeedsMap[sn.regNo] = sn;
    //         });

    //         // Get student details for those regNos
    //         const students = await Student.find({ regNo: { $in: regNos } });
    //         console.log(`Found ${students.length} students`);

    //         // Prepare the final combined data array
    //         const result = students.map(s => {
    //             const sn = specialNeedsMap[s.regNo];
    //             return {
    //                 regNo: s.regNo,
    //                 needs: sn ? sn.needs : 'None',
    //                 isAccepted: sn ? sn.isAccpeted : false,
    //                 student: {
    //                     name: s.name,
    //                     faculty: s.faculty,
    //                     course: s.course,
    //                 },
    //                 createdAt: sn ? sn.createdAt : null,
    //             };
    //         });

    //         console.log("Results to send:", result);

    //         return res.json({ students: result });
    //     } catch (err) {
    //         console.error('Error in studentAssignNeed:', err);
    //         return res.json({ message: 'Server error', students: [] });
    //     }
    // }
};

module.exports = RoomController;