import WebSocket from 'ws'

import {UserModel, MessageModel, ChatBoxModel} from "./models/chatbox"
import {IWebSocket, IPayload, IStatus, IUser, IMessage, IChatBox, ISingleMsg} from "./interface";

type TChatBoxes = {
    [key: string]: Set<IWebSocket>;
}
interface IInputJSONData {
    data: string;
}
interface IInputData {
    task: string;
    payload: IPayload;
}
interface IOutputData {
    task: string;
    payload: IPayload;
}
const chatBoxes: TChatBoxes = {}; 
const makeName = (name: string, to: string): string =>{return [name, to].sort().join("_");}
const validiateUser = async (name: string) => {
    console.log("validating User" + name);
    let user = await UserModel.findOne({ name });
    if (!user) {
        const newUser = new UserModel({ name });
        await newUser.save();
        user = newUser;
    }
    return user.populate<{chatBoxes: IChatBox}>("chatBoxes");
}
const validiateChatBox = async (name: string, participants: any) => {   
    console.log("validating ChatBox" + name); 
    let box = await ChatBoxModel.findOne({ name });
    if (!box){
        const newBox = new ChatBoxModel({ name, users: participants });
        await newBox.save();
        box = newBox;
    }
    return box.populate<{users: IUser[], messages: IMessage[]}>
        (["users", {path: 'messages', populate: 'sender' }]);
}
const sendData = (data: IOutputData, ws: IWebSocket) => {ws.send(JSON.stringify(data)); }
const sendStatus = (status: IStatus, ws: IWebSocket) => {sendData({task: "status", payload: status}, ws); }

export default {
    onMessage: (wss: WebSocket.Server,ws: IWebSocket) => (
        console.log("onMessage"),
        async (byteString: IInputJSONData) => {
            const { data } = byteString
            const {task, payload}: IInputData = JSON.parse(data);
            switch (task) {
                case "CHAT": {
                    console.log("CHAT");
                    const {name, to} = payload
                    if(name && to){
                        const chatBoxName = makeName(name, to);
                        ws.box = chatBoxName;
                        if (!chatBoxes[ws.box])
                            chatBoxes[ws.box] = new Set();
                        chatBoxes[chatBoxName].add(ws);
                        const user1 = await validiateUser(name);
                        const user2 = await validiateUser(to);
                        const chatBox = await validiateChatBox(chatBoxName, [user1, user2])
                        console.log(`user1 = ${user1}, \nuser2 = ${user2}, \nchatbox = ${chatBox}`);
                        await UserModel.findOne({name: name}).updateOne
                                ({$push: {chatBoxes: chatBox._id}});
                        await UserModel.findOne({name: to}).updateOne
                                ({$push: {chatBoxes: chatBox._id}});
                        if (chatBox.messages) {
                            console.log("CHAT: msg=", chatBox.messages);
                            const output = {to: to, body: chatBox.messages.map((msg: IMessage): ISingleMsg=> {
                                return {name: ((msg.sender as IUser).name as string), body: msg.body}
                            })};
                            console.log(`output = ${output}`);
                            sendData({task: 'ChatOut', payload: output}, ws);
                            sendStatus({type: 'success', msg: 'Chatbox created.'}, ws);
                        }
                    }
                    break;
                }
                case "MESSAGE": {
                    console.log("MESSAGE");
                    const {name, to, body} = payload
                    if(name && to){
                        const chatBoxName = makeName(name, to);
                        const user1 = await validiateUser(name);
                        const user2 = await validiateUser(to);
                        const chatBox = await ChatBoxModel.findOne({name: chatBoxName});
                        console.log(user1, user2);
                        const message = new MessageModel({chatBox: chatBox, sender: user1, body});
                        await ChatBoxModel.findOne({name: chatBoxName}).updateOne
                                ({$push: {messages: message}});
                        console.log(message);
                        try { 
                            await message.save();
                        } catch (e) { 
                            throw new Error
                            ("Message DB save error: " + e); 
                        }
                        const output = payload;
                        chatBoxes[chatBoxName].forEach((client) => {
                            if(client.box === chatBoxName){
                                sendData({task: "MsgOut", payload: output}, client);
                                if(client.id === ws.id){
                                    sendStatus({type: 'success', msg: 'Msg sent.'}, client);
                                }
                                else{
                                    sendStatus({type: 'success', msg: 'Msg received.'}, client);
                                }
                            }
                        })
                    }
                    break
                }
                
                default: break
               
            }
        })
}