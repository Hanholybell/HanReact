import React, { useState } from 'react';
import '../../css/CreateRoom.css';

const CreateRoom = ({ onBack, onCreate }) => {
    const [roomName, setRoomName] = useState('');
    const [password, setPassword] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const handleCreateRoom = () => {
        if (roomName) {
            const newRoom = {
                name: roomName,
                password: isPrivate ? password : null,
                players: 0,
                status: '대기중'
            };
            onCreate(newRoom); // 방 생성 로직 호출
            alert(`방 "${roomName}" 생성됨`);
            onBack();
        }
    };

    return (
        <div className="create-room-container">
            <h2>방 만들기</h2>
            <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="방 이름"
            />
            <div>
                <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <label>비밀번호 설정</label>
            </div>
            {isPrivate && (
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호"
                />
            )}
            <button onClick={handleCreateRoom}>만들기</button>
            <button onClick={onBack}>뒤로가기</button>
        </div>
    );
};

export default CreateRoom;
