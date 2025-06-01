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
    },

    getAllhostel: async (req, res) => {
        try {
            const getallhostel = await Hostel.find().populate('warden')

            return res.json({ Result: getallhostel })

        }
        catch (err) {
            console.log(err)
        }
    },

    getoneHostel: async (req, res) => {
        try {
            const { id } = req.params

            const gethostel = await Hostel.findById(id).populate('warden')

            return res.json({ Result: gethostel })
        }
        catch (err) {
            console.log(err)
        }
    },

    updateRoomCount: async (req, res) => {
        try {
            const { id } = req.params;
            const { newRoomCount } = req.body;

            const hostel = await Hostel.findById(id);
            if (!hostel) {
                return res.json({ error: 'Hostel not found' });
            }

            const currentCount = hostel.roomCount;

            if (newRoomCount === currentCount) {
                return res.json({ message: 'Room count is already up to date.' });
            }

            if (newRoomCount > currentCount) {
                const roomsToAdd = [];
                for (let i = currentCount + 1; i <= newRoomCount; i++) {
                    roomsToAdd.push({
                        roomID: `${hostel.hostelID}/${i}`,
                        gender: hostel.gender,
                        hostelID: hostel._id
                    });
                }

                await Room.insertMany(roomsToAdd);
            }

            if (newRoomCount < currentCount) {
                const roomsToRemove = await Room.find({
                    hostelID: hostel._id
                }).sort({ roomID: -1 }).limit(currentCount - newRoomCount);

                const roomIDsToDelete = roomsToRemove.map(room => room._id);

                await Room.deleteMany({ _id: { $in: roomIDsToDelete } });
            }

            hostel.roomCount = newRoomCount;
            await hostel.save();

            return res.json({
                Status: "Success",
                Message: `Room count updated from ${currentCount} to ${newRoomCount}`
            });

        } catch (err) {
            console.error("Error updating room count:", err);
            return res.json({ error: "Server error while updating room count" });
        }
    },

    assignNewWarden: async (req, res) => {
        try {
            const { hostelId, newWardenId } = req.body;

            // Remove existing active wardens for this hostel
            await Warden.deleteMany({ hostelId, active: true });

            // Create new active warden
            const newWarden = new Warden({
                userId: newWardenId,
                hostelId: hostelId,
                startDate: new Date(),
                note: "Reassigned as new warden",
                active: true,
            });

            const savedWarden = await newWarden.save();

            // Update Hostel document with new warden reference
            await Hostel.findByIdAndUpdate(hostelId, { warden: newWardenId });

            return res.json({
                Status: "Success",
                Message: "New warden assigned successfully",
                newWarden: savedWarden,
            });
        } catch (err) {
            console.error("Error assigning new warden:", err);
            res.json({ error: "Internal server error while assigning new warden" });
        }
    }

};

module.exports = HostelController;