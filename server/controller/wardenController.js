const SpecialNeeds = require("../model/SpecialNeeds");
const Student = require("../model/Student");

const WardenController = {
    getstdextraneeds: async (req, res) => {
        try {
            const stdneeds = await SpecialNeeds.find().populate('regNo')

            return res.json({ Result: stdneeds })
        }
        catch (err) {
            console.log(err)
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
    }
};

module.exports = WardenController;  