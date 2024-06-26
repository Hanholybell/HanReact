import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="window">
      <div className="title-bar">
        <div className="minimize">
          <div className="symbol"></div>
        </div>
        <div className="maximize">
          <div className="symbol"></div>
        </div>
        <div className="close" onClick={() => navigate(-1)}>
          <div className="symbol">
          </div>
        </div>
      </div>
      <div className="menu-bar"><span>File</span><span>Edit</span><span>View</span><span>Help</span></div>
      <div className="content-container">
        <div className="content">
          <div className="main"></div>
          <div className="scroll">
            <div className="start"></div>
            <div className="progress"></div>
            <div className="end"></div>
          </div>
        </div>
        <div className="scroll -row">
          <div className="start"></div>
          <div className="progress"></div>
          <div className="end"></div>
        </div>
      </div>
      <div className="footer"></div>
    </div>
);
}

export default HomePage;