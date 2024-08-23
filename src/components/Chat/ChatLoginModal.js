import React, { useState, useEffect } from 'react';
import '../../css/ChatLoginModal.css';
import logo from '../../assets/chatloginlogo.png';

function ChatLoginModal({ onClose, onLoginSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 }); // 초기 위치 설정
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

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
          onLoginSuccess(data.nickname);
        } else {
          setError('Invalid username or password');
        }
      } catch (error) {
        setError('An error occurred during login');
      }
    }
  };

  return (
    <div className="chatlogin-modal-backdrop">
      <div
        className="chatlogin-window"
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="chatlogin-modal-title-bar" onMouseDown={handleMouseDown}>
          <span className="chatlogin-title">{isRegisterMode ? 'Register' : 'Login'}</span>
          <div className="chatlogin-close" onClick={onClose}>
            <div className="symbol"></div>
          </div>
        </div>
        <div className="chatlogin-content-container">
          <img src={logo} alt="Windows Logo" style={{ width: '100%', margin:'15px 0 15px 0'}} />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form className="chatlogin-form" onSubmit={handleOkClick} style={{ width: '270', height: '145', margin: '15px 0 0 50px'}}>
            <div className="chatlogin-form-group">
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
              <div className="chatlogin-form-group">
                <label htmlFor="nickname" style={{ margin: '0 0 0 7px' }}>Nickname:</label>
                <input 
                  type="text" 
                  id="nickname" 
                  value={nickname} 
                  onChange={(e) => setNickname(e.target.value)} 
                  required 
                />
              </div>
            )}
            <div className="chatlogin-form-group">
              <label htmlFor="password" style={{ margin: '0 0 0 7px' }}>Password:</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="new-buttons" style={{ margin: '0 0 0 -54px' }}>
              <button 
                  type="button" 
                  className="chatlogin-toggle-mode" 
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
              >
                {isRegisterMode ? 'Login' : 'Register'}
              </button>
              <button type="submit">OK</button>
              <button type="button" className="chatlogin-cancel" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatLoginModal;
