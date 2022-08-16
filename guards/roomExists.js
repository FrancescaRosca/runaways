const db = require("../model/helper");

async function roomExists(req, res, next) {
  let all = null;
  try {
    let rooms = await db("SELECT * FROM Rooms ORDER BY hostID ASC;");
    res.status(200);
    all = await rooms.data;
  } catch (error) {
    res.status(500).send(error);
  }
  if (!all) {
    return res.status(404).send("Couldn't access db");
  }

  const room = all.find((e) => +e.roomID === +req.params.id);

  if (!room) {
    return res.status(404).send("This room does not exist.");
  }
  req.room = room;
  next();
}

module.exports = {
  roomExists,
};
