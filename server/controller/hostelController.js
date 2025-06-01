const Hostel = require("../model/Hostel");
const Role = require("../model/Role");
const Room = require("../model/Room");
const User = require("../model/User");

const HostelController = {
    GetallWarden: async(req, res) => {
        try{
            const getwardenrole = await Role.findOne({ name: 'warden' })

            const wardenUsers = await User.find({ roles: getwardenrole._id })
                .select("-password") 
                .populate("roles", "name"); 

            return res.json({ Result: wardenUsers })
        }
        catch(err){
            console.log(err)
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
            } = req.body

            const checkhostel = await Hostel.findOne({
                $or: [
                    { hostelID: hostelID },
                    { name: name },
                ]
            })

            if (checkhostel) {
                res.json({ Error: "The Hostel is Already Exists" })
            }

            const newHostel = new Hostel({
                hostelID,
                name,
                location,
                gender,
                roomCount,
                warden
            });

            const savedHostel = await newHostel.save();

            if (savedHostel) {
                const roomDocs = [];
                for (let i = 1; i <= roomCount; i++) {
                    const room = new Room({
                        roomID: `${hostelID}/${i}`,
                        gender: gender,
                        hostelID: savedHostel._id
                    });
                    roomDocs.push(room);
                }

                await Room.insertMany(roomDocs);

                res.json({
                    Status: "Success",
                    Message: "Hostel and rooms created successfully",
                    hostel: savedHostel,
                    rooms: roomDocs
                });
            }
            else {
                return res.json({ Error: "Internal Server Error While Creating Hostel" })
            }

        }
        catch (err) {
            console.log(err)
        }
    }
};

module.exports = HostelController;