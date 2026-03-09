const express = require("express")
const createEvent = require("../controllers/createEvent");
const getEvents = require("../controllers/getEvents");
const getAvailability = require("../controllers/getAvailablity");
const purchaseTickets = require("../controllers/purchaseTickets");

const router = express.Router()

router.post("/", createEvent)
router.get("/", getEvents)
router.get("/:id/availability", getAvailability)
router.post("/:id/purchase", purchaseTickets)

module.exports=router;