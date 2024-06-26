import React from 'react';
import '../css/Icon.css';


function Icon({ iconImage, text, onClick }) {
  return (
    <div className='icon-container' onClick={onClick}>
      <img src={iconImage} alt="Icon" className="icon-image"/>
      <span className='icon-text'>{text}</span>
    </div>
  );
}

export default Icon;