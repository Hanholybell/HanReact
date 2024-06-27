// CreateRoom.js
import React, { useState } from 'react';
import '../../css/CreateRoom.css';

function CreateRoom({ onCreate, onBack }) {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');

  const handleCreate = () => {
    onCreate({ name: roomName, players: 1 });
  };

  return (
    <div className="create-room-container">
      <input
        type="text"
        placeholder="방 이름"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호 (선택)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleCreate}>방 만들기</button>
      <button onClick={onBack}>뒤로가기</button>
    </div>
  );
}

export default CreateRoom;
