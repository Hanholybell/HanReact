// JoinGame.js
import React, { useState } from 'react';
import '../../css/JoinGame.css';

function JoinGame({ onJoin, onBack }) {
  const [nickname, setNickname] = useState('');

  const handleJoin = () => {
    onJoin(nickname);
  };

  return (
    <div className="join-game-container">
      <input
        type="text"
        placeholder="닉네임을 입력하세요!"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button onClick={handleJoin}>들어가기</button>
      <button onClick={onBack}>뒤로가기</button>
    </div>
  );
}

export default JoinGame;
