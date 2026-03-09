const Event = require("../models/eventModel");

const getEvents = async (req, res) => {
  try {

    const currentDate = new Date();

    const events = await Event.find({
      date: { $gt: currentDate }
    }).select("name date");

    const formattedEvents = events.map(event => ({
      _id: event._id,
      name: event.name,
      date: new Date(event.date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata"
      })
    }));

    res.json(formattedEvents);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = getEvents;