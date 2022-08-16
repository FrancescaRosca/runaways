import React, { useEffect, useRef } from "react";

    function ChatList(props) {
        let listDiv = useRef(null);

        //Adding a scrolling message so you can see every message when new msg are added

        useEffect(() => {
            let lastPara = listDiv.current.lastElementChild;
            if (lastPara) {
                lastPara.scrollIntoView(false);
            }
        }, [props.messages]);

    function formatDT(dt) {
        return new Date(dt).toLocaleDateString();
    }

    return (
        <div className="chat-list rounded mb-1" ref={listDiv}>
        {
            props.messages.map(m => (
                <p
                    key={m.id}
                    className={m.senderId === props.senderId ? 'sender' : 'receiver'}
                >
                    <span title={formatDT(m.dateTime)}>{m.text}</span>
                </p>
            ))
        }    
        </div>
    );

}


export default ChatList;