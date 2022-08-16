import React, { useState } from "react";
import ChatPusher from "./ChatPusher";
import Navbar from "./Navbar";

function Chat() {

  const [senderId, setSenderId] = useState(1); // default senderID
  const [receiverId, setReceiverId] = useState(2); //default receiverID

  function handleChange(event) {
    let { name, value } = event.target;
    if (name === 'senderId') {
      setSenderId( Number(value) );
    } else {
      setReceiverId( Number(value) );
    }
  }

    return (
    <div id="chat">
      <Navbar />
      <h1 className="title">Chat</h1>

      <div className="users">
        <select name="receiverId" value={receiverId} onChange={handleChange}>
          <option value="1">Ana</option>
          <option value="2">Sara</option>
          <option value="3">Robert</option>
        </select>

        <select name="senderId" value={senderId} onChange={handleChange}>
          <option value="1">Ana</option>
          <option value="2">Sara</option>
          <option value="3">Robert</option>
        </select>
      </div>
      <ChatPusher senderId={senderId} receiverId={receiverId} />
     
    </div>
    );
  }

export default Chat;  