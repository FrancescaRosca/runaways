var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const { userExists } = require("../guards/userExists.js");
var bcrypt = require("bcrypt");
const saltRounds = 10;

//create getall function
const getAllUsers = async (req, res) => {
  try {
    let users = await db("SELECT * from Users;");
    res.status(200).send(users.data);
  } catch (error) {
    res.status(404).send(error);
  }
};

/* GET users listing. */
router.get("/", function (req, res, next) {
  getAllUsers(req, res);
});

/* GET user by id */
router.get("/:id", userExists, function (req, res, next) {
  res.status(200).send(req.user);
});

/* POST new user */
router.post("/", async (req, res, next) => {
  try {
    let {
      username,
      password,
      email,
      name,
      surname,
      pronouns,
      birthday,
      isQueer,
      isHost,
    } = req.body;
    const hashedPass = await bcrypt.hash(password, saltRounds);
    await db(
      `INSERT INTO Users 
      (username, password, email, name, surname, pronouns, birthday, isQueer, isHost) 
      VALUES('${username}', '${hashedPass}', '${email}', '${name}', '${surname}', '${pronouns}', '${birthday}', '${isQueer}', '${isHost}');`
    );
    //depending on what kind of user we are creating, we have different queries
    if (isHost) {
      try {
        let { location, address, num_rooms, pets_allowed, already_living } =
          req.body;
        let userID = await db(
          `SELECT id FROM Users WHERE 
        username = '${username}' AND password = '${hashedPass}' ;`
        );
        await db(
          ` INSERT INTO Hosts 
        (userID, location, address, num_rooms, pets_allowed, already_living) 
        VALUES ('${userID.data[0].id}', '${location}', '${address}', '${num_rooms}', '${pets_allowed}', '${already_living}');`
        );
      } catch (error) {
        res.send(error);
      }
    } else {
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
        let userID = await db(
          `SELECT id FROM Users 
          WHERE username = '${username}' AND password = '${hashedPass}' ;`
        );
        //remember that ' can be escaped writting ''
        await db(
          ` INSERT INTO Runaways (userID, location, 
            need_room_asap,
            when_need_room,
            why_running,
            isTrans,
            how_queer,
            has_room) 
            VALUES ('${userID.data[0].id}', '${location}', '${need_room_asap}', '${when_need_room}', '${why_running}', '${isTrans}', '${how_queer}', ${has_room});`
        );
      } catch (error) {
        res.send(error);
      }
    }
    await getAllUsers(req, res);
  } catch (error) {
    res.send(error);
  }
});

/* PUT update basic user info */
router.put("/:id", userExists, async (req, res, next) => {
  try {
    let {
      username,
      password,
      email,
      name,
      surname,
      pronouns,
      birthday,
      isQueer,
      isHost,
    } = req.body;

    await db(`UPDATE Users 
      SET  
      username = '${username}', 
      password = '${password}', 
      email = '${email}', 
      name = '${name}', 
      surname = '${surname}', 
      pronouns = '${pronouns}', 
      birthday = '${birthday}', 
      isQueer = '${isQueer}', 
      isHost = '${isHost}'
      WHERE id = ${req.params.id} ;`);
    await getAllUsers(req, res);
  } catch (error) {
    res.send(error).status(400);
  }
});

/* DELETE user by id */
router.delete("/:id", async (req, res, next) => {
  await db(`DELETE FROM Users WHERE id = ${req.params.id};`);
  await getAllUsers(req, res);
});

module.exports = router;
