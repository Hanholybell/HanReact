import React, { useState, useEffect } from 'react';
import '../../css/ChatModal.css';

function ChatContent() {
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem('checklistItems');
        return savedItems ? JSON.parse(savedItems) : [];
    });
    const [newItem, setNewItem] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);

    useEffect(() => {
        localStorage.setItem('checklistItems', JSON.stringify(items));
    }, [items]);

    const handleAddItem = () => {
        if (newItem.trim() === '') return;
        setItems([...items, { text: newItem, checked: false }]);
        setNewItem('');
    };

    const handleCheckItem = (index) => {
        if (window.confirm('체크하시겠습니까?')) {
            const updatedItems = [...items];
            updatedItems[index].checked = !updatedItems[index].checked;
            setItems(updatedItems);
            alert(updatedItems[index].checked ? '완료되었습니다!' : '체크 해제되었습니다!');
        }
    };

    const handleEditItem = (index) => {
        setNewItem(items[index].text);
        setIsEditing(true);
        setCurrentEditIndex(index);
    };

    const handleUpdateItem = () => {
        if (newItem.trim() === '') return;
        const updatedItems = [...items];
        updatedItems[currentEditIndex].text = newItem;
        setItems(updatedItems);
        setNewItem('');
        setIsEditing(false);
        setCurrentEditIndex(null);
    };

    const handleDeleteItem = (index) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    return (
        <div className="checklist">
            <h3 className="checklist__title">체크리스트</h3>
            <div className="checklist__form">
                <input
                    type="text"
                    placeholder="항목 입력"
                    value={newItem}
                    className="checklist__input"
                    onChange={(e) => setNewItem(e.target.value)}
                />
                <button className="checklist__button" onClick={isEditing ? handleUpdateItem : handleAddItem}>
                    {isEditing ? '수정' : '추가'}
                </button>
            </div>
            <ul className="checklist__list">
                {items.map((item, index) => (
                    <li key={index} className="checklist__item">
                        <span className="checklist__item-text" style={{ textDecoration: item.checked ? 'line-through' : 'none' }}>
                            {item.text}
                        </span>
                        <button className="checklist__item-button" onClick={() => handleCheckItem(index)}>
                            {item.checked ? '체크 해제' : '체크'}
                        </button>
                        <button className="checklist__item-button" onClick={() => handleEditItem(index)}>수정</button>
                        <button className="checklist__item-button" onClick={() => handleDeleteItem(index)}>삭제</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatContent;
