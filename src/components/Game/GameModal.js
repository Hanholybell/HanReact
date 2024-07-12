import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './Login';
import GameRooms from './GameRooms';
import CreateRoom from './CreateRoom';
import GameBoard from './GameBoard';
import '../../css/GameModal.css';

const socket = io('http://localhost:3001');

const GameModal = ({ onClose }) => {
    const [nickname, setNickname] = useState('');
    const [currentView, setCurrentView] = useState('login');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const handleRoomList = (updatedRooms) => {
            setRooms(updatedRooms);
            console.log('Updated rooms: ', updatedRooms);
        };

        socket.on('roomList', handleRoomList);
        socket.emit('getRoomList');

        return () => {
            socket.off('roomList', handleRoomList);
        };
    }, []); // 빈 배열을 의존성 배열로 사용하여 처음 한 번만 실행되도록 함

    const handleLogin = (nickname) => {
        setNickname(nickname);
        socket.emit('setNickname', nickname);  // 닉네임 설정
        setCurrentView('rooms');
    };

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        setCurrentView('game');
    };

    const handleBackToRooms = () => {
        setCurrentView('rooms');
    };

    const handleCreateRoom = () => {
        setCurrentView('createRoom');
    };

    const addRoom = (newRoom) => {
        socket.emit('createRoom', newRoom.name, newRoom.password);
    };

    return (
        <div className="game-modal-content">
            {currentView === 'login' && <Login onLogin={handleLogin} />}
            {currentView === 'rooms' && <GameRooms onRoomSelect={handleRoomSelect} nickname={nickname} />}
            {currentView === 'createRoom' && <CreateRoom onBack={handleBackToRooms} onCreate={addRoom} />}
            {currentView === 'game' && <GameBoard room={selectedRoom} onBack={handleBackToRooms} nickname={nickname} />}
        </div>
    );
};

export default GameModal;
