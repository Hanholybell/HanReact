import React, { useState, useEffect } from 'react';
import '../../css/Modal.css';

function MyFavoriteModal({ onClose }) {
    const [dragging, setDragging] = useState(false);
    const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [zIndex, setZIndex] = useState(0);
    const [currentContent, setCurrentContent] = useState('file');

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging) {
                setPos((prevPos) => ({
                    x: prevPos.x + e.movementX,
                    y: prevPos.y + e.movementY
                }));
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

    const renderContent = () => {
        switch (currentContent) {
            case 'file':
                return <div>MyFavorite content here</div>;
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
                style={{ left: `${pos.x}px`, top: `${pos.y}px`, zIndex: zIndex }}
                onMouseDown={(e) => {
                    setDragging(true);
                    setZIndex(Date.now()); // 드래그 시작 시 z-index를 현재 시간으로 설정하여 최상위로 만듭니다
                    e.stopPropagation();
                }}
                onMouseUp={() => setDragging(false)}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="modal-title-bar"
                    onMouseDown={(e) => {
                        setDragging(true);
                        e.stopPropagation();
                    }}
                >
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
                    <div className="content">
                        <div className="main">
                            MyFavorite content here
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyFavoriteModal;
