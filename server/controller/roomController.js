const Room = require("../model/Room");

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
    }
};

module.exports = RoomController;