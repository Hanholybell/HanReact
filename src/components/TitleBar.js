import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/TitleBar.css';
import MyAcountModal from './Dropdown/MyAcountModal';
import MusicModal from './Dropdown/MusicModal';
import MyFavoriteModal from './Dropdown/MyFavoriteModal';
import LoginModal from './Login/LoginModal';
import startIcon from '../assets/mainStart.png'; // 경로를 맞춰서 수정

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
  const [loggedInUser, setLoggedInUser] = useState(''); 

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

  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true);
    setLoggedInUser(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser('');
  };

  return (
    <div className="win98-title-bar">
      <div className="win98-start-button" onClick={toggleMenu}>
        <img src={startIcon} alt="Start" className="main-start" />
      </div>
      {isLoggedIn && (
        <>
          <span className="win98-welcome-message">Welcome, {loggedInUser}</span>
          <button className="win98-logout-button" onClick={handleLogout}>Logout</button>
        </>
      )}
      <div className="win98-window-controls">
        <span className="win98-time-date">{time} | {date}</span>
      </div>
      {isMenuOpen && (
        <div className="win98-dropdown-menu">
          <div className="win98-dropdown-item" onClick={() => handleMenuItemClick(() => setIsMyAcountModalOpen(true))}>
            <img src="../assets/myAcountIcon.png" alt="MyAcount" />
            MyAcount
          </div>
          <div className="win98-dropdown-item" onClick={() => handleMenuItemClick(() => setIsMusicModalOpen(true))}>
            <img src="../assets/musicIcon.png" alt="Music" />
            Music
          </div>
          <div className="win98-dropdown-item" onClick={() => handleMenuItemClick(() => setIsMyFavoriteModalOpen(true))}>
            <img src="../assets/myFavoriteIcon.png" alt="MyFavorite" />
            MyFavorite
          </div>
          {!isLoggedIn && (
            <div className="win98-dropdown-item" onClick={() => setIsLoginModalOpen(true)}>
              <img src="../assets/loginIcon.png" alt="Login" />
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
