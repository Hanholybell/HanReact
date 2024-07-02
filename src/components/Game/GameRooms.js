import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../css/GameRooms.css';

const GameRooms = ({ rooms, onRoomSelect, onCreateRoom }) => {
    const [passwordInput, setPasswordInput] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [modalIsOpen, setIsOpen] = useState(false);

    const handleRoomClick = (room) => {
        if (room.password) {
            setSelectedRoom(room);
            setIsOpen(true);
        } else {
            onRoomSelect(room);
        }
    };

    const handlePasswordSubmit = () => {
        if (selectedRoom.password === passwordInput) {
            onRoomSelect(selectedRoom);
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
        setPasswordInput('');
        setSelectedRoom(null);
        setIsOpen(false);
    };

    const closeModal = () => {
        setPasswordInput('');
        setSelectedRoom(null);
        setIsOpen(false);
    };

    return (
        <div className="game-rooms-container">
            <h2>방 목록</h2>
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
                            <span className="room-players">({room.players}/2)</span>
                            <span className="status">{room.status}</span>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={onCreateRoom} className="create-room-button">방 만들기</button>

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
