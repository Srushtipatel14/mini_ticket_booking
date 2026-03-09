const Event = require("../models/eventModel");

const createEvent = async (req, res) => {
  try {

    const { date } = req.body;

    const eventDate = new Date(date);  
    const currentDate = new Date(); 

    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    if (eventDate <= currentDate) {
      return res.status(400).json({
        success: false,
        message: "Event date must be in the future"
      });
    }

    const event = await Event.create({
      ...req.body,
      date: eventDate
    });

    res.status(201).json({
      success: true,
      data: event
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = createEvent;