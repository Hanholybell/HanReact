import React, { useState } from 'react';
import Login from './Login';
import GameRooms from './GameRooms';
import GameBoard from './GameBoard';
import CreateRoom from './CreateRoom';
import '../../css/GameModal.css';

const GameModal = ({ onClose }) => {
    const [nickname, setNickname] = useState('');
    const [currentView, setCurrentView] = useState('login');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);

    const handleLogin = (nickname) => {
        setNickname(nickname);
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

    const addRoom = (roomName, nickname) => {
        setRooms([...rooms, { roomName, players: [nickname], status: '대기중' }]);
    };

    return (
        <div className="game-modal-content">
            {currentView === 'login' && <Login onLogin={handleLogin} />}
            {currentView === 'rooms' && <GameRooms rooms={rooms} onRoomSelect={handleRoomSelect} onCreateRoom={handleCreateRoom} />}
            {currentView === 'createRoom' && <CreateRoom onBack={handleBackToRooms} onCreate={addRoom} />}
            {currentView === 'game' && <GameBoard room={selectedRoom} onBack={handleBackToRooms} nickname={nickname} />}
        </div>
    );
};

export default GameModal;
