import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../../css/GameRooms.css';

const socket = io('http://localhost:3001');

const GameRooms = ({ onRoomSelect, onCreateRoom }) => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        socket.on('roomList', (updatedRooms) => {
            setRooms(updatedRooms);
        });

        return () => {
            socket.off('roomList');
        };
    }, []);

    const handleRoomClick = (room) => {
        if (room.players.length < 2) {
            onRoomSelect(room);
        } else {
            alert('방이 꽉 찼습니다.');
        }
    };

    return (
        <div className="game-rooms-container">
            <h2>방 목록</h2>
            {rooms.length === 0 ? (
                <p>진행중인 게임이 없습니다!</p>
            ) : (
                <ul>
                    {rooms.map((room, index) => (
                        <li key={index} onClick={() => handleRoomClick(room)}>
                            <span>{room.roomName} ({room.players.length}/2)</span>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={onCreateRoom}>방 만들기</button>
        </div>
    );
};

export default GameRooms;
