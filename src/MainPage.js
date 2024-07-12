import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './css/MainPage.css';
import MainGif from './assets/racun.gif';
import bfR from './assets/bfR.gif';
import CatGif from './assets/catcat.gif';
import pixel from './assets/pixel.gif';
import pixel1 from './assets/pixel1.gif';
import pixel3 from './assets/pixel3.gif';
import pixel4 from './assets/pixel4.gif';
import pixel5 from './assets/pixel5.gif';
import pixel6 from './assets/pixel6.gif';
import pixel7 from './assets/pixel7.gif';
import pixel8 from './assets/pixel8.gif';
import pixel9 from './assets/pixel9.gif';
import TitleBar from './components/TitleBar';
import Icon from './components/Icon';
import launcherIcon from './assets/icon.jpg';
import ChatIcon from './assets/chaticon.jpg';
import GameIcon from './assets/gameicon.jpg';
import TimerIcon from './assets/timericon.png';
import GoalIcon from './assets/goalicon.png';
import Modal from './components/Modal';

function MainPage() {
    const [activeModal, setActiveModal] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('2024-06');
    const months = ['2024-05', '2024-06', '2024-07'];

    const openModal = (modalType) => {
        setActiveModal(modalType);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
        openModal('Launcher');
    };

    return (
        <div className="main-container">
            <main className='content'>
                <Routes>
                    <Route path="/HomePage" element={<HomePage />} />
                </Routes>
                <div className="icon-bar">
                    <Icon iconImage={launcherIcon} text="Launcher" onClick={() => openModal('Launcher')} />
                    <Icon iconImage={GoalIcon} text="Goal" onClick={() => openModal('Goal')} />
                    <Icon iconImage={GameIcon} text="Game" onClick={() => openModal('Game')} />
                    <Icon iconImage={TimerIcon} text="Timer" onClick={() => openModal('Timer')} />
                    <Icon iconImage={ChatIcon} text="Chat" onClick={() => openModal('Chat')} />
                </div>
                {activeModal && (
                    <Modal
                        onClose={closeModal}
                        selectedMonth={selectedMonth}
                        activeModal={activeModal}
                        onMonthSelect={handleMonthSelect}
                    />
                )}
            </main>
            <footer className='footer'>
                <img src={MainGif} alt="Loading" className="main-racungif" />
                <img src={pixel3} alt="Loading" className="main-pixel3gif" />
                <img src={pixel4} alt="Loading" className="main-pixel4gif" />
                <img src={pixel5} alt="Loading" className="main-pixel5gif" />
                <img src={pixel7} alt="Loading" className="main-pixel7gif" />
                <img src={pixel8} alt="Loading" className="main-pixel8gif" />
            </footer>
            <TitleBar />
        </div>
    );
}

export default MainPage;
