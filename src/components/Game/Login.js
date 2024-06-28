import React, { useState } from 'react';
import '../../css/Login.css';

const Login = ({ onLogin }) => {
    const [nickname, setNickname] = useState('');

    const handleLogin = () => {
        if (nickname) {
            onLogin(nickname);
        }
    };

    return (
        <div className="login-container">
            <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요!"
            />
            <button onClick={handleLogin}>들어가기</button>
        </div>
    );
};

export default Login;
