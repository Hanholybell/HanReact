import React, { useState, useEffect } from 'react';
import '../../css/LoginModal.css';
import logo from '../../assets/loginlogo.png';

function LoginModal({ onClose, onLoginSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState(''); 
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false); 

  useEffect(() => {
    const windowWidth = 300; // 모달 창의 너비
    const windowHeight = 200; // 모달 창의 높이
    const centerX = window.innerWidth / 2 - windowWidth / 2;
    const centerY = window.innerHeight / 2 - windowHeight / 2;

    setPos({ x: centerX, y: centerY });
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

  const handleOkClick = async (e) => {
    e.preventDefault();
    if (isRegisterMode) {
      try {
        const response = await fetch('http://localhost:3001/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, nickname }), 
        });
        if (response.ok) {
          alert('Registration successful!');
          setIsRegisterMode(false); 
        } else {
          setError('Registration failed');
        }
      } catch (error) {
        setError('An error occurred during registration');
      }
    } else {
      try {
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          setError('');
          onLoginSuccess(data.nickname); 
          onClose();
        } else {
          setError('Invalid username or password');
        }
      } catch (error) {
        setError('An error occurred during login');
      }
    }
  };

  return (
    <div className="new-modal-backdrop">
      <div
        className="new-window"
        style={{ 
          left: `${pos.x}px`, 
          top: `${pos.y}px`, 
          width: '300px', // 모달의 고정된 너비
          height: '200px' // 모달의 고정된 높이
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="new-modal-title-bar">
          <div className="new-title">{isRegisterMode ? 'Register' : 'Login'}</div>
        </div>
        <div className="new-content-container">
          <img src={logo} alt="Windows Logo" />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form className="new-login-form" onSubmit={handleOkClick}>
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
            {isRegisterMode && (
              <div className="new-form-group">
                <label htmlFor="nickname">Nickname:</label>
                <input 
                  type="text" 
                  id="nickname" 
                  value={nickname} 
                  onChange={(e) => setNickname(e.target.value)} 
                  required 
                />
              </div>
            )}
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
              <button 
                  type="button" 
                  className="toggle-mode" 
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
              >
                {isRegisterMode ? 'Login' : 'Register'}
              </button>
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
