const Location = require('../models/location.model');

const addLocation = async (req, res) => {
    try {
        const { name } = req.body;
        const location = new Location({ name});
        await location.save();
        res.json('saved location');
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}


const allLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

module.exports = {
    allLocations,
    addLocation
}