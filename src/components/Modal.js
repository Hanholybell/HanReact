// Modal.js
import React, { useState, useEffect } from 'react';
import '../css/Modal.css';
import BudgetManager from '../components/Budget/BudgetManager';
import ChatContent from '../components/Chat/ChatModal';
import GameContent from '../components/Game/GameContent';
import JoinGame from '../components/Game/JoinGame';
import GameRooms from '../components/Game/GameRooms';
import CreateRoom from '../components/Game/CreateRoom';

function Modal({ onClose, selectedMonth, activeModal, onMonthSelect }) {
    const [dragging, setDragging] = useState(false);
    const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentContent, setCurrentContent] = useState(activeModal);
    const [nickname, setNickname] = useState('');
    const [rooms, setRooms] = useState([
        { name: '방1', players: 1 },
        { name: '방2', players: 2 },
        { name: '방3', players: 1 },
        { name: '방4', players: 2 },
    ]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging) {
                setPos({
                    x: Math.min(window.innerWidth - 400, Math.max(0, e.clientX - startPos.x)),
                    y: Math.min(window.innerHeight - 110, Math.max(0, e.clientY - startPos.y))
                });
            }
        };

        const handleMouseUp = () => setDragging(false);

        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, startPos]);

    const handleMouseDown = (e) => {
        setDragging(true);
        setStartPos({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y
        });
        e.stopPropagation();
    };

    const handleJoinGame = (nickname) => {
        setNickname(nickname);
        setCurrentContent('rooms');
    };

    const handleJoinRoom = (room) => {
        setCurrentContent('game');
    };

    const handleCreateRoom = () => {
        setCurrentContent('createRoom');
    };

    const handleRoomCreated = (room) => {
        setRooms([...rooms, room]);
        setCurrentContent('rooms');
    };

    const handleBack = () => {
        if (currentContent === 'rooms') {
            setCurrentContent('Game');
        } else if (currentContent === 'createRoom') {
            setCurrentContent('rooms');
        } else if (currentContent === 'game') {
            setCurrentContent('rooms');
        }
    };

    const renderContent = () => {
        switch (currentContent) {
            case 'Launcher':
            case 'file':
                return <BudgetManager selectedMonth={selectedMonth} onMonthSelect={onMonthSelect} />;
            case 'Chat':
            case 'edit':
                return <ChatContent />;
            case 'Game':
                return <JoinGame onJoin={handleJoinGame} onBack={onClose} />;
            case 'rooms':
                return <GameRooms rooms={rooms} onJoinRoom={handleJoinRoom} onCreateRoom={handleCreateRoom} onBack={handleBack} />;
            case 'createRoom':
                return <CreateRoom onCreate={handleRoomCreated} onBack={handleBack} />;
            case 'game':
                return <GameContent />;
            case 'view':
                return <div>View Content</div>;
            case 'help':
                return <div>Help Content</div>;
            default:
                return <div>File Content</div>;
        }
    };

    const getTitle = () => {
        switch (currentContent) {
            case 'Launcher':
            case 'file':
                return 'Budget Manager';
            case 'Chat':
            case 'edit':
                return 'Chat';
            case 'Game':
            case 'rooms':
            case 'createRoom':
                return 'Game';
            default:
                return 'Modal';
        }
    };

    return (
        <div className="modal-backdrop" onMouseDown={() => setDragging(false)}>
            <div
                className="window"
                style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                onMouseDown={handleMouseDown}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-title-bar" onMouseDown={handleMouseDown}>
                    <span className="title">{getTitle()}</span>
                    <div className="minimize">
                        <div className="symbol"></div>
                    </div>
                    <div className="maximize">
                        <div className="symbol"></div>
                    </div>
                    <div className="close" onClick={onClose}>
                        <div className="symbol"></div>
                    </div>
                </div>
                <div className="menu-bar">
                    <span onClick={() => setCurrentContent('file')}>File</span>
                    <span onClick={() => setCurrentContent('edit')}>Edit</span>
                    <span onClick={() => setCurrentContent('view')}>View</span>
                    <span onClick={() => setCurrentContent('help')}>Help</span>
                </div>
                <div className="content-container">
                    <div className="main-content">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
