import express, { json, urlencoded } from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import cors from 'cors'
// import http from 'http'
// import { Server } from 'socket.io'
import AuthRouter from './Authentication/authRouter.js'
import ProfileRouter from './Profile/profileRouter.js'
import ContactRouter from './Contacts/contactRouter.js'
import ChatRouter from './Chats/chatRouter.js'
import MessageRouter from './Chats/messageRouter.js'

const app = express()
config()
app.use(cors())
app.use(json({ limit: "50mb" }))
app.use(urlencoded({ limit: '50mb', extended: true }))


const port = process.env.port
const mongodb = process.env.mongodb

// Set up HTTP server and Socket.IO server
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:4001", // Frontend URL, adjust as necessary
//         methods: ["GET", "POST"]
//     }
// });

app.use('/Auth', AuthRouter)
app.use('/Profile', ProfileRouter)
app.use('/Contact', ContactRouter)
app.use('/Chat', ChatRouter)
app.use('/Message', MessageRouter)

// Socket.IO connection handler
// io.on("connection", (socket) => {
//     console.log("A user connected:", socket.id);

//     // Join a specific chat room
//     socket.on("joinChat", (chatId) => {
//         socket.join(chatId);
//         console.log(`User ${socket.id} joined chat ${chatId}`);
//     });

//     // Listen for message events and broadcast to the chat room
//     socket.on("sendMessage", (message) => {
//         const { chatId, content, senderId } = message;

//         // Broadcast message to everyone in the chat room
//         io.to(message.chatId).emit("receiveMessage", message);
//     });

//     // Handle receiving message status update (e.g., message delivered or read)
//     socket.on('messageStatusUpdate', (messageData) => {
//         // This will be emitted whenever a message's status changes (sent -> delivered -> read)
//         const { messageId, status } = messageData;

//         // Emit the status update to all clients in the relevant chat room
//         io.emit('statusUpdated', { messageId, status });
//         console.log(`Message status updated: ${messageId} - ${status}`);
//     });

//     // Handle disconnect
//     socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//     });
// });




const start = async () => {

    await connect(mongodb)
    app.listen(port, console.log(`Serving on the post ${port}`))
}

start()
