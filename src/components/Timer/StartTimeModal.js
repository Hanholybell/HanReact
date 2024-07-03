import React, { useState } from 'react';
import '../../css/StartTimeModal.css'; // 설정 모달 CSS

const StartTimeModal = ({ onClose, onTimeSelect }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const handleTimeSelect = () => {
    const customTime = new Date();
    customTime.setHours(hours);
    customTime.setMinutes(minutes);
    onTimeSelect(customTime);
    onClose();
  };

  return (
    <div className="start-time-modal">
      <h3>출근 시간 설정</h3>
      <div className="time-inputs">
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="Hours"
          min="0"
          max="23"
          className="time-input"
        />
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Minutes"
          min="0"
          max="59"
          className="time-input"
        />
      </div>
      <div className="modal-buttons">
        <button className="modal-button" onClick={handleTimeSelect}>
          설정
        </button>
        <button className="modal-button cancel" onClick={onClose}>
          취소
        </button>
      </div>
    </div>
  );
};

export default StartTimeModal;
