import React from 'react';
import '../../css/GameRooms.css';

const GameRooms = ({ onRoomSelect, onCreateRoom }) => {
    const rooms = ['방1', '방2', '방3', '방4'];

    return (
        <div className="rooms-container">
            <h2>방 목록</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room}>
                        {room} <button onClick={() => onRoomSelect(room)}>입장</button>
                    </li>
                ))}
            </ul>
            <button onClick={onCreateRoom}>방 만들기</button>
        </div>
    );
};

export default GameRooms;
