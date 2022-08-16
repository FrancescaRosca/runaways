var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const { runawayExists } = require("../guards/runawayExists.js");

const getAllRunaways = async (req, res) => {
  try {
    let runaways = await db("SELECT * from Runaways;");
    res.status(200).send(runaways.data);
  } catch (error) {
    res.status(404).send(error);
  }
};

/* GET runaways listing. */
router.get("/", function (req, res, next) {
  getAllRunaways(req, res);
});

/* GET runaway by id */
router.get("/:id", runawayExists, function (req, res, next) {
  res.status(200).send(req.runaway);
});

/* PUT update runaway only info */
router.put("/:id", runawayExists, async (req, res, next) => {
  try {
    let {
      location,
      need_room_asap,
      when_need_room,
      why_running,
      isTrans,
      how_queer,
      has_room,
    } = req.body;

    await db(`UPDATE Runaways 
      SET  
      location = '${location}', 
      need_room_asap = '${need_room_asap}', 
      when_need_room = '${when_need_room}', 
      why_running = '${why_running}', 
      isTrans = '${isTrans}', 
      how_queer = '${how_queer}', 
      has_room = ${has_room}
      WHERE runawayID = ${req.params.id} ;`);
    await getAllRunaways(req, res);
  } catch (error) {
    res.send(error).status(400);
  }
});

/* DELETE runaway by id */
router.delete("/:id", async (req, res, next) => {
  await db(`DELETE FROM Runaways WHERE runawayID = ${req.params.id};`);
  await getAllRunaways(req, res);
});

module.exports = router;
