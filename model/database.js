require("dotenv").config();
const mysql = require("mysql");

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;

const con = mysql.createConnection({
  host: DB_HOST || "127.0.0.1",
  user: DB_USER || "root",
  password: DB_PASS,
  database: DB_NAME || "runaways",
  multipleStatements: true,
});

con.connect(function (err) {
  if (err) throw err;

  console.log("Connected!");
  // Drop tables at start
  let initTables = [
    "DROP TABLE if exists Users;",
    "CREATE TABLE IF NOT EXISTS Users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(30) NOT NULL UNIQUE, password varchar(255) NOT NULL, email varchar(255) NOT NULL, name varchar(255) NOT NULL, surname varchar(255) NOT NULL, pronouns INT NOT NULL, birthday DATETIME NOT NULL, isQueer BOOLEAN, isHost BOOLEAN NOT NULL);",
    "DROP TABLE if exists Hosts;",
    "DROP TABLE if exists Host;",
    "CREATE TABLE IF NOT EXISTS Hosts (hostID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, userID INT NOT NULL, location varchar(255) NOT NULL, address TEXT NOT NULL, num_rooms INT NOT NULL, pets_allowed BOOLEAN NOT NULL, already_living INT NOT NULL);",
    "DROP TABLE if exists Runaways;",
    "CREATE TABLE IF NOT EXISTS Runaways (runawayID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, userID INT NOT NULL, location varchar(255) NOT NULL, need_room_asap BOOLEAN NOT NULL, when_need_room DATE, why_running TEXT, isTrans BOOLEAN, how_queer INT, has_room INT);",
    "DROP TABLE if exists Room;",
    "DROP TABLE if exists Rooms;",
    "CREATE TABLE IF NOT EXISTS Rooms (roomID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, hostID INT NOT NULL, max_capacity INT NOT NULL, bed_size varchar(255), isBed BOOLEAN NOT NULL, own_bath BOOLEAN NOT NULL, available_start DATE NOT NULL, available_end DATE NOT NULL);",
    "DROP TABLE if exists Type_of_pronouns;",
    "CREATE TABLE IF NOT EXISTS Type_of_pronouns (pronounsID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, pronoun varchar(30) NOT NULL);",
    "DROP TABLE if exists Type_of_queer;",
    "CREATE TABLE IF NOT EXISTS Type_of_queer (queerID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, label varchar(30) NOT NULL UNIQUE);",
    "DROP TABLE if exists messages;",
    "CREATE TABLE messages (id int NOT NULL AUTO_INCREMENT, senderId int NOT NULL, receiverId int NOT NULL, text varchar(255) NOT NULL, dateTime DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id));",

    "ALTER TABLE Users ADD CONSTRAINT Users_fk0 FOREIGN KEY (pronouns) REFERENCES Type_of_pronouns(pronounsID);",
    "ALTER TABLE Hosts ADD CONSTRAINT Hosts_fk0 FOREIGN KEY (userID) REFERENCES Users(id);",
    "ALTER TABLE Runaways ADD CONSTRAINT Runaways_fk0 FOREIGN KEY (userID) REFERENCES Users(id);",
    "ALTER TABLE Runaways ADD CONSTRAINT Runaways_fk1 FOREIGN KEY (how_queer) REFERENCES Type_of_queer(queerID);",
    "ALTER TABLE Runaways ADD CONSTRAINT Runaways_fk2 FOREIGN KEY (has_room) REFERENCES Rooms(roomID);",
    "ALTER TABLE Rooms ADD CONSTRAINT Rooms_fk0 FOREIGN KEY (hostID) REFERENCES Hosts(hostID);",
    "INSERT INTO Type_of_pronouns (pronoun) VALUES ('he'), ('she'), ('they');",
    "INSERT INTO Type_of_queer (label) VALUES ('gay'), ('lesbian'), ('bi/pan'), ('aro/ace');",
    "INSERT INTO Users (username, password, email, name, surname, pronouns, birthday, isQueer, isHost) VALUES ('Jane1', '123123', 'jane@test.com', 'Jane', 'Pérez', '2', '1994-02-01', '1', '0'), ('ShiroT', '4545', 'shiro@test.com', 'Shiro', 'Tanaka', '3', '1985-12-11', '1', '1');",
    "INSERT INTO Runaways (userID, location, need_room_asap, when_need_room, why_running, isTrans, how_queer, has_room) VALUES ('1', 'Barcelona', '1', '2022-06-20', 'I''m trans and my family is threatening me.', '1', '2', NULL );",
    "INSERT INTO Hosts (userID, location, address, num_rooms, pets_allowed, already_living) VALUES ('2', 'Barcelona', 'c/ Via Laietana, 3', '1', '1', '2');",
    "INSERT INTO Rooms (hostID, max_capacity, bed_size, isBed, own_bath, available_start, available_end ) VALUES ('1', '1', '200x80m', '1', '0', '2022-07-01', '2022-10-01');",
  ];
  let count = 0;
  for (const sql of initTables) {
    con.query(sql, function (err, result) {
      if (err) {
        console.log("Stopped at query ", count);
        throw err;
      }
    });
    count++;
  }
  if (!err) console.log("Tables created!");
  console.log("Closing...");
  con.end();
});
