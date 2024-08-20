import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import io from 'socket.io-client';
import '../../css/GameRooms.css';

const socket = io('http://localhost:3001');

const GameRooms = ({ onRoomSelect, nickname }) => {
    const [rooms, setRooms] = useState([]);
    const [passwordInput, setPasswordInput] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [fullRoomError, setFullRoomError] = useState('');
    const [newRoomName, setNewRoomName] = useState('');
    const [newRoomPassword, setNewRoomPassword] = useState('');

    useEffect(() => {
        const handleRoomList = (updatedRooms) => {
            setRooms(updatedRooms);
            console.log('Updated rooms:', updatedRooms);
        };

        socket.on('roomList', handleRoomList);
        socket.emit('getRoomList');

        const handleRoomFull = (roomName) => {
            setFullRoomError(`방 ${roomName} 이 가득 찼습니다.`);
            setTimeout(() => setFullRoomError(''), 3000);
        };

        const handleRoomExists = (roomName) => {
            alert(`방 ${roomName} 이 이미 존재합니다.`);
        };

        socket.on('roomFull', handleRoomFull);
        socket.on('roomExists', handleRoomExists);

        return () => {
            socket.off('roomList', handleRoomList);
            socket.off('roomFull', handleRoomFull);
            socket.off('roomExists', handleRoomExists);
        };
    }, []);

    const handleRoomClick = (room) => {
        if (room.password) {
            setSelectedRoom(room);
            setIsOpen(true);
        } else {
            socket.emit('joinRoom', { roomName: room.name, nickname, password: '' }, (success, roomData, message) => {
                if (success) {
                    onRoomSelect(roomData);
                } else {
                    alert(message || '비밀번호가 틀렸습니다.');
                }
            });
        }
    };

    const handlePasswordSubmit = () => {
        socket.emit('joinRoom', { roomName: selectedRoom.name, nickname, password: passwordInput }, (success, roomData, message) => {
            if (success) {
                onRoomSelect(roomData);
            } else {
                alert(message || '비밀번호가 틀렸습니다.');
            }
            setPasswordInput('');
            setSelectedRoom(null);
            setIsOpen(false);
        });
    };

    const closeModal = () => {
        setPasswordInput('');
        setSelectedRoom(null);
        setIsOpen(false);
    };

    const handleCreateRoom = () => {
        if (newRoomName.trim() !== '') {
            socket.emit('createRoom', newRoomName, newRoomPassword, (success, roomData) => {
                if (success) {
                    onRoomSelect(roomData);
                }
            });
            setNewRoomName('');
            setNewRoomPassword('');
        }
    };

    return (
        <div className="game-rooms-container">
            <h2>방 목록</h2>
            {fullRoomError && <div className="error-message">{fullRoomError}</div>}
            {rooms.length === 0 ? (
                <p>진행중인 게임이 없습니다!</p>
            ) : (
                <ul>
                    {rooms.map((room, index) => (
                        <li
                            key={index}
                            className={`game-room-item ${room.status === '대기중' ? 'waiting' : 'playing'} ${room.password ? 'locked' : ''}`}
                            onClick={() => handleRoomClick(room)}
                        >
                            <span className="room-name">{room.name} {room.password && <span role="img" aria-label="lock" className="lock-icon">🔒</span>}</span>
                            <span className="room-players">({room.players.length})</span>
                            <span className="status">{room.status}</span>
                        </li>
                    ))}
                </ul>
            )}
            <div className="create-room-container">
                <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="방 이름을 입력하세요"
                    className="create-room-input"
                />
                <input
                    type="password"
                    value={newRoomPassword}
                    onChange={(e) => setNewRoomPassword(e.target.value)}
                    placeholder="비밀번호 (선택사항)"
                    className="create-room-input"
                />
                <button onClick={handleCreateRoom} className="create-room-button">방 만들기</button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Password Modal"
                className="password-modal"
                overlayClassName="password-overlay"
            >
                <h3>비밀번호 입력</h3>
                <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="비밀번호"
                />
                <div>
                    <button onClick={handlePasswordSubmit} className="password-modal-button">확인</button>
                    <button onClick={closeModal} className="password-modal-button">취소</button>
                </div>
            </Modal>
        </div>
    );
};

export default GameRooms;
