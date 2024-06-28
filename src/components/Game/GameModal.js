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

    return (
        <div className="game-modal-content">
            {currentView === 'login' && <Login onLogin={handleLogin} />}
            {currentView === 'rooms' && <GameRooms onRoomSelect={handleRoomSelect} onCreateRoom={handleCreateRoom} />}
            {currentView === 'createRoom' && <CreateRoom onBack={handleBackToRooms} />}
            {currentView === 'game' && <GameBoard room={selectedRoom} onBack={handleBackToRooms} />}
        </div>
    );
};

export default GameModal;
