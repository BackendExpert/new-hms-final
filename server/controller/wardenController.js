const SpecialNeeds = require("../model/SpecialNeeds");
const Student = require("../model/Student");

const WardenController = {
    getstdextraneeds: async (req, res) => {
        try {
            const specialNeedsRecords = await SpecialNeeds.find();


            for (let item of specialNeedsRecords) {
                const student = await Student.findOne({ email: item.regNo });


            }

            return res.json({ Result: combinedData });
        }
        catch (err) {
            console.log(err)
        }
    }
};

module.exports = WardenController;  