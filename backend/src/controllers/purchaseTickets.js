const Event = require("../models/eventModel");

const purchaseTickets = async (req, res) => {
  try {

    const { selectSeat } = req.body;

    if (!selectSeat || selectSeat.length === 0) {
      return res.status(400).json({ message: "No seats selected" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    let totalSeats = 0;

    for (const seatGroup of selectSeat) {

      const { section, row, seatIds } = seatGroup;

      if (!seatIds || seatIds.length === 0) {
        return res.status(400).json({ message: "No seats selected" });
      }

      totalSeats += seatIds.length;

      const sec = event.sections.find(s => s.name === section);

      if (!sec) {
        return res.status(404).json({ message: "Section not found" });
      }

      const r = sec.rows.find(r => r.name === row);

      if (!r) {
        return res.status(404).json({ message: "Row not found" });
      }

      const seatsToBook = r.seats.filter(seat =>
        seatIds.includes(seat._id.toString())
      );

      if (seatsToBook.length !== seatIds.length) {
        return res.status(400).json({ message: "Invalid seats" });
      }

      const alreadyBooked = seatsToBook.some(
        seat => seat.status === "booked"
      );

      if (alreadyBooked) {
        return res.status(400).json({
          message: "Some seats already booked"
        });
      }

      seatsToBook.forEach(seat => {seat.status = "booked"});

    }

    if (totalSeats > 10) {
      return res.status(400).json({
        message: "Maximum 10 tickets allowed"
      });
    }

    await event.save();

    res.json({
      success: true,
      groupDiscount: totalSeats >= 4
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = purchaseTickets;