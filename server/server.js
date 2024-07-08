const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let rooms = {};

io.on('connection', (socket) => {
    socket.on('createRoom', (roomName, createdBy) => {
        rooms[roomName] = { createdBy, players: [] };
        io.emit('roomList', rooms);
    });

    socket.on('joinRoom', (roomName, nickname) => {
        if (rooms[roomName]) {
            rooms[roomName].players.push(nickname);
            io.to(roomName).emit('playerJoined', nickname);
            io.emit('roomList', rooms);
        }
    });

    socket.on('disconnect', () => {
        for (let roomName in rooms) {
            rooms[roomName].players = rooms[roomName].players.filter(player => player !== socket.id);
            io.to(roomName).emit('playerLeft', socket.id);
            if (rooms[roomName].players.length === 0) {
                delete rooms[roomName];
            }
            io.emit('roomList', rooms);
        }
    });
});

server.listen(3001, () => {
    console.log('Listening on port 3001');
});
