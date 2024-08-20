const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let rooms = {};

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('createRoom', (data, callback) => {
        const { roomName, createdBy, password } = data;
        if (!rooms[roomName]) {
            rooms[roomName] = { roomName, createdBy, password, players: [], status: '대기중' };
            io.emit('roomList', Object.values(rooms));
            if (typeof callback === 'function') callback(true, rooms[roomName]);
        } else {
            if (typeof callback === 'function') callback(false, null);
        }
    });

    socket.on('joinRoom', (data, callback) => {
        const { roomName, nickname, password } = data;
        const room = rooms[roomName];
        if (room) {
            if (room.password && room.password !== password) {
                if (typeof callback === 'function') callback(false, null, '비밀번호가 틀렸습니다.');
            } else {
                room.players.push(nickname);
                socket.join(roomName);
                io.to(roomName).emit('playerJoined', nickname);
                io.emit('roomList', Object.values(rooms));
                if (typeof callback === 'function') callback(true, room);
            }
        } else {
            if (typeof callback === 'function') callback(false, null, '방이 존재하지 않습니다.');
        }
    });

    socket.on('sendMessage', ({ roomName, nickName, msg }) => {
        console.log(`Message from ${nickName} in room ${roomName}: ${msg}`);
        const message = { level: 'other', nickName, msg };
        io.to(roomName).emit('msg', message);
    });

    socket.on('move', ({ roomName, move }) => {
        io.to(roomName).emit('opponentMove', move);
    });

    socket.on('deleteRoom', ({ roomName, requestedBy }) => {
        if (rooms[roomName] && rooms[roomName].createdBy === requestedBy) {
            delete rooms[roomName];
            io.emit('roomList', Object.values(rooms));
            io.to(roomName).emit('roomDeleted', { msg: "방이 삭제되었습니다." });
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        for (let roomName in rooms) {
            const room = rooms[roomName];
            room.players = room.players.filter(player => player !== socket.id);
            if (room.players.length === 0) {
                delete rooms[roomName];
            }
            io.emit('roomList', Object.values(rooms));
        }
    });
});

server.listen(3001, () => {
    console.log('Listening on port 3001');
});
