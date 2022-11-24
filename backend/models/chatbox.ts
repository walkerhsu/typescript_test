import mongoose from 'mongoose';
import {IUser, IChatBox, IMessage} from '../interface';

const Schema = mongoose.Schema
// Creating a schema, sort of like working with an ORM

const UserSchema = new Schema({
    name: { type: String, required: [true, 'Name field is required.'] },
    chatBoxes: [{ type: mongoose.Types.ObjectId, ref: 'ChatBox' }],
});
const UserModel = mongoose.model<IUser>('User', UserSchema);

/******* Message Schema *******/
const MessageSchema = new Schema({
    chatBox: { type: mongoose.Types.ObjectId, ref: 'ChatBox' },
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    body: { type: String, required: [true, 'Body field is required.'] },
});
const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

/******* ChatBox Schema *******/
const ChatBoxSchema = new Schema({
    name: { type: String, required: [true, 'Name field is required.'] },
    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
});
const ChatBoxModel = mongoose.model<IChatBox>('ChatBox', ChatBoxSchema);

// Exporting table for querying and mutating
export {UserModel, MessageModel, ChatBoxModel};
