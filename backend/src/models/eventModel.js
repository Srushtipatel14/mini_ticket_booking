const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({
  seatNumber: Number,
  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available"
  }
});

const RowSchema = new mongoose.Schema({
  name: String,
  totalSeats: Number,
  seats: [SeatSchema]
});

const SectionSchema = new mongoose.Schema({
  name: String,
  rows: [RowSchema]
});

const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  sections: [SectionSchema]
});

EventSchema.pre("save", async function () {
  this.sections.forEach(section => {
    section.rows.forEach(row => {
      if (!row.seats || row.seats.length === 0) {
        row.seats = [];
        for (let i = 1; i <= row.totalSeats; i++) {
          row.seats.push({
            seatNumber: i,
            status: "available"
          });
        }
      }
    });
  });
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;