const HostelController = {
    CreateHostel: async (req, res) => {
        try {
            const {
                name,
                location,
                gender,
                roomCount,
                warden
            } = req.body

            
        }
        catch (err) {
            console.log(err)
        }
    }
};

module.exports = HostelController;