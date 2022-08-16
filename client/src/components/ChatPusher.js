import React, { useEffect, useRef, useState} from "react";
import Pusher from "pusher-js";
import axios from "axios";
import ChatList from "./ChatList";
import ChatInput from "./ChatInput";

function ChatPusher(props) {
    const [messages, setMessages] = useState([]);
    const pusherRef = useRef(null);
    const socketIdRef = useRef(null);

    // Connecting to Pusher
    useEffect(() => {
        Pusher.logToConsole = true;

        //Establishing connection with Pusher
        //Pushers key is stored in the .env file

        //let pusherKey = process.env.REACT_APP_PUSHER_KEY;
        let pusherKey = "05ffb7770a66137e95c1";
        //debugger;
        let options = { cluster: 'eu', forceTLS: true };
        pusherRef.current = new Pusher(pusherKey, options);

        //Save socket ID; we send it to the server
        pusherRef.current.connection.bind('connected', () => {
            socketIdRef.current = pusherRef.current.connection.socket_id;
        });

        //Functions that will disconnect when components are unmounted
        return () => {
            pusherRef.current.disconnect();
        }
    }, []);

    //Suscribe to a channel
    useEffect(() => {
        //Retunr if the sender and the receiver are the same
        if (props.senderId === props.receiverId) {
            return;
        }

        //Create channel name from sender/receiver IDs
        let ids = [props.senderId, props.receiverId].sort();
        let channelName = 'channel-' + ids.join('-');

        //Suscribe to channel
        let channel = pusherRef.current.subscribe(channelName);

        // Listen for messages broadcast on channel
        channel.bind('message', function(msg) {
            console.log(`here is the new ${msg}`);
            setMessages(messages => [...messages, msg]);
        });

        //Cleanup function: Unsuscribe when participants change
        return () => {
            pusherRef.current.unsubscribe(channelName);
        }
    }, [props.senderId, props.receiverId]);

    // Load previous messages from DB; called whenever participants change
    useEffect(() => {
        //debugger;
        loadPrevMsgs();
    
    }, [props.senderId, props.receiverId]);

    async function loadPrevMsgs() {
        try {
        let response = await axios.get(`/chat/${props.senderId}/${props.receiverId}`);
        setMessages(response.data);
    } catch (err) {
        if (err.response) {
            let r = err.response
            console.log(`Server errror: ${r.status} ${r.status.Text}`);
        } else {
            console.log(`Network error: ${err.message}`);
        }
    }
}
    

    async function sendMessage(text) {
        try {
            //send text and socket id to our server
            let body = { text, socketID: socketIdRef.current };
            let response = await axios.post(`/chat/${props.senderId}/${props.receiverId}`, body);
            // Server responds with "complete" message (including ID and date/time)
            let completeMsg = response.data;
            //setMessages(messages => [...messages, completeMsg]);
            setMessages(completeMsg);
            console.log(messages);
        } catch (err) {
            if (err.response) {
                let r = err.response;
                console.log(`Server errror: ${r.status} ${r.status.Text}`);
            } else {
                console.log(`Network error: ${err.message}`);
            }
        }
    }

    return (
        <div className="Chat">
            <ChatList messages={messages} senderId={props.senderId} />
            <ChatInput sendCb={text => sendMessage(text)} />
        </div>
    );
}

export default ChatPusher; 