import React, { useState, useEffect } from 'react';
import '../../css/GameBoard.css';
import blackPlayerImage from '../../assets/blackPlayer.gif'; // 흑돌 플레이어 이미지
import whitePlayerImage from '../../assets/whitePlayer.png'; // 백돌 플레이어 이미지
import boardpixel1 from '../../assets/boardpixel1.gif';
import boardpixel2 from '../../assets/boardpixel2.gif';

const GameBoard = ({ room, onBack, nickname }) => {
    const [board, setBoard] = useState(Array(19).fill().map(() => Array(19).fill(null)));
    const [turn, setTurn] = useState('black');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleCellClick = (row, col) => {
        if (board[row][col] !== null) return;

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
        checkWin(newBoard);
    };

    const checkWin = (board) => {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];

        for (let row = 0; row < 19; row++) {
            for (let col = 0; col < 19; col++) {
                const player = board[row][col];
                if (!player) continue;

                for (let [dx, dy] of directions) {
                    let count = 1;
                    for (let step = 1; step < 5; step++) {
                        const newRow = row + dx * step;
                        const newCol = col + dy * step;
                        if (
                            newRow >= 0 && newRow < 19 &&
                            newCol >= 0 && newCol < 19 &&
                            board[newRow][newCol] === player
                        ) {
                            count++;
                        } else {
                            break;
                        }
                    }

                    if (count === 5) {
                        alert(`${player} 이겼습니다!`);
                        resetBoard();
                        return;
                    }
                }
            }
        }
    };

    const resetBoard = () => {
        setBoard(Array(19).fill().map(() => Array(19).fill(null)));
        setTurn('black');
    };

    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            setMessages([...messages, { nickname, text: inputMessage }]);
            setInputMessage('');
        }
    };

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="game-board-container">
            <div className="player-info">
                <div className="player">
                    {nickname} (흑)
                    <img src={blackPlayerImage} alt="Black Player" className="player-image" />
                </div>
                <div className="player">
                    물먹는 하마 김겨리 (백)
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
                <img src={boardpixel2} alt="board pixel" className="board-pixel2" />
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
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="메시지를 입력하세요"
                            />
                            <button onClick={handleSendMessage}>전송</button>
                        </div>
                    </div>
                    <button className="back-button" onClick={onBack}>뒤로가기</button>
                </div>
            </div>
        </div>
    );
};

export default GameBoard;
