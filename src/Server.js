const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createRoom', (roomName) => {
    if (!rooms[roomName]) {
      rooms[roomName] = { players: [], board: Array(19).fill().map(() => Array(19).fill(null)), turn: 'black' };
      socket.join(roomName);
      rooms[roomName].players.push(socket.id);
      io.to(socket.id).emit('roomCreated', roomName);
    }
  });

  socket.on('joinRoom', (roomName) => {
    if (rooms[roomName] && rooms[roomName].players.length < 2) {
      socket.join(roomName);
      rooms[roomName].players.push(socket.id);
      io.to(roomName).emit('playerJoined', socket.id);
    }
  });

  socket.on('move', ({ roomName, move }) => {
    if (rooms[roomName]) {
      rooms[roomName].board[move.x][move.y] = move.player;
      rooms[roomName].turn = move.player === 'black' ? 'white' : 'black';
      io.to(roomName).emit('opponentMove', move);
    }
  });

  socket.on('sendMessage', ({ roomName, message }) => {
    io.to(roomName).emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    for (const roomName in rooms) {
      const players = rooms[roomName].players;
      if (players.includes(socket.id)) {
        players.splice(players.indexOf(socket.id), 1);
        io.to(roomName).emit('playerLeft', socket.id);
        if (players.length === 0) {
          delete rooms[roomName];
        }
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => console.log('Server running on port 3001'));
