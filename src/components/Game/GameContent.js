// GameContent.js
import React, { useEffect, useRef, useState } from 'react';
import '../../css/GameContent.css';

const BOARD_SIZE = 19;
const CELL_SIZE = 32;
const RADIUS = 14;
const BLANK = 12;

function GameContent() {
  const canvasRef = useRef(null);
  const [boardArray, setBoardArray] = useState(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0)));
  const [turn, setTurn] = useState(1); // 1 black 2 white

  useEffect(() => {
    updateBoard();
  }, [boardArray, turn]);

  const updateBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#ffcc66";
    ctx.fillRect(0, 0, BOARD_SIZE * CELL_SIZE, BOARD_SIZE * CELL_SIZE);

    ctx.strokeStyle = "#333300";
    ctx.fillStyle = "#333300";
    for (let i = 0; i < BOARD_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(BLANK + i * CELL_SIZE, BLANK);
      ctx.lineTo(BLANK + i * CELL_SIZE, BOARD_SIZE * CELL_SIZE - BLANK);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(BLANK, BLANK + i * CELL_SIZE);
      ctx.lineTo(BOARD_SIZE * CELL_SIZE - BLANK, BLANK + i * CELL_SIZE);
      ctx.stroke();
    }

    const circleRadius = 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.arc(BLANK + 3 * CELL_SIZE + i * 6 * CELL_SIZE, BLANK + 3 * CELL_SIZE + j * 6 * CELL_SIZE, circleRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (boardArray[i][j] === 1) {
          ctx.beginPath();
          ctx.strokeStyle = "#000000";
          ctx.fillStyle = "#000000";
          ctx.arc(BLANK + i * CELL_SIZE, BLANK + j * CELL_SIZE, RADIUS, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        } else if (boardArray[i][j] === 2) {
          ctx.beginPath();
          ctx.strokeStyle = "#ffffff";
          ctx.fillStyle = "#ffffff";
          ctx.arc(BLANK + i * CELL_SIZE, BLANK + j * CELL_SIZE, RADIUS, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  };

  const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  };

  const getMouseRoundPos = (xPos, yPos) => {
    const x = Math.floor((xPos - BLANK + (CELL_SIZE / 2)) / CELL_SIZE);
    const y = Math.floor((yPos - BLANK + (CELL_SIZE / 2)) / CELL_SIZE);
    return { x, y };
  };

  const drawNotClicked = (xPos, yPos) => {
    const resultPos = getMouseRoundPos(xPos, yPos);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (resultPos.x >= 0 && resultPos.x < BOARD_SIZE && resultPos.y >= 0 && resultPos.y < BOARD_SIZE && boardArray[resultPos.x][resultPos.y] === 0) {
      updateBoard();
      ctx.beginPath();
      ctx.globalAlpha = 0.8;
      if (turn < 2) {
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";
      } else {
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "#ffffff";
      }
      ctx.arc(BLANK + resultPos.x * CELL_SIZE, BLANK + resultPos.y * CELL_SIZE, RADIUS, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  };

  const isClicked = (xPos, yPos) => {
    const resultPos = getMouseRoundPos(xPos, yPos);
    if (resultPos.x >= 0 && resultPos.x < BOARD_SIZE && resultPos.y >= 0 && resultPos.y < BOARD_SIZE && boardArray[resultPos.x][resultPos.y] === 0) {
      const newBoardArray = boardArray.map(row => row.slice());
      newBoardArray[resultPos.x][resultPos.y] = turn;
      setBoardArray(newBoardArray);
      checkOmok(turn, resultPos.x, resultPos.y);
      setTurn(3 - turn);
    }
  };

  const checkOmok = (turn, xPos, yPos) => {
    if (addOmok(turn, xPos, yPos, -1, -1) + addOmok(turn, xPos, yPos, 1, 1) === 4) endGame();
    if (addOmok(turn, xPos, yPos, 0, -1) + addOmok(turn, xPos, yPos, 0, 1) === 4) endGame();
    if (addOmok(turn, xPos, yPos, 1, -1) + addOmok(turn, xPos, yPos, -1, 1) === 4) endGame();
    if (addOmok(turn, xPos, yPos, -1, 0) + addOmok(turn, xPos, yPos, 1, 0) === 4) endGame();
  };

  const endGame = () => {
    setTimeout(() => {
      alert("게임 종료");
      resetBoard();
    }, 100);
  };

  const resetBoard = () => {
    setBoardArray(Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0)));
    setTurn(1);
  };

  const addOmok = (turn, xPos, yPos, xDir, yDir) => {
    if (xPos + xDir < 0 || xPos + xDir >= BOARD_SIZE || yPos + yDir < 0 || yPos + yDir >= BOARD_SIZE) return 0;
    if (boardArray[xPos + xDir][yPos + yDir] === turn) {
      return 1 + addOmok(turn, xPos + xDir, yPos + yDir, xDir, yDir);
    } else {
      return 0;
    }
  };

  const handleMouseMove = (e) => {
    const mousePos = getMousePos(canvasRef.current, e);
    drawNotClicked(mousePos.x, mousePos.y);
  };

  const handleMouseDown = (e) => {
    const mousePos = getMousePos(canvasRef.current, e);
    isClicked(mousePos.x, mousePos.y);
  };

  return (
    <div>
      <canvas
        id="board"
        ref={canvasRef}
        width={BOARD_SIZE * CELL_SIZE}
        height={BOARD_SIZE * CELL_SIZE}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}

export default GameContent;
