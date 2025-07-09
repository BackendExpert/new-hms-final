const SpecialNeeds = require("../model/SpecialNeeds");

const WardenController = {
    getstdextraneeds: async(req, res) => {
        try{
            const stdextraneeds = await SpecialNeeds.find()

            return res.json({ Result:stdextraneeds })
        }
        catch(err){
            console.log(err)
        }
    }
};

module.exports = WardenController;  