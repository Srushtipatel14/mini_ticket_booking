const Event = require("../models/eventModel");

const getAvailability = async (req, res) => {
  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const availability = event.sections.map(section => ({
      name: section.name,
      rows: section.rows.map(row => {

        const bookedSeats = row.seats.filter(seat => seat.status === "booked").length;

        const availableSeats = row.seats.length - bookedSeats;

        return {
          name: row.name,
          totalSeats: row.seats.length,
          seats:row.seats,
          bookedSeats,
          availableSeats
        };

      })
    }));

    res.json(availability);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = getAvailability;