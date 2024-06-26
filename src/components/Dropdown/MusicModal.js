import React, { useState, useEffect } from 'react';
import '../../css/MusicModal.css';
import equalizer from '../../assets/equl.gif';
import miku from '../../assets/music/miku.mp3';
import barbiegirl from '../../assets/music/barbiegirl.mp3';
import happyhappy from '../../assets/music/happyhappy.mp3';
import numanuma from '../../assets/music/numanuma.mp3';
import backIcon from '../../assets/backicon.png';
import stopIcon from '../../assets/stopicon.png';
import nextIcon from '../../assets/nexticon.png';
import playIcon from '../../assets/playicon.png';
import heartIcon from '../../assets/hearticon.png'; // 예시 아이콘
import shareIcon from '../../assets/shareicon.png'; // 예시 아이콘

function MusicModal({ onClose }) {
    const [dragging, setDragging] = useState(false);
    const [pos, setPos] = useState({ x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 200 });
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0); // 현재 재생 중인 트랙 인덱스
    const [isPlaying, setIsPlaying] = useState(true); // 재생 상태
    const [zIndex, setZIndex] = useState(0); // z-index 상태

    const tracks = [
        {
            url: miku,
            title: 'miku.mp3',
            artist: 'Artist 1',
        },
        {
            url: barbiegirl,
            title: 'barbiegirl.mp3',
            artist: 'Artist 2',
        },
        {
            url: happyhappy,
            title: 'happyhappy.mp3',
            artist: 'Artist 3',
        },
        {
            url: numanuma,
            title: 'numanuma.mp3',
            artist: 'Artist 4',
        }
    ];

    const currentTrack = tracks[currentTrackIndex];

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const playNextTrack = () => {
        setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
        setIsPlaying(true);
    };

    const playPrevTrack = () => {
        setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
        setIsPlaying(true);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dragging) {
                setPos((prevPos) => ({
                    x: prevPos.x + e.movementX,
                    y: prevPos.y + e.movementY
                }));
            }
        };

        const handleMouseUp = () => setDragging(false);

        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    return (
        <div className="music-modal-backdrop">
            <div
                className="music-modal-window"
                style={{ left: `${pos.x}px`, top: `${pos.y}px`, zIndex: zIndex }}
                onMouseDown={(e) => {
                    setDragging(true);
                    setZIndex(Date.now()); // 드래그 시작 시 z-index를 현재 시간으로 설정하여 최상위로 만듭니다
                    e.stopPropagation();
                }}
                onMouseUp={() => setDragging(false)}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="music-modal-header"
                    onMouseDown={(e) => {
                        setDragging(true);
                        e.stopPropagation();
                    }}
                >
                    <span>Poolsuite FM</span>
                    <button className="music-modal-close" onClick={onClose}>×</button>
                </div>
                <div className="music-modal-equalizer">
                    <img src={equalizer} alt="Equalizer" />
                </div>
                <div className="music-modal-channel">
                    <span>Channel: TAKTAK FM (Default)</span>
                </div>
                <div className="music-modal-track-info">
                    <span className="music-title">{currentTrack.title}</span>
                    <span className="music-artist">{currentTrack.artist}</span>
                </div>
                <audio src={currentTrack.url} controls autoPlay={isPlaying}></audio>
                <div className="music-modal-controls">
                    <button onClick={playPrevTrack} className="control-button">
                        <img src={backIcon} alt="Previous" className="icon-button" />
                    </button>
                    <button onClick={togglePlay} className="control-button">
                        <img src={isPlaying ? stopIcon : playIcon} alt="Toggle Play" className="icon-button" />
                    </button>
                    <button onClick={playNextTrack} className="control-button">
                        <img src={nextIcon} alt="Next" className="icon-button" />
                    </button>
                    <button className="control-button">
                        <img src={heartIcon} alt="Heart" className="icon-button" />
                    </button>
                    <button className="control-button">
                        <img src={shareIcon} alt="Share" className="icon-button" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MusicModal;
