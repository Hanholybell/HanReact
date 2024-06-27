// src/components/Game/GameRooms.js
import React from 'react';

function GameRooms({ onRoomSelect, onCreateRoom }) {
    const rooms = [
        { id: 1, name: '방1', status: '대기중', players: '1/2' },
        { id: 2, name: '방2', status: '게임중', players: '2/2' },
        { id: 3, name: '방3', status: '대기중', players: '1/2', isLocked: true },
        { id: 4, name: '방4', status: '게임중', players: '2/2' },
    ];

    return (
        <div className="game-rooms-container">
            <h2>방 목록</h2>
            <ul>
                {rooms.map(room => (
                    <li key={room.id} onClick={() => onRoomSelect(room)}>
                        {room.name} ({room.players}) - {room.status}
                    </li>
                ))}
            </ul>
            <button onClick={onCreateRoom}>방 만들기</button>
        </div>
    );
}

export default GameRooms;
