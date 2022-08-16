const db = require("../model/helper");

async function hostExists(req, res, next) {
  let all = null;
  try {
    let hosts = await db("SELECT * FROM Hosts ORDER BY hostID ASC;");
    res.status(200);
    all = await hosts.data;
  } catch (error) {
    res.status(500).send(error);
  }
  if (!all) {
    return res.status(404).send("Couldn't access db");
  }

  const hostUser = all.find((e) => +e.hostID === +req.params.id);

  if (!hostUser) {
    return res.status(404).send("This host does not exist.");
  }
  req.hostUser = hostUser;
  next();
}

module.exports = {
  hostExists,
};
