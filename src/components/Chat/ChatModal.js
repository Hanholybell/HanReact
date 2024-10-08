import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatLoginModal from './ChatLoginModal';
import '../../css/ChatModal.css';

const socket = io('http://localhost:3001');

function ChatModal({ onClose }) {
    const [nickname, setNickname] = useState(null);
    const [view, setView] = useState('login');
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updatePosition = () => {
            const modalWidth = 410; // 모달의 너비와 높이
            const modalHeight = 490;
            setPosition({
                x: window.innerWidth / 2 - modalWidth / 2,
                y: window.innerHeight / 2 - modalHeight / 2,
            });
        };

        updatePosition(); // 초기 위치 설정

        window.addEventListener('resize', updatePosition); // 창 크기 조절 시 재계산

        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, []);

    useEffect(() => {
        if (nickname) {
            socket.emit('requestRooms');
            socket.on('updateRooms', (updatedRooms) => {
                setRooms(updatedRooms);
            });
            socket.on('initialRooms', (initialRooms) => {
                setRooms(initialRooms);
            });
        }

        return () => {
            socket.off('updateRooms');
            socket.off('initialRooms');
        };
    }, [nickname]);

    useEffect(() => {
        if (view === 'chat') {
            socket.emit('joinRoom', { roomName: selectedRoom });

            socket.on('message', (msg) => {
                setMessages((prevMessages) => [...prevMessages, msg]);
            });

            return () => {
                socket.emit('leaveRoom', { roomName: selectedRoom });
                socket.off('message');
            };
        }
    }, [view, selectedRoom]);

    const createRoom = () => {
        const newRoom = prompt('Enter room name:');
        if (newRoom) {
            socket.emit('createRoom', { roomName: newRoom });
            setSelectedRoom(newRoom);
            setView('chat');
        }
    };

    const joinRoom = (roomName) => {
        setSelectedRoom(roomName);
        setView('chat');
    };

    const leaveRoom = () => {
        socket.emit('leaveRoom', { roomName: selectedRoom });
        setView('rooms');
    };

    const sendMessage = () => {
        if (message) {
            socket.emit('message', { roomName: selectedRoom, message, user: nickname });
            setMessage('');
        }
    };

    const handleLoginSuccess = (nickname) => {
        setNickname(nickname);
        setView('rooms');
    };

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
        <div className="chatmodal-backdrop">
            {view === 'login' ? (
                <ChatLoginModal onClose={onClose} onLoginSuccess={handleLoginSuccess} />
            ) : (
                <div
                    className="chatmodal-window"
                    style={{ top: `${position.y}px`, left: `${position.x}px`, position: 'fixed' }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div
                        className="chatmodal-title-bar"
                        onMouseDown={handleMouseDown}
                    >
                        <span className="chatmodal-title">Chat Application</span>
                        <div className="chatmodal-close" onClick={onClose}>
                            <div className="symbol"></div>
                        </div>
                    </div>
                    <div className="chatmodal-content">
                        {view === 'rooms' ? (
                            <div className="chatrooms-container">
                                <div className="chatrooms-header" style={{ fontSize: '40px', margin: '0 0 0 78px' }}>Chat Rooms</div>
                                <div className="chatrooms-room-list">
                                    <div className="chatrooms-room-list-header">활성화 방목록</div>
                                    {rooms.length === 0 ? (
                                        <div style={{
                                            color: 'red',
                                            margin: '30px 0px 30px 73px',
                                            fontSize: '20px'
                                        }}>생성 된 방이 없습니다.</div>
                                    ) : (
                                        rooms.map((roomName, index) => (
                                            <div
                                                key={index}
                                                className="chatrooms-room-item"
                                                onClick={() => joinRoom(roomName)}
                                            >
                                                {roomName}
                                            </div>
                                        ))
                                    )}
                                </div>
                                <button onClick={createRoom} className="chatrooms-create-room-button">Create Room</button>
                            </div>
                        ) : (
                            <div className="chatroom-container">
                                <div className="chatmodal-header">{selectedRoom} - Chat Room</div>
                                <div className="chatmodal-messages">
                                    {messages.map((msg, index) => (
                                        <div key={index} className="chatmodal-message-item">
                                            <strong>{msg.user}: </strong>{msg.message}
                                        </div>
                                    ))}
                                </div>
                                <div className="chatmodal-footer">
                                    <input
                                        type="text"
                                        placeholder="Message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <button onClick={sendMessage}>Send</button>
                                    <button onClick={leaveRoom}>Leave Room</button>
                                    <button onClick={onClose}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatModal;
