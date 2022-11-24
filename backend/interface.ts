import WebSocket from 'ws';
import mongoose from 'mongoose';

import {IPayload, IStatus, ISingleMsg} from '../interface';


export interface IWebSocket extends WebSocket.WebSocket {
    id: string;
    box: string;
} 

export interface IUser {
    name?: string;
    chatBoxes?: mongoose.Types.ObjectId[];
}
export interface IMessage {
    chatBox: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId | IUser;
    body: string;
}
export interface IChatBox {
    name?: string;
    users?: mongoose.Types.ObjectId[];
    messages?: mongoose.Types.ObjectId[];
}

export {IPayload, IStatus, ISingleMsg}
