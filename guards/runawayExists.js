const db = require("../model/helper");

async function runawayExists(req, res, next) {
  let all = null;
  try {
    let runaways = await db("SELECT * FROM Runaways ORDER BY runawayID ASC;");
    res.status(200);
    all = await runaways.data;
  } catch (error) {
    res.status(500).send(error);
  }
  if (!all) {
    return res.status(404).send("Couldn't access db");
  }

  const runaway = all.find((e) => +e.runawayID === +req.params.id);

  if (!runaway) {
    return res.status(404).send("This runaway does not exist.");
  }
  req.runaway = runaway;
  next();
}

module.exports = {
  runawayExists,
};
