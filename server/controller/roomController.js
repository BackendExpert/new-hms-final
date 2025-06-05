const Room = require("../model/Room");
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
    }
};

module.exports = RoomController;