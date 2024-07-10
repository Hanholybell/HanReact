import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../../css/GameRoom.css';

const socket = io('http://localhost:3001');

const GameRoom = ({ roomName, nickname, onLeaveRoom }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [board, setBoard] = useState(Array(19).fill(Array(19).fill(null)));
    const [currentTurn, setCurrentTurn] = useState('흑');
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.emit('joinRoom', { roomName, nickname });

        socket.on('message', (message) => {
            setMessages((messages) => [...messages, message]);
        });

        socket.on('boardUpdate', (newBoard) => {
            setBoard(newBoard);
        });

        socket.on('playerUpdate', (players) => {
            setPlayers(players);
        });

        return () => {
            socket.emit('leaveRoom', { roomName, nickname });
            socket.off('message');
            socket.off('boardUpdate');
            socket.off('playerUpdate');
        };
    }, [roomName, nickname]);

    const handleSendMessage = () => {
        socket.emit('sendMessage', { roomName, nickname, message });
        setMessage('');
    };

    const handleMakeMove = (rowIndex, cellIndex) => {
        socket.emit('makeMove', { roomName, rowIndex, cellIndex, player: currentTurn });
    };

    return (
        <div className="game-room">
            <h2>{roomName}</h2>
            <div className="players">
                {players.map((player, index) => (
                    <div key={index} className={`player ${player === nickname ? 'self' : ''}`}>
                        {player}
                    </div>
                ))}
            </div>
            <div className="chat">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.nickname}</strong>: {msg.text}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                />
                <button onClick={handleSendMessage}>전송</button>
            </div>
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, cellIndex) => (
                            <button
                                key={cellIndex}
                                className="cell"
                                onClick={() => handleMakeMove(rowIndex, cellIndex)}
                            >
                                {cell}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            <button onClick={onLeaveRoom} className="leave-room-button">뒤로가기</button>
        </div>
    );
};

export default GameRoom;
