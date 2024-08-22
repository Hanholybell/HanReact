import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../../css/ChatModal.css';

const socket = io('http://localhost:3001');

function ChatModal({ onClose }) {
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('updateRooms', (rooms) => {
      setRooms(rooms);
    });

    return () => {
      socket.off('message');
      socket.off('updateRooms');
    };
  }, []);

  const joinRoom = (roomName) => {
    socket.emit('joinRoom', { roomName });
    setCurrentRoom(roomName);
  };

  const leaveRoom = () => {
    socket.emit('leaveRoom', { roomName: currentRoom });
    setCurrentRoom('');
    setMessages([]);
  };

  const sendMessage = () => {
    if (messageInput.trim() && currentRoom) {
      socket.emit('message', { roomName: currentRoom, message: messageInput, user: username });
      setMessageInput('');
    }
  };

  const createRoom = () => {
    if (roomName.trim()) {
      socket.emit('createRoom', { roomName });
      setRoomName('');
    }
  };

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-modal-header">
          <span>체팅</span>
          <button onClick={onClose} className="chat-modal-close-btn">X</button>
        </div>
        <div className="chat-modal-content">
          <div className="chat-rooms">
            <h3>방목록</h3>
            {rooms.map((room) => (
              <button key={room} onClick={() => joinRoom(room)}>{room}</button>
            ))}
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="New Room Name"
            />
            <button onClick={createRoom}>방만들기</button>
          </div>
          <div className="chat-room">
            {currentRoom ? (
              <>
                <h3>Room: {currentRoom}</h3>
                <div className="messages">
                  {messages.map((msg, index) => (
                    <p key={index}><strong>{msg.user}</strong>: {msg.message}</p>
                  ))}
                </div>
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message"
                />
                <button onClick={sendMessage}>보내기</button>
                <button onClick={leaveRoom}>방떠나기</button>
              </>
            ) : (
              <p>참가하실 방을 선택해주세요.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
