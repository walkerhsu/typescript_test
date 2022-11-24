import http from 'https'
import express from 'express'
import mongoose from 'mongoose'
import {v4 as uuidv4} from 'uuid'
import WebSocket from 'ws'

import {IWebSocket} from './interface'
import mongo from './mongo'
import wsConnect from './wsConnect'

mongo.connect();

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
const db = mongoose.connection

db.once('open', () => {
    console.log("MongoDB connected!")
    wss.on('connection', (ws: IWebSocket) => {
    // Define WebSocket connection logic
        ws.id = uuidv4(); // Assign a unique ID to each client
        ws.box= ''; //keep track of the current chatroom
        ws.onmessage = wsConnect.onMessage(wss, ws)
    });
});
const PORT :string = process.env.PORT || "4000";
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})