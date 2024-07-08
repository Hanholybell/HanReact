import React, { useState, useEffect } from 'react';
import '../../css/ChatModal.css';
import chatpixel1 from '../../assets/chatpixel1.gif';
import chatpixel2 from '../../assets/chatpixel2.gif';
import chatpixel3 from '../../assets/chatpixel3.gif';
import chatpixel4 from '../../assets/chatpixel4.gif';
import chatpixel5 from '../../assets/chatpixel5.gif';

const initialItems = [
  {
    name: '송탁군',
    gif: chatpixel1,
    goal: '5kg 감량',
    progress: 30,
    currentStatus: '본인 몸무게 아직 모름',
  },
  {
    name: '겨리쿤',
    gif: chatpixel2,
    goal: '5kg 감량',
    progress: 60,
    currentStatus: '도전 전에 2kg로 뺐지만 안 쳐줄꺼임 ㅋㅋ',
  },
  {
    name: '은디',
    gif: chatpixel3,
    goal: '몸무게 유지하기',
    progress: 100,
    currentStatus: '가장 부러운 1인...',
  },
  {
    name: '빵 못먹어서 짜증 이빠이 수현 누나',
    gif: chatpixel4,
    goal: '빵 금지 ㅋㅋ',
    progress: 20,
    currentStatus: '빵만 보면 어찌할 바를 모름',
  },
  {
    name: '음료 금지 혜정띠',
    gif: chatpixel5,
    goal: '음료 금지 ㅋㅋ',
    progress: 20,
    currentStatus: '이건 먹어도 되지 않아? 시전중',
  },
];

function ChatModal() {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('characterItems');
    return savedItems ? JSON.parse(savedItems) : initialItems;
  });
  const [newItem, setNewItem] = useState({ name: '', gif: '', goal: '', progress: 0, currentStatus: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('characterItems', JSON.stringify(items));
  }, [items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddItem = () => {
    setItems([...items, newItem]);
    setNewItem({ name: '', gif: '', goal: '', progress: 0, currentStatus: '' });
  };

  const handleEditItem = (index) => {
    setNewItem(items[index]);
    setIsEditing(true);
    setCurrentEditIndex(index);
  };

  const handleUpdateItem = () => {
    const updatedItems = [...items];
    updatedItems[currentEditIndex] = newItem;
    setItems(updatedItems);
    setNewItem({ name: '', gif: '', goal: '', progress: 0, currentStatus: '' });
    setIsEditing(false);
    setCurrentEditIndex(null);
  };

  const handleDeleteItem = (index) => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    }
  };

  const handleReset = () => {
    if (window.confirm('정말로 초기화하시겠습니까?')) {
      setItems(initialItems);
      localStorage.removeItem('characterItems');
    }
  };

  return (
    <div className="chat-content">
      <div className="character-list">
        {items.map((item, index) => (
          <div key={index} className="character-card">
            <img src={item.gif} alt={item.name} className="character-gif" />
            <div className="character-info">
              <h3>{item.name}</h3>
              <p><span className='goal-font'>목표: </span>{item.goal}</p>
              <p className="current-status"><span className='status-font'>현재상황:</span> {item.currentStatus}</p>
              <div className="progress-bar">
                <span className="progress-label">달성도: {item.progress}%</span>
                <div className="progress" style={{ width: `${item.progress}%` }}></div>
              </div>
              <div className="button-group">
                <button className="character-card-button" onClick={() => handleEditItem(index)}>수정</button>
                <button className="character-card-button" onClick={() => handleDeleteItem(index)}>삭제</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="character-form">
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={newItem.name}
          onChange={handleInputChange}
          className="character-form-input"
        />
        <input
          type="text"
          name="goal"
          placeholder="목표"
          value={newItem.goal}
          onChange={handleInputChange}
          className="character-form-input"
        />
        <input
          type="text"
          name="currentStatus"
          placeholder="현재 상황"
          value={newItem.currentStatus}
          onChange={handleInputChange}
          className="character-form-input"
        />
        <input
          type="number"
          name="progress"
          placeholder="진행 상황 (%)"
          value={newItem.progress}
          onChange={handleInputChange}
          className="character-form-input"
        />
        <button className="character-form-button" onClick={isEditing ? handleUpdateItem : handleAddItem}>
          {isEditing ? '수정' : '추가'}
        </button>
        <button className="character-form-button reset-button" onClick={handleReset}>
          초기화
        </button>
      </div>
    </div>
  );
}

export default ChatModal;
