const Hostel = require("../model/Hostel");
const Role = require("../model/Role");
const Room = require("../model/Room");
const User = require("../model/User");
const Warden = require("../model/Warden");


const HostelController = {
    GetallWarden: async (req, res) => {
        try {
            const wardenRole = await Role.findOne({ name: 'warden' });

            if (!wardenRole) {
                return res.json({ error: "Warden role not found" });
            }

            const allWardenUsers = await User.find({ roles: wardenRole._id })
                .select("-password")
                .populate("roles", "name");

            const assignedWardenUserIds = await Warden.find({}).distinct("userId");

            const unassignedWardens = allWardenUsers.filter(user => {
                return !assignedWardenUserIds.some(id => id.equals(user._id));
            });

            return res.json({ result: unassignedWardens });
        } catch (err) {
            console.error("Error fetching unassigned wardens:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },

    CreateHostel: async (req, res) => {
        try {
            const {
                hostelID,
                name,
                location,
                gender,
                roomCount,
                warden
            } = req.body;

            const checkhostel = await Hostel.findOne({
                $or: [
                    { hostelID },
                    { name },
                ]
            });

            if (checkhostel) {
                return res.json({ error: "The hostel already exists" });
            }

            const parsedRoomCount = parseInt(roomCount);
            if (isNaN(parsedRoomCount) || parsedRoomCount <= 0) {
                return res.json({ error: "Invalid room count" });
            }

            // Create and save hostel
            const newHostel = new Hostel({
                hostelID,
                name,
                location,
                gender,
                roomCount: parsedRoomCount,
                warden
            });

            const savedHostel = await newHostel.save();

            // Create and save rooms
            const roomDocs = [];
            for (let i = 1; i <= parsedRoomCount; i++) {
                const room = new Room({
                    roomID: `${hostelID}/${i}`,
                    gender: gender,
                    hostelID: savedHostel._id
                });
                roomDocs.push(room);
            }

            await Room.insertMany(roomDocs);

            let savedWarden = null;
            if (warden) {
                const newWarden = new Warden({
                    userId: warden,
                    hostelId: savedHostel._id,
                    startDate: new Date(),
                    note: "Assigned during hostel creation",
                    active: true
                });
                savedWarden = await newWarden.save();
            }

            return res.json({
                Status: "Success",
                Message: "Hostel, rooms, and warden assigned successfully",
                hostel: savedHostel,
                rooms: roomDocs,
                warden: savedWarden
            });

        } catch (err) {
            console.error("Error creating hostel:", err);
            return res.json({ error: "Server error while creating hostel" });
        }
    }

};

module.exports = HostelController;