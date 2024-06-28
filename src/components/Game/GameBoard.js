import React, { useState } from 'react';
import '../../css/GameBoard.css';

const GameBoard = ({ room, onBack }) => {
    const [board, setBoard] = useState(Array(19).fill().map(() => Array(19).fill(null)));
    const [turn, setTurn] = useState('black');

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

    return (
        <div className="game-board-page">
            <button onClick={onBack}>뒤로가기</button>
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
        </div>
    );
};

export default GameBoard;
