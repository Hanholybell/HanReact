import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import SaveIcon from './assets/saveicon.png';
import GameIcon from './assets/gameicon.jpg';
import TimerIcon from './assets/timericon.png';
import GoalIcon from './assets/goalicon.png';
import chatIcon from './assets/chatIcon.png';
import Modal from './components/Modal';
import ChatModal from './components/Chat/ChatModal';  // 새롭게 추가된 ChatModal import

function MainPage() {
    const [activeModal, setActiveModal] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('2024-06');
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);  // ChatModal 상태 관리 추가

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

    const openChatModal = () => {
        setIsChatModalOpen(true);  // ChatModal 열기
    };

    const closeChatModal = () => {
        setIsChatModalOpen(false);  // ChatModal 닫기
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
                    <Icon iconImage={SaveIcon} text="Save" onClick={() => openModal('Save')} />
                    <Icon iconImage={chatIcon} text="Chat" onClick={openChatModal} />  {/* Chat Icon에 ChatModal 연결 */}
                </div>
                {activeModal && (
                    <Modal
                        onClose={closeModal}
                        selectedMonth={selectedMonth}
                        activeModal={activeModal}
                        onMonthSelect={handleMonthSelect}
                    />
                )}
                {isChatModalOpen && (  // ChatModal을 보여주기 위한 조건문
                    <ChatModal
                        onClose={closeChatModal}
                        nickname="YourNickname"  // 실제 로그인된 유저의 닉네임을 여기 전달해야 함
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
