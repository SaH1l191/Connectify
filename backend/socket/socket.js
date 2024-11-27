import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import Conversation from '../models/ConversationModel.js'
import Message from '../models/messageModel.js'


const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})
export const getRecipientSocketId = (recipientId) => {
	return userSocketMap[recipientId];
};


const userSocketMap = {}; // userId: socketId



io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    const userId = socket.handshake.query.userId;



    //converting object map to arrays consistig of object keys 
    if (userId != "undefined") userSocketMap[userId] = socket.id;


// server sends an updated list of online users (Object.keys(userSocketMap)).
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
        try {
            await Message.updateMany({ conversationId: conversationId, seen: false }, { $set: { seen: true } });
            await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });
            io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});




export { io, app, server }



//.on('connection', ...): This listens for new WebSocket connections from clients.
// When a client connects to the server, the callback function is triggered, and it receives the socket object, which represents the connection between the client and server.
// Inside the callback, the socket.id is logged to the console. This ID is a unique identifier for each client connection, which you can use for things like targeting specific clients for emitting events or handling disconnections.