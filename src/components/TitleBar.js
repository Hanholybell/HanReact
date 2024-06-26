import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TitleBar.css';
import MyAcountModal from './Dropdown/MyAcountModal';
import MusicModal from './Dropdown/MusicModal';
import MyFavoriteModal from './Dropdown/MyFavoriteModal';
import LoginModal from './Login/LoginModal';

function TitleBar() {
  const navigate = useNavigate();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMyAcountModalOpen, setIsMyAcountModalOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isMyFavoriteModalOpen, setIsMyFavoriteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-GB'));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000); // 1분마다 시간 업데이트

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (callback) => {
    callback();
    setIsMenuOpen(false);
  };

  return (
    <div className="title-bar">
      <button className="menu-button" onClick={toggleMenu}>
        Sign in for a good time
      </button>
      <button className="login-button" onClick={() => setIsLoginModalOpen(true)}>Login</button>
      <div className="window-controls">
        <div className="button" onClick={() => navigate(-1)}><span></span></div> {/* 최소화 */}
        <div className="button"><span></span></div> {/* 최대화 */}
        <div className="button"><span></span></div> {/* 닫기 */}
        <span className="time-date">{time} | {date}</span>
      </div>
      {isMenuOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={() => handleMenuItemClick(() => setIsMyAcountModalOpen(true))}>MyAcount</div>
          <div className="dropdown-item" onClick={() => handleMenuItemClick(() => setIsMusicModalOpen(true))}>Music</div>
          <div className="dropdown-item" onClick={() => handleMenuItemClick(() => setIsMyFavoriteModalOpen(true))}>MyFavorite</div>
        </div>
      )}
      {isMyAcountModalOpen && <MyAcountModal onClose={() => setIsMyAcountModalOpen(false)} />}
      {isMusicModalOpen && <MusicModal onClose={() => setIsMusicModalOpen(false)} />}
      {isMyFavoriteModalOpen && <MyFavoriteModal onClose={() => setIsMyFavoriteModalOpen(false)} />}
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} />}
    </div>
    
  );
}

export default TitleBar;
