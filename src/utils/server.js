import { io } from 'socket.io-client';
const server = io('http://localhost:5000/')
// const server = io('http://localhost:5000', {
//   reconnection: true,
//   reconnectionAttempts: Infinity,
//   reconnectionDelay: 1000,
//   reconnectionDelayMax: 5000,
//   timeout: 20000,
// });

export default server;
