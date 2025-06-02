const Room = require("../model/Room");

const RoomController = {
    getallrooms: async(req, res) => {
        try{
            const getallrooms = await Room.find().populate('student', 'hostelID')

            return res.json({ Result: getallrooms })

        }
        catch(err){
            console.log(err)
        }
    }
};

module.exports = RoomController;