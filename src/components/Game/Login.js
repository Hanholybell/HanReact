import React, { useState } from 'react';
import '../../css/Login.css';
import logingif1 from '../../assets/gamelogin1.gif';
import logingif2 from '../../assets/gamelogin2.gif'; // 새로운 GIF 파일을 임포트

const Login = ({ onLogin }) => {
    const [nickname, setNickname] = useState('');

    const handleLogin = () => {
        if (nickname) {
            onLogin(nickname);
        }
    };

    return (
        <div className="login-container">
            <img src={logingif1} alt="Loading" className="login-gif1" />
            <img
                src={logingif2} // 버튼 대신 GIF 파일 사용
                alt="Login Button"
                className="login-gif2"
                onClick={handleLogin}
                style={{ cursor: 'pointer' }} // 마우스 커서가 포인터로 변경되도록 스타일 추가
            />
            <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요!"
            />
        </div>
    );
};

export default Login;
