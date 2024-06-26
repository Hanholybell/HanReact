import React, { useState, useEffect } from 'react';
import '../../css/LoginModal.css';

function LoginModal({ onClose }) {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setPos({
          x: Math.min(window.innerWidth - 400, Math.max(0, e.clientX - 400)),
          y: Math.min(window.innerHeight - 110, Math.max(0, e.clientY - 15))
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
  }, [dragging]);

  return (
    <div className="modal-backdrop">
      <div
        className="window"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        onMouseDown={(e) => {
          setDragging(true);
          e.stopPropagation();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-title-bar">
          <div className="title">네트워크 암호 입력</div>
          <div className="controls">
            <div className="control minimize"></div>
            <div className="control maximize"></div>
            <div className="control close" onClick={onClose}></div>
          </div>
        </div>
        <div className="content-container">
          <p>Microsoft 네트워크에 로그인하려면 암호를 입력하십시오.</p>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="username">사용자 이름(U):</label>
              <input type="text" id="username" value="dyurwitcherry" readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="password">암호(P):</label>
              <input type="password" id="password" />
            </div>
            <div className="buttons">
              <button type="submit">확인</button>
              <button type="button" onClick={onClose}>취소</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
