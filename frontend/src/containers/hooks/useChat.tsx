import { createContext, useContext, useEffect, useState} from "react"
import React from "react";
import { message } from 'antd'
import {ContextInterface} from "../interface";
import {IStatus} from "../interface";
import {IMessage} from "../interface";
import {IData} from "../interface";
import {IUseChatProps} from "../interface";
import {ITask_Payload} from "../interface";
const client = new WebSocket ('ws://localhost:4000')
const LOCALSTORAGE_KEY = "My";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const ChatContext = createContext<ContextInterface>({
    status: {},
    me: '',
    messages: {},
    signedIn: false,

    setMe: () => {},
    setSignedIn: () => {},
    setMessages: () => {},
    sendMessage: () => {},
    startChat : () =>{},
    displayStatus: () => {},
});

const ChatProvider = (props: IUseChatProps)=> {
    const [status, setStatus] = useState<IStatus>({});
    const [me, setMe] = useState(savedMe || '');
    const [signedIn, setSignedIn] = useState(false);
    const [messages, setMessages] = useState<IMessage>({}); 
    // { title : [{name: , body: } , {name: , body: }] }
    
    // const [friendNumbers, setFriendNumbers] = useState(0);
    
    useEffect(() => {
        if(signedIn){
            localStorage.setItem(LOCALSTORAGE_KEY, me);
        }
    }, [signedIn]);
    
    const displayStatus = (s: IStatus) => {
        if (s.type && s.msg ) {
          const { type, msg } = s;
          const content = {content: msg, duration: 0.5}
    
        switch (type) {
          case 'success':
            message.success(content)
            break
          case 'error':
            default:
            message.error(content)
            break
        }
    }}
    const startChat = (name: string , to: string) => {
        if(!name || !to){
            throw new Error("Missing username or friend name.");
        }
        sendData(
            {
                task: 'CHAT', 
                payload: {name, to}
            }
        )
    }
    const sendMessage = (name: string, to: string, body:string) => {
        if(!name || !to || !body){
            throw new Error(`Missing name, to, or body
                            (name : ${name}, to : ${to}, body : ${body}) `);
        }
        console.log("sending message...");
        const data: IData = {
            task: "MESSAGE",
            payload: {name, to, body}
        }
        sendData(data);
    }
    
    const sendData = async (data: IData) => {
        await client.send(JSON.stringify(data));
    };
    
    client.onmessage = (byteString) => {
        const { data } = byteString;
        
        const {task, payload}: ITask_Payload = JSON.parse(data);
        console.log(task, payload);
        switch (task) {
            case "MsgOut": {
                const {name, to, body} = payload;
                const newMsg = messages
                const chatName = (name === me) ? to : name;
                console.log(name, to, body, chatName);
                if(chatName && name && typeof(body) === "string"){
                    console.log("in")
                    if(newMsg[chatName] && newMsg[chatName]?.length !== 0){
                        console.log("MSG: chatname already exists");
                        newMsg[chatName] = [...messages[chatName], ...[{name, body}]]
                    }
                    else{
                        console.log("MSG: chatname does not exist");
                        newMsg[chatName] = [{name, body}]
                    }
                    console.log(newMsg[chatName]);
                }
                setMessages(newMsg); 
                break;
            }
            case "ChatOut": {
                const {to, body} = payload;
                console.log(to, body);

                const newMsg = messages
                if(to && typeof(body) === "object"){
                    if(body.length !== 0) {
                        console.log("CHAT: msg=", body);
                        newMsg[to] = body
                    }
                    else {
                        console.log("CHAT: no message")
                        newMsg[to] = []
                    }
                }
                
                console.log(newMsg);
                setMessages(newMsg);
                break;
            }
            case "status": {
                setStatus(payload); 
                break; 
            }
            
            default: break;
        }
    }
    const value: ContextInterface = {
        status, 
        me,
        signedIn,
        messages,

        setMe,
        setSignedIn,
        setMessages,
        sendMessage,
        startChat,
        displayStatus,
    }
    return (
        <ChatContext.Provider
            value={
                value
            }
            {...props}
        />
    );
};
const useChat = () => useContext(ChatContext);
export  { ChatProvider, useChat};
