import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../../css/GameBoard.css';
import blackPlayerImage from '../../assets/blackPlayer.gif';
import whitePlayerImage from '../../assets/whitePlayer.png';

const socket = io('http://localhost:3001');

const GameBoard = ({ room, onBack, nickname }) => {
    const [board, setBoard] = useState(Array(19).fill().map(() => Array(19).fill(null)));
    const [turn, setTurn] = useState('black');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [playerNames, setPlayerNames] = useState({ black: '', white: '' });

    useEffect(() => {
        if (!room || !room.name) return;

        socket.emit('joinRoom', { roomName: room.name, nickname });

        socket.on('updatePlayers', (nicknames) => {
            const whitePlayer = nicknames.find(nick => nick !== nickname);
            setPlayerNames({ black: nickname, white: whitePlayer || '' });
        });

        socket.on('opponentMove', (move) => {
            const newBoard = [...board];
            newBoard[move.x][move.y] = move.player;
            setBoard(newBoard);
            setTurn(move.player === 'black' ? 'white' : 'black');
        });

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('playerLeft', () => {
            alert('The opponent has left the game.');
            onBack();
        });

        socket.on('roomDeleted', () => {
            alert('The room has been deleted by the owner.');
            onBack();
        });

        return () => {
            socket.off('updatePlayers');
            socket.off('opponentMove');
            socket.off('receiveMessage');
            socket.off('playerLeft');
            socket.off('roomDeleted');
        };
    }, [room, board, nickname, onBack]);

    const handleCellClick = (row, col) => {
        if (!room || board[row][col] !== null) return;

        const newBoard = board.map((rowArray, rowIndex) => {
            if (rowIndex === row) {
                return rowArray.map((cell, colIndex) => {
                    if (colIndex === col) {
                        return turn;
                    }
                    return cell;
                });
            }
            return rowArray;
        });

        setBoard(newBoard);
        setTurn(turn === 'black' ? 'white' : 'black');
        socket.emit('move', { roomName: room.name, move: { x: row, y: col, player: turn } });
    };

    const handleSendMessage = () => {
        if (!room || !room.name || inputMessage.trim() === '') return;

        const message = { nickname, text: inputMessage };
        setMessages([...messages, message]);
        socket.emit('sendMessage', { roomName: room.name, message });
        setInputMessage('');
    };

    const handleDeleteRoom = () => {
        if (!room || !room.name) return;

        socket.emit('deleteRoom', room.name);
        onBack();
    };

    return (
        <div className="game-board-container">
            <div className="player-info">
                <div className="player">
                    {playerNames.black} (흑)
                    <img src={blackPlayerImage} alt="Black Player" className="player-image" />
                </div>
                <div className="player">
                    {playerNames.white} (백)
                    <img src={whitePlayerImage} alt="White Player" className="player-image" />
                </div>
            </div>
            <div className="board-chat-container">
                <div className="board">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="row">
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={`cell ${cell}`}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                >
                                    {cell && <div className={`stone ${cell}`} />}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="chat-container">
                    <div className="chat">
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.nickname}`}>
                                    <strong>{msg.nickname}:</strong> {msg.text}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                                placeholder="메시지를 입력하세요"
                            />
                            <button onClick={handleSendMessage}>전송</button>
                        </div>
                    </div>
                    {room && room.owner === socket.id && (
                        <button className="delete-room-button" onClick={handleDeleteRoom}>방 삭제</button>
                    )}
                    <button className="back-button" onClick={onBack}>뒤로가기</button>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
