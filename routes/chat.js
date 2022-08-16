var express = require('express');
var router = express.Router();
const db = require('../model/helper');
const Pusher = require('pusher');
require("dotenv").config();

// Number of prior messages to GET
const GET_MESSAGE_COUNT = 5;

//Initializing the Pusher connection
const channel = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: 'eu',
    useTLS: true
});

// GET recent messages
router.get('/:senderId/:receiverId', async function(req,res) {
    let { senderId, receiverId } = req.params;

    try {
        let sql = `
        SELECT * FROM messages
        WHERE senderId IN (${senderId}, ${receiverId}) AND
            receiverId IN (${senderId}, ${receiverId})
        ORDER BY dateTime DESC
        LIMIT ${GET_MESSAGE_COUNT}
        `;
        let results = await db(sql);
        res.send( results.data.reverse() ); //returning in chronological order
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Save the new messages in the database and publish to Pusher
router.post('/:senderId/:receiverId', async function(req,res) {
    console.log("BACKEND!!!");
    let { senderId, receiverId } = req.params;
    let { text, socketId } = req.body;

    // Escape possible single quotes in text before writing to DB
    let text4db = text.replace(/\'/g, "\\'");

    //Adding message to the DB by saving it
    let newMessage = null;
    let allMsg; 
    try {
        let sql = `
            INSERT INTO messages (senderId, receiverId, text)
            VALUES (${senderId}, ${receiverId}, '${text4db}');
            SELECT LAST_INSERT_ID()
        `;
        let results = await db(sql);
        let newMsgId = results.data[0].insertId;
        // Return "complete" message (with ID and date/time)
        // After saving the message, I fetch it again
        results = await db(`SELECT * FROM messages WHERE id = ${newMsgId}`);
        const texts = await db(`SELECT * FROM messages`);
        allMsg = texts.data;
        newMessage = results.data[0];
    } catch (err) {
        res.status(500).send({ error: err.message });
        return;
    }

    // Channel name for the users
    let ids = [senderId, receiverId].sort();
    let channelName= 'channel-' + ids.join('-');

    //Publish message to Pusher so it can be seen on the users channel
    // Including sender's socketId 
    channel.trigger(channelName, 'message', newMessage, { socket_id: socketId });

    res.send(allMsg);
});

module.exports = router;