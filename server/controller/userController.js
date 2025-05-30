const User = require("../model/User");

const UserController = {
    getallusers: async (req, res) => {
        try {
            const getalluserdata = await User.find()

            return res.json({ Result: getalluserdata })
        }
        catch (err) {
            console.log(err)
        }
    },

    getoneuser: async (req, res) => {
        try {
            const { id } = req.parms

            const getoneuserdata = await User.findById(id)

            return res.json({ Result: getoneuserdata })
        }
        catch (err) {
            console.log(err)
        }
    },

    avtiveAnddactiveUser: async (req, res) => {
        try {
            const { id } = req.params

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const updatedUser = await User.findByIdAndUpdate(
                id,
                { $set: { active : !user.active } },
                { new: true }
            );

            if(updatedUser){
                return res.json({ Status: "Success", Message: "User Updated Success"})
            }
            else{
                return res.json({ Error: "Internal Server Error while Updating User"})
            }
        }
        catch (err) {
            console.log(err)
        }
    }

};

module.exports = UserController;