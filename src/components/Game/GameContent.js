import React, { useState } from 'react';
import Login from './Login';
import GameRooms from './GameRooms';
import GameBoard from './GameBoard';

const GameContent = () => {
    const [nickname, setNickname] = useState('');
    const [room, setRoom] = useState(null);

    const handleLogin = (name) => {
        setNickname(name);
    };

    const handleRoomJoin = (room) => {
        setRoom(room);
    };

    const handleRoomLeave = () => {
        setRoom(null);
    };

    if (!nickname) {
        return <Login onLogin={handleLogin} />;
    }

    if (!room) {
        return <GameRooms onJoin={handleRoomJoin} />;
    }

    return <GameBoard nickname={nickname} room={room} onLeave={handleRoomLeave} />;
};

export default GameContent;
