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
    }
};

module.exports = WardenController;  