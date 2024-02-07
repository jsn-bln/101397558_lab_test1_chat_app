const express = require('express');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const PrivateMessage = require('./model/privateMessageSchema'); 
const GroupMessage = require('./model/groupMessageSchema'); 
require('dotenv').config();

const port = process.env.PORT || 8080;
const uri = process.env.URI;

mongoose.connect(uri);
const db = mongoose.connection;
db.once('open', () => {
    console.log('Status: connected to database!');
});

const app = express();
const server = http.createServer(app); 
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
}); 

app.use(cors());
app.use(express.json());


io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chatMessage', async (message) => {
        try {
            const { from_user, to_user, room, message: messageContent } = message;
            const roomValue = room || "default";
            console.log(message);
            if (to_user) {
                const privateMessage = new PrivateMessage({
                    from_user,
                    to_user,
                    message: messageContent
                });
                await privateMessage.save();
            } else {
                const groupMessage = new GroupMessage({
                    from_user,
                    room: roomValue,
                    message: messageContent
                });
                await groupMessage.save();
            }

            io.emit('message', message);
        } catch (error) {
            console.error('Error handling chat message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.use("/", userRoutes);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
