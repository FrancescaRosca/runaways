const db = require("../model/helper");

async function userExists(req, res, next) {
  let all = null;
  try {
    let users = await db("SELECT * FROM Users ORDER BY id ASC;");
    res.status(200);
    all = await users.data;
  } catch (error) {
    res.status(500).send(error);
  }
  if (!all) {
    return res.status(404).send("Couldn't access db");
  }

  const user = all.find((e) => +e.id === +req.params.id);

  if (!user) {
    return res.status(404).send("This user does not exist.");
  }
  req.user = user;
  next();
}

module.exports = {
  userExists,
};
