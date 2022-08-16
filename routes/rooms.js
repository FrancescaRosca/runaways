var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const { roomExists } = require("../guards/roomExists.js");

const getAllRooms = async (req, res) => {
  try {
    let rooms = await db("SELECT * from Rooms;");
    res.status(200).send(rooms.data);
  } catch (error) {
    res.status(404).send(error);
  }
};

/* GET rooms listing. */
router.get("/", function (req, res, next) {
  getAllRooms(req, res);
});

/* GET room by id */
router.get("/:id", roomExists, function (req, res, next) {
  res.status(200).send(req.room);
});

/* POST room */
router.post("/", async (req, res, next) => {
  try {
    let {
      hostID,
      max_capacity,
      bed_size,
      isBed,
      own_bath,
      available_start,
      available_end,
    } = req.body;

    await db(`INSERT INTO Rooms 
      (hostID, max_capacity, bed_size, isBed, own_bath, available_start, available_end) 
      VALUES (${hostID}, '${max_capacity}', '${bed_size}', '${isBed}', '${own_bath}', '${available_start}', '${available_end}');`);
    await getAllRooms(req, res);
  } catch (error) {
    res.send(error).status(400);
  }
});

/* PUT update room info */
router.put("/:id", roomExists, async (req, res, next) => {
  try {
    let {
      max_capacity,
      bed_size,
      isBed,
      own_bath,
      available_start,
      available_end,
    } = req.body;

    await db(`UPDATE Rooms 
      SET 
      max_capacity = '${max_capacity}',
      bed_size = '${bed_size}', 
      isBed = '${isBed}', 
      own_bath = '${own_bath}', 
      available_start = '${available_start}', 
      available_end = '${available_end}' 
      WHERE roomID = ${req.params.id} ;`);
    await getAllRooms(req, res);
  } catch (error) {
    res.send(error).status(400);
  }
});

/* DELETE room by id */
router.delete("/:id", async (req, res, next) => {
  await db(`DELETE FROM Rooms WHERE roomID = ${req.params.id};`);
  await getAllRooms(req, res);
});

module.exports = router;
