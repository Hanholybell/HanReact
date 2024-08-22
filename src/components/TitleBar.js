import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TitleBar.css';
import MyAcountModal from '../components/StartMenu/MyAcountModal';
import MusicModal from './Dropdown/MusicModal';
import MyFavoriteModal from './Dropdown/MyFavoriteModal';
import LoginModal from './Login/LoginModal';
import startIcon from '../assets/mainStart.png';
import myAcountIcon from '../assets/myAcountIcon.png';
import musicIcon from '../assets/musicIcon.png';
import myFavoriteIcon from '../assets/myFavoriteIcon.png';
import loginIcon from '../assets/loginIcon.png';

function TitleBar() {
  const navigate = useNavigate();
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMyAcountModalOpen, setIsMyAcountModalOpen] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isMyFavoriteModalOpen, setIsMyFavoriteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInNickname, setLoggedInNickname] = useState('');  // 닉네임 상태 추가

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString('en-GB'));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (callback) => {
    callback();
    setIsMenuOpen(false);
  };

  const handleLoginSuccess = (nickname) => {  // nickname으로 변경
    setIsLoggedIn(true);
    setLoggedInNickname(nickname);  // 닉네임 저장
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInNickname('');  // 로그아웃 시 닉네임 초기화
  };

  return (
    <div className="win98-title-bar">
      <div className="win98-start-button" onClick={toggleMenu}>
        <img src={startIcon} alt="Start" className="main-start" />
      </div>
      {isLoggedIn && (
        <>
          <span className="win98-welcome-message">Welcome, {loggedInNickname}</span> {/* 닉네임 표시 */}
          <button className="win98-logout-button" onClick={handleLogout}>Logout</button>
        </>
      )}
      <div className="win98-window-controls">
        <span className="win98-time-date">{time} | {date}</span>
      </div>
      {isMenuOpen && (
        <div className="win98-dropdown-menu">
          <div className="win98-dropdown-item" onClick={() => handleMenuItemClick(() => setIsMyAcountModalOpen(true))}>
            <img src={myAcountIcon} alt="MyAcount" />
            MyAcount
          </div>
          <div className="win98-dropdown-item" onClick={() => handleMenuItemClick(() => setIsMusicModalOpen(true))}>
            <img src={musicIcon} alt="Music" />
            Music
          </div>
          <div className="win98-dropdown-item" onClick={() => handleMenuItemClick(() => setIsMyFavoriteModalOpen(true))}>
            <img src={myFavoriteIcon} alt="MyFavorite" />
            MyFavorite
          </div>
          {!isLoggedIn && (
            <div className="win98-dropdown-item" onClick={() => setIsLoginModalOpen(true)}>
              <img src={loginIcon} alt="Login" />
              Login
            </div>
          )}
        </div>
      )}
      {isMyAcountModalOpen && <MyAcountModal onClose={() => setIsMyAcountModalOpen(false)} />}
      {isMusicModalOpen && <MusicModal onClose={() => setIsMusicModalOpen(false)} />}
      {isMyFavoriteModalOpen && <MyFavoriteModal onClose={() => setIsMyFavoriteModalOpen(false)} />}
      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default TitleBar;
