import React, { useState, useEffect } from 'react';
import '../../css/Modal.css';

function MyAcountModal({ onClose }) {
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentContent, setCurrentContent] = useState('file'); // 초기값을 'file'로 설정

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        setPos({
          x: Math.min(window.innerWidth - 400, Math.max(0, e.clientX - startPos.x)),
          y: Math.min(window.innerHeight - 110, Math.max(0, e.clientY - startPos.y))
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
  }, [dragging, startPos]);

  const handleMouseDown = (e) => {
    setDragging(true);
    setStartPos({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
    e.stopPropagation();
  };

  const renderContent = () => {
    switch (currentContent) {
      case 'file':
        return <div>MyAcount content here</div>;
      case 'edit':
        return <div>Edit Content</div>;
      case 'view':
        return <div>View Content</div>;
      case 'help':
        return <div>Help Content</div>;
      default:
        return <div>File Content</div>;
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="window"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
        onMouseDown={handleMouseDown}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-title-bar">
          <span className="title">MyAcount</span>
          <div className="minimize">
            <div className="symbol"></div>
          </div>
          <div className="maximize">
            <div className="symbol"></div>
          </div>
          <div className="close" onClick={onClose}>
            <div className="symbol"></div>
          </div>
        </div>
        <div className="menu-bar">
          <span onClick={() => setCurrentContent('file')}>File</span>
          <span onClick={() => setCurrentContent('edit')}>Edit</span>
          <span onClick={() => setCurrentContent('view')}>View</span>
          <span onClick={() => setCurrentContent('help')}>Help</span>
        </div>
        <div className="content-container">
          <div className="main-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAcountModal;
