// src/components/Game/GameModal.js
import React, { useState } from 'react';
import NicknameInput from './NicknameInput';
import GameRooms from './GameRooms';
import CreateRoom from './CreateRoom';
import GameContent from './GameContent';

function GameModal({ onClose }) {
    const [nickname, setNickname] = useState('');
    const [currentView, setCurrentView] = useState('nickname');
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleJoin = (nickname) => {
        setNickname(nickname);
        setCurrentView('rooms');
    };

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        setCurrentView('game');
    };

    const handleCreateRoom = () => {
        setCurrentView('createRoom');
    };

    const handleRoomCreate = (roomName, password) => {
        // 방 생성 로직 추가
        setCurrentView('rooms');
    };

    const handleBack = () => {
        if (currentView === 'game' || currentView === 'createRoom') {
            setCurrentView('rooms');
        } else if (currentView === 'rooms') {
            setCurrentView('nickname');
        } else {
            onClose();
        }
    };

    const renderView = () => {
        switch (currentView) {
            case 'nickname':
                return <NicknameInput onJoin={handleJoin} />;
            case 'rooms':
                return <GameRooms onRoomSelect={handleRoomSelect} onCreateRoom={handleCreateRoom} />;
            case 'createRoom':
                return <CreateRoom onCreate={handleRoomCreate} />;
            case 'game':
                return <GameContent />;
            default:
                return null;
        }
    };

    return (
        <div className="game-modal">
            <button className="back-button" onClick={handleBack}>뒤로가기</button>
            {renderView()}
        </div>
    );
}

export default GameModal;
