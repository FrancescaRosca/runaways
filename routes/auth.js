var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");

const jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
require("dotenv").config();
const supersecret = process.env.SUPER_SECRET;

// Log In
router.post("/", async (req, res) => {
  const { username, pass } = req.body;
  try {
    //get user's basic info by username
    const results = await db(
      `SELECT Users.id, Users.username, Users.password, Users.isHost, Hosts.hostID, Runaways.runawayID FROM Users LEFT JOIN Hosts ON Users.id = Hosts.userID  LEFT JOIN Runaways ON Users.id = Runaways.userID WHERE Users.username = '${username}';`
    );

    //user info
    const user = results.data[0];

    if (user) {
      //information we store in the token payload
      const user_id = user.id;
      const isHost = user.isHost;
      const host_id = user.hostID;
      const runaway_id = user.runawayID;

      const correctUsername = user.username === username;
      const correctPass = await bcrypt.compare(pass, user.password);
      if (!correctPass || !correctUsername) {
        res.status(404).send("Login failed. Make sure your data is correct.");
      } else {
        let token = jwt.sign(
          { user_id, username, isHost, host_id, runaway_id },
          supersecret
        );
        res
          .status(200)
          .send({ message: "Login successful, here is your token", token });
      }
    } else {
      res.status(404).send("Login failed. Make sure your data is correct.");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get Payload Info

router.get("/profile", userShouldBeLoggedIn, async (req, res) => {
  try {
    res.send({
      message: "Here is your data",
      id: req.user_id,
      username: req.username,
      isHost: req.isHost,
      host_id: req.host_id,
      runaway_id: req.runaway_id,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
