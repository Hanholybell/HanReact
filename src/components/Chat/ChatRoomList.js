import React, { useState } from 'react';
import '../../css/ChatRoomList.css';

function ChatRoomList({ roomList, onJoinRoom, onCreateRoom, onDeleteRoom, nickName }) {
  const [newRoomName, setNewRoomName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateRoom = () => {
    if (newRoomName.trim() === '') {
      alert('방 이름을 입력해주세요.');
      return;
    }
    if (roomList.some(room => room.roomName === newRoomName.trim())) {
      alert('이미 존재하는 방 이름입니다.');
      return;
    }
    // onCreateRoom(newRoomName.trim());
    onCreateRoom(newRoomName.trim(), nickName);
    setNewRoomName('');
    setErrorMessage('');
  };

  const handleCreateRoomClick = (e) => {
    if (e.key === 'Enter') {
      handleCreateRoom();
    }
  };

  const handleInputChange = (e) => {
    setErrorMessage('');
    setNewRoomName(e.target.value);
  }

  return (
    <div className="chat-room-list">
      <div className='chatting-name'>⭐채팅방 목록⭐</div>
      {roomList.map((room, index) => (
        <div key={index} className="room">
          <span className='roomname'>{room.roomName}</span>
          <div className='buttons'>
            <button className='join-btn' onClick={() => onJoinRoom(room.roomName)}>입장</button>
            {room.createdBy === nickName && (
              <button className='delete-btn' onClick={() => onDeleteRoom({roomName: room.roomName, requestedBy: nickName})}>삭제</button>
            )}
          </div>
        </div>
      ))}
      <div className="create-room">
        <input 
        type="text" 
        placeholder="방 이름을 적어주세요😆" 
        id="new-room-name" 
        value={newRoomName} 
        onChange={handleInputChange}
        onKeyDown={handleCreateRoomClick}
        maxLength={20}
        />
        <button onClick={handleCreateRoom}>New</button>
      </div>
      {errorMessage && <div className='error-message'>{errorMessage}</div>}
    </div>
  );
}

export default ChatRoomList;
