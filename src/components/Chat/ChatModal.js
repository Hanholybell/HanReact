import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../../css/ChatModal.css';

const socket = io('http://localhost:3001');

function ChatModal({ onClose, nickname }) {
    const [view, setView] = useState('rooms');
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.emit('requestRooms'); // 서버에 방 목록 요청
        socket.on('updateRooms', (updatedRooms) => {
            setRooms(updatedRooms);
        });
        socket.on('initialRooms', (initialRooms) => {
            setRooms(initialRooms);
        });

        return () => {
            socket.off('updateRooms');
            socket.off('initialRooms');
        };
    }, []);

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
        setMessages([]); // 메시지 초기화
        setView('rooms');
    };

    const sendMessage = () => {
        if (message) {
            socket.emit('message', { roomName: selectedRoom, message, user: nickname });
            setMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();  // 기본 엔터 키 동작(줄 바꿈) 방지
            sendMessage();
        }
    };

    return (
        <div className="chatmodal-container">
            {view === 'rooms' ? (
                <div className="chatrooms-container">
                    <div className="chatrooms-header">Chat Rooms</div>
                    <div className="chatrooms-room-list">
                        <div className="chatrooms-room-list-header">Available Rooms:</div>
                        {rooms.length === 0 ? (
                            <div>No rooms available</div>
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
                <div className="chatmodal-container">
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
                            onKeyPress={handleKeyPress}  // 엔터 키를 눌렀을 때 메시지 전송
                        />
                        <button onClick={sendMessage}>Send</button>
                        <button onClick={leaveRoom}>Leave Room</button>
                        <button onClick={onClose}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatModal;
