import React, { useState, useEffect } from 'react';
import '../../css/MyAcountModal.css';

function MyAcountModal({ onClose }) {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 }); // 초기 위치 설정
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  return (
    <div className="myacount-modal-backdrop">
      <div
        className="myacount-window"
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="myacount-modal-title-bar" onMouseDown={handleMouseDown}>
          <span className="myacount-title">시스템 등록 정보</span>
          <div className="myacount-close" onClick={onClose}>
            <div className="symbol"></div>
          </div>
        </div>
        <div className="myacount-modal-content">
          <div className="myacount-modal-section">
            <h2>시스템</h2>
            <p>Microsoft Windows 98</p>
            <p>4.10.1998</p>
          </div>
          <div className="myacount-modal-section">
            <h2>등록자</h2>
            <p>대한민국</p>
          </div>
          <div className="myacount-modal-section">
            <h2>컴퓨터</h2>
            <p>Semiconductor</p>
            <p>Pentium-II Processor</p>
            <p>Intel MMX(TM) Technology</p>
            <p>256.0MB RAM</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAcountModal;
