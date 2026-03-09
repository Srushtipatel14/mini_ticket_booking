require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./dbconn/conn");
const PORT = process.env.PORT || 8000;
const eventRoutes =require("./routes/events");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/events", eventRoutes)

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT);
  } catch (err) {
    process.exit(1);
  }
}

startServer();
