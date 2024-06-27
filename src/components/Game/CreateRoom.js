// src/components/Game/CreateRoom.js
import React, { useState } from 'react';

function CreateRoom({ onCreate }) {
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleCreate = () => {
        if (roomName.trim()) {
            onCreate(roomName, isPrivate ? password : null);
        } else {
            alert("방 이름을 입력하세요.");
        }
    };

    return (
        <div className="create-room-container">
            <input 
                type="text" 
                placeholder="방 이름" 
                value={roomName} 
                onChange={(e) => setRoomName(e.target.value)} 
            />
            <label>
                <input 
                    type="checkbox" 
                    checked={isPrivate} 
                    onChange={(e) => setIsPrivate(e.target.checked)} 
                />
                비밀번호 설정
            </label>
            {isPrivate && (
                <input 
                    type="password" 
                    placeholder="비밀번호" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            )}
            <button onClick={handleCreate}>만들기</button>
        </div>
    );
}

export default CreateRoom;
