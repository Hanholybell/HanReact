// GameRooms.js
import React from 'react';
import '../../css/GameRooms.css';

function GameRooms({ rooms, onJoinRoom, onCreateRoom, onBack }) {
  return (
    <div className="game-rooms-container">
      <ul>
        {rooms.map((room, index) => (
          <li key={index} onClick={() => onJoinRoom(room)}>
            {room.name} ({room.players}/2)
          </li>
        ))}
      </ul>
      <button onClick={onCreateRoom}>방 만들기</button>
      <button onClick={onBack}>뒤로가기</button>
    </div>
  );
}

export default GameRooms;
