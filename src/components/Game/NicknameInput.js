// src/components/Game/NicknameInput.js
import React, { useState } from 'react';

function NicknameInput({ onJoin }) {
    const [nickname, setNickname] = useState('');

    const handleChange = (e) => {
        setNickname(e.target.value);
    };

    const handleSubmit = () => {
        if (nickname.trim()) {
            onJoin(nickname);
        } else {
            alert("닉네임을 입력하세요.");
        }
    };

    return (
        <div className="nickname-input-container">
            <input 
                type="text" 
                placeholder="닉네임을 입력하세요!" 
                value={nickname} 
                onChange={handleChange}
            />
            <button onClick={handleSubmit}>들어가기</button>
        </div>
    );
}

export default NicknameInput;
