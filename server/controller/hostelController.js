const Hostel = require("../model/Hostel");

const HostelController = {
    CreateHostel: async (req, res) => {
        try {
            const {
                hostelID,
                name,
                location,
                gender,
                roomCount,
                warden
            } = req.body

            const checkhostel = await Hostel.findOne({
                $or: [
                    { hostelID: hostelID },
                    { name: name },
                ]
            })

            if(checkhostel){
                res.json({ Error: "The Hostel is Already Exists"})
            }

        

        }
        catch (err) {
            console.log(err)
        }
    }
};

module.exports = HostelController;