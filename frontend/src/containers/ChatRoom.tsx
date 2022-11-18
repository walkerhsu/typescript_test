import { useState, useRef, useEffect } from "react";
import styled from 'styled-components';
import {Input, Button, Tabs} from 'antd'
import React from "react";

import {useChat} from "./hooks/useChat";
import Title from '../components/Title';
import ChatModal from '../components/chatModals';
import Message from "../components/Message";

import { IsingleMsg } from "./interface";

const ChatBoxesWrapper = styled(Tabs)`
    height: 300px;
    width: 100%;
    background-color: #eeeeee52;
    border-radius: 10px;
    margin: 20px;
    padding: 20px;
`;

const ChatBoxWrapper = styled.div`
    height: calc(240px - 36px);
    displex: flex;
    flex-direction: column;
    overflow: auto;
`;

const FootRef = styled.div`
    height: 20px;
`;
interface ChatBoxProps {
    label: string,
    children: React.ReactNode,
    key: string,
}

interface ChatRoomProps {
    me: string,
}

const ChatRoom = ({me}: ChatRoomProps) =>{
    const {messages, setMessages, sendMessage, startChat, displayStatus } = useChat();
    // const [username, setUsername] = useState('')
    const [msg, setMsg] = useState<string>('')
    const [activeKey, setActiveKey] = useState<number>(0);
    const [chatBoxes, setChatBoxes] = useState<ChatBoxProps[]>([]);
    const [msgSent, setMsgSent] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    
    const msgRef = useRef(null)
    const msgFooter = useRef(null);
    const makeName = (name1: string, name2: string): string => {return [name1, name2].sort().join("_")}
    const findChatBox = (targetKey: string) => {
        for(let i = 0; i < chatBoxes.length; i++){        
            if (chatBoxes[i].key === targetKey) {
                // console.log(`found chatBox.key = ${targetKey} with index=${i}`);
                // console.log(`chatBoxes[i] = ${chatBoxes[i].label}`);
                return i;
            }
        };
        return -1;
    }
    const displayChat = (chat: IsingleMsg[]) => {
        console.log(`msg  = ${chat}`);
        return (chat.length === 0 ? (
            <p style={{ color: '#ccc' }}> No messages... </p>
        ) : (
            <ChatBoxWrapper>
                {chat.map(({ name, body }: IsingleMsg, i: number) => (
                    <Message isMe={name === me} message={body}  key_number={i} />
                ))}
                <FootRef ref={msgFooter}/>
            </ChatBoxWrapper>
        ))
    }
    const createChatBox = (name) => {
        console.log("Creating chatbox for " + name);
        if (chatBoxes.some(({label}) => label === name)) {
            throw new Error(name +
            "'s chat box has already opened.");
        }
        const chat = messages[name] || [];
        console.log(chat)
        const chatBox = {
            label: name,
            children: displayChat(chat),
            key: makeName(me, name),
        }
        setChatBoxes([...chatBoxes, chatBox]);
        setMsgSent(true);
        setActiveKey(makeName(me, name));
    }
    const updateChatBoxes = () => {
        const newChatBoxes = chatBoxes.map((chatBox) => {
            console.log(chatBox, activeKey);
            if(chatBox?.key === activeKey){
                const chat = messages[chatBox.label] || [];
                // console.log(chat);
                if(chat.length > 0){
                    chatBox.children = displayChat(chat);
                }
            }
            return chatBox;
        })
        setChatBoxes(newChatBoxes)
    }
    
    const removeChatBox = (targetKey, activeKey) =>{
        let lastIndex = 0;
        chatBoxes.forEach((pane, i) => {
            if (pane.key === targetKey ) {
                if(i!==0) lastIndex = i - 1;
                else lastIndex = 0;
            }
        });
        const newMsg = messages;

        delete newMsg[chatBoxes[findChatBox(targetKey)].label];
        setMessages(newMsg);
        const newChatBoxes = chatBoxes.filter(pane => pane.key !== targetKey);
        if (newChatBoxes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                setActiveKey(newChatBoxes[lastIndex].key);
            } else {
                setActiveKey(newChatBoxes[0].key);
            }
        }
        setChatBoxes(newChatBoxes);
    }
    const scrollToBottom = () => {
        msgFooter.current?.scrollIntoView({ behavior: "smooth", block:"start"});
    }

    useEffect(() => {
        scrollToBottom();
        setMsgSent(false);
    }, [msgSent]);

    useEffect(() => {
        updateChatBoxes();
    },[messages[chatBoxes[findChatBox(activeKey)]?.label]]);
  
    const onChange = (newActiveKey) => {
        startChat(me, chatBoxes[findChatBox(newActiveKey)]?.label );
        setActiveKey(newActiveKey);
    };

    const onEdit = (targetKey, action) => {
        if (action === 'add') {
          setModalOpen(true);
        } else if (action === 'remove') {
          removeChatBox(targetKey, activeKey);
        }
    };
    // useEffect(() => {
    //     console.log(chatBoxes)
    // }, [chatBoxes])
    return (
    <>
        <Title name={me} />
        <Button type="primary" danger onClick={clearMessages} >
            Clear
        </Button>
        <ChatBoxesWrapper
            tabBarStyle={{height: '36px'}}
            type="editable-card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={onEdit}
            items={chatBoxes}
        />
        <ChatModal 
            open={modalOpen}
            onCreate={({name}) => {
                createChatBox(name);
                startChat(me, name);
                // console.log(` messages[${name}] = ${messages[name]}`);
                setModalOpen(false);
            }}
            onCancel={() => setModalOpen(false)}
        />
        
        {/* <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === 'Enter') {
                msgRef.current.focus()
            }}}
            style={{ marginBottom: 10 }}
        ></Input> */}
        <Input.Search
            value={msg}
            ref={msgRef}
            onChange={(e) => setMsg(e.target.value)}
            enterButton="Send"
            placeholder="Type a message here..."
            onSearch={(msg) => {
            if (!msg) {
                displayStatus({
                type: 'error',
                msg: 'Please enter a message body.'
                })
                return
            }
            sendMessage(me, chatBoxes[findChatBox(activeKey)].label, msg )
            setMsg('')
            setMsgSent(true)
            }}
        ></Input.Search>
    </>
  )
}

export default ChatRoom