import React, { useState, useEffect } from 'react';
import '../../css/TimerModal.css'; // 타이머 모달 CSS
import endImage from '../../assets/endImage.gif'; // 타이머 종료 시 표시할 이미지
import notimergif1 from '../../assets/notimergif1.gif';
import timergif1 from '../../assets/timergif1.gif';
import timergif2 from '../../assets/timergif2.gif';
import timergif3 from '../../assets/timergif3.gif';
import timergif4 from '../../assets/timergif4.gif';
import runningImage from '../../assets/runningImage.gif'; // 타이머가 돌아갈 때 표시할 이미지
import loadingImage from '../../assets/loadingImage.gif'; // 타이머가 작동하지 않을 때 표시할 이미지
import warningImage1 from '../../assets/warningImage1.gif'; // 타이머 종료 2분 전에 표시할 이미지
import warningImage2 from '../../assets/warningImage2.gif'; // 타이머 종료 2분 전에 표시할 이미지
import warningImage3 from '../../assets/warningImage3.gif'; // 타이머 종료 2분 전에 표시할 이미지
import StartTimeModal from './StartTimeModal';

const TimerModal = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  useEffect(() => {
    const savedTimeLeft = localStorage.getItem('timeLeft');
    const savedIsStarted = localStorage.getItem('isStarted');
    const savedEndTime = localStorage.getItem('endTime');

    if (savedTimeLeft && savedIsStarted === 'true' && savedEndTime) {
      const endTime = new Date(savedEndTime);
      const currentTime = new Date();
      const remainingTime = endTime - currentTime;

      if (remainingTime > 0) {
        setTimeLeft(remainingTime);
        setEndTime(endTime);
        setIsStarted(true);
      } else {
        setTimeLeft(0);
        setIsStarted(false);
        setIsEnded(true);
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(timer);
            setIsEnded(true);
            setIsStarted(false);
            localStorage.removeItem('timeLeft');
            localStorage.removeItem('isStarted');
            localStorage.removeItem('endTime');
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  useEffect(() => {
    if (isStarted) {
      localStorage.setItem('timeLeft', timeLeft);
      localStorage.setItem('isStarted', isStarted);
      localStorage.setItem('endTime', endTime);
    }
  }, [isStarted, timeLeft, endTime]);

  const handleStartTimer = () => {
    const currentTime = new Date();
    const currentMinutes = currentTime.getMinutes();

    let endTime;
    if (currentMinutes >= 0 && currentMinutes <= 14) {
      endTime = new Date(currentTime.getTime() + 9 * 60 * 60 * 1000 + (15 - currentMinutes) * 60 * 1000);
    } else if (currentMinutes >= 15 && currentMinutes <= 29) {
      endTime = new Date(currentTime.getTime() + 9 * 60 * 60 * 1000 + (30 - currentMinutes) * 60 * 1000);
    } else if (currentMinutes >= 30 && currentMinutes <= 44) {
      endTime = new Date(currentTime.getTime() + 9 * 60 * 60 * 1000 + (45 - currentMinutes) * 60 * 1000);
    } else {
      endTime = new Date(currentTime.getTime() + 10 * 60 * 60 * 1000 - (currentMinutes - 45) * 60 * 1000);
    }

    setTimeLeft(endTime - currentTime);
    setEndTime(endTime);
    setIsStarted(true);
    setIsEnded(false);
  };

  const handleCustomStart = (customTime) => {
    const now = new Date();
    const customDate = new Date(customTime);
    const timeDifference = customDate - now;

    let endTime;
    const customMinutes = customDate.getMinutes();

    if (customMinutes >= 0 && customMinutes <= 14) {
      endTime = new Date(customDate.getTime() + 9 * 60 * 60 * 1000 + (15 - customMinutes) * 60 * 1000);
    } else if (customMinutes >= 15 && customMinutes <= 29) {
      endTime = new Date(customDate.getTime() + 9 * 60 * 60 * 1000 + (30 - customMinutes) * 60 * 1000);
    } else if (customMinutes >= 30 && customMinutes <= 44) {
      endTime = new Date(customDate.getTime() + 9 * 60 * 60 * 1000 + (45 - customMinutes) * 60 * 1000);
    } else {
      endTime = new Date(customDate.getTime() + 10 * 60 * 60 * 1000 - (customMinutes - 45) * 60 * 1000);
    }

    setTimeLeft(endTime - now);
    setEndTime(endTime);
    setIsStarted(true);
    setIsEnded(false);
  };

  const handleResetTimer = () => {
    setTimeLeft(0);
    setIsStarted(false);
    setIsEnded(false);
    setEndTime(null);
    localStorage.removeItem('timeLeft');
    localStorage.removeItem('isStarted');
    localStorage.removeItem('endTime');
  };

  const handleBackClick = () => {
    handleResetTimer();
    onClose();
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatEndTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`timer-modal-container ${isStarted ? 'started-background' : 'not-started-background'}`}>
      <h2>퇴근 타이머</h2>
      {isEnded ? (
        <>
          <img src={endImage} alt="Time's up!" className="timer-end-image" />
          <button className="timer-button back" onClick={handleBackClick}>
            뒤로 가기
          </button>
        </>
      ) : (
        <>
          <div className={`timer-display ${timeLeft <= 2 * 60 * 1000 ? 'red-text' : ''}`}>{formatTime(timeLeft)}</div>
          <div className="end-time-display">퇴근 시간: {endTime ? formatEndTime(endTime) : 'N/A'}</div>
          {isStarted ? (
            <>
              {timeLeft <= 2 * 60 * 1000 && (
                <>
                  <img src={warningImage1} alt="Warning Image 1" className="warning-image1" />
                  <img src={warningImage2} alt="Warning Image 2" className="warning-image2" />
                  <img src={warningImage3} alt="Warning Image 3" className="warning-image3" />
                </>
              )}
              <img src={runningImage} alt="Running Timer" className="running-timer-image" />
              <img src={timergif1} alt="Start" className="timer-gif1" />
              <img src={timergif2} alt="Start" className="timer-gif2" />
              <img src={timergif3} alt="Start" className="timer-gif3" />
              <img src={timergif4} alt="Start" className="timer-gif4" />
            </>
          ) : (
            <>
              <img src={notimergif1} alt="Not Running Timer" className="notimergif1" />
              <div className="timer-button-container">
                <button className="timer-button" onClick={handleStartTimer} disabled={isStarted}>
                  출근
                </button>
                <button className="timer-button" onClick={() => setIsStartModalOpen(true)} disabled={isStarted}>
                  시간 설정
                </button>
              </div>
            </>
          )}
          <button className="timer-button reset" onClick={handleResetTimer}>
            초기화
          </button>
        </>
      )}
      {isStartModalOpen && <StartTimeModal onClose={() => setIsStartModalOpen(false)} onTimeSelect={handleCustomStart} />}
    </div>
  );
};

export default TimerModal;
