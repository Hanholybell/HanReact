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

    const checkWinCondition = (board, player) => {
        const isWin = (row, col, dRow, dCol) => {
            let count = 0;
            for (let i = 0; i < 5; i++) {
                const newRow = row + i * dRow;
                const newCol = col + i * dCol;
                if (newRow < 0 || newRow >= 19 || newCol < 0 || newCol >= 19 || board[newRow][newCol] !== player) {
                    return false;
                }
                count++;
            }
            return count === 5;
        };

        for (let row = 0; row < 19; row++) {
            for (let col = 0; col < 19; col++) {
                if (board[row][col] === player) {
                    if (isWin(row, col, 1, 0) || isWin(row, col, 0, 1) || isWin(row, col, 1, 1) || isWin(row, col, 1, -1)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    useEffect(() => {
        if (!room || !room.name) return;

        socket.emit('joinRoom', { roomName: room.name, nickname });
        console.log(`Joining room: ${room.name}`);

        const handleUpdatePlayers = (nicknames) => {
            console.log('Update players:', nicknames);
            const whitePlayer = nicknames.find(nick => nick !== nickname);
            setPlayerNames({ black: nickname, white: whitePlayer || '' });
        };

        const handleOpponentMove = (move) => {
            console.log('Opponent move:', move);
            setBoard(prevBoard => {
                const newBoard = prevBoard.map(row => [...row]);
                newBoard[move.x][move.y] = move.player;
                return newBoard;
            });
            setTurn(move.player === 'black' ? 'white' : 'black');
            if (checkWinCondition(board, move.player)) {
                alert(`${move.player} 승리!`);
            }
        };

        const handleReceiveMessage = (message) => {
            console.log('Message received:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
            const messagesContainer = document.querySelector('.messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        };

        const handlePlayerLeft = () => {
            alert('The opponent has left the game.');
            onBack();
        };

        const handleRoomDeleted = () => {
            alert('The room has been deleted by the owner.');
            onBack();
        };

        socket.on('updatePlayers', handleUpdatePlayers);
        socket.on('opponentMove', handleOpponentMove);
        socket.on('msg', handleReceiveMessage);
        socket.on('playerLeft', handlePlayerLeft);
        socket.on('roomDeleted', handleRoomDeleted);

        return () => {
            socket.off('updatePlayers', handleUpdatePlayers);
            socket.off('opponentMove', handleOpponentMove);
            socket.off('msg', handleReceiveMessage);
            socket.off('playerLeft', handlePlayerLeft);
            socket.off('roomDeleted', handleRoomDeleted);
        };
    }, [room, nickname, onBack]);

    const handleCellClick = (row, col) => {
        if (board[row][col] !== null) return;

        setBoard(prevBoard => {
            const newBoard = prevBoard.map((rowArray, rowIndex) => {
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

            socket.emit('move', { roomName: room.name, move: { x: row, y: col, player: turn } });
            console.log(`Move sent: { x: ${row}, y: ${col}, player: ${turn} }`);

            if (checkWinCondition(newBoard, turn)) {
                alert(`${turn} 승리!`);
                // 승리 후 처리 로직 추가
            }

            return newBoard;
        });

        setTurn(turn === 'black' ? 'white' : 'black');
    };

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            const message = { nickname, text: inputMessage };
            setMessages([...messages, message]);
            socket.emit('sendMessage', { roomName: room.name, message });
            console.log('Message sent:', message);
            setInputMessage('');
            const messagesContainer = document.querySelector('.messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    };

    const handleDeleteRoom = () => {
        socket.emit('deleteRoom', room.name);
        console.log(`Room deleted: ${room.name}`);
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
