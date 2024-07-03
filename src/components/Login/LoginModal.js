import React, { useState, useEffect } from 'react';
import '../../css/LoginModal.css';
import logo from '../../assets/loginlogo.png'; // 로고 이미지 경로 설정

function LoginModal({ onClose, onLoginSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 100 });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // 모달이 열릴 때 화면 중앙에 위치하도록 설정
  useEffect(() => {
    setPos({
      x: window.innerWidth / 2 - 150,
      y: window.innerHeight / 2 - 100
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setPos({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        });
      }
    };

    const handleMouseUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'hst15' && password === '123123') {
      setError('');
      onLoginSuccess(username);
      onClose();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="new-modal-backdrop">
      <div
        className="new-window"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="new-modal-title-bar">
          <div className="new-title">Enter Password</div>
        </div>
        <div className="new-content-container">
          <img src={logo} alt="Windows Logo" />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form className="new-login-form" onSubmit={handleLogin}>
            <div className="new-form-group">
              <label htmlFor="username">User Name:</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="new-form-group">
              <label htmlFor="password">Password:</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="new-buttons">
              <button type="submit">OK</button>
              <button type="button" className="cancel" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
