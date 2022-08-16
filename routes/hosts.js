var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const { hostExists } = require("../guards/hostExists");

const getAllHosts = async (req, res) => {
  try {
    let hosts = await db("SELECT * from Hosts;");
    res.status(200).send(hosts.data);
  } catch (error) {
    res.status(404).send(error);
  }
};

/* GET hosts listing. */
router.get("/", function (req, res, next) {
  getAllHosts(req, res);
});

/* GET host by id */
router.get("/:id", hostExists, function (req, res, next) {
  res.status(200).send(req.hostUser);
});

/* PUT update host only info */
router.put("/:id", hostExists, async (req, res, next) => {
  try {
    let { location, address, num_rooms, pets_allowed, already_living } =
      req.body;

    await db(`UPDATE Hosts 
      SET  
      location = '${location}', 
      address = '${address}', 
      num_rooms = '${num_rooms}', 
      pets_allowed = '${pets_allowed}', 
      already_living = '${already_living}'
      WHERE hostID = ${req.params.id} ;`);
    await getAllHosts(req, res);
  } catch (error) {
    res.send(error).status(400);
  }
});

/* DELETE host by id */
router.delete("/:id", async (req, res, next) => {
  await db(`DELETE FROM Hosts WHERE hostID = ${req.params.id};`);
  await getAllHosts(req, res);
});

module.exports = router;
