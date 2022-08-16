const jwt = require("jsonwebtoken");
require("dotenv").config();
const supersecret = process.env.SUPER_SECRET;

const userShouldBeLoggedIn = (req, res, next) => {
  const token = req.headers["authorization"].replace(/^Bearer\s/, "");

  if (!token) {
    res.status(401).send("You're not authorized.");
  } else {
    jwt.verify(token, supersecret, (err, decoded) => {
      if (err) res.status(401).send(err);
      else {
        req.user_id = decoded.user_id;
        req.username = decoded.username;
        req.isHost = decoded.isHost;
        req.host_id = decoded.host_id;
        req.runaway_id = decoded.runaway_id;
        next();
      }
    });
  }
};

module.exports = userShouldBeLoggedIn;
