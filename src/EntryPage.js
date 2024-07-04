import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/EntryPage.css';
import loadingGif from './assets/happycat.gif';
import backgroundMusic from './assets/happyBgm.mp3';
import logo from './assets/rogo.gif';
import entimg1 from './assets/entimg1.png';
import entimg2 from './assets/entimg2.png';
import entimg3 from './assets/entimg3.png';
import mirrorball from './assets/mirrorball.gif';
import dancer from './assets/dancer.gif';
import dancer2 from './assets/dancer2.gif';
import light1 from './assets/light1.gif';
import light2 from './assets/light2.gif';
import light3 from './assets/light3.gif';
import entgif from './assets/entgif.gif';
import entgif1 from './assets/entgif1.gif';


function EntryPage() {
  const navigate = useNavigate();
  return (
    <div className='container'>
        <img src={logo} alt="Loading" className="ent-logo" />
        <img src={loadingGif} alt="Loading" className="ent-gif" />
        <img src={mirrorball} alt="Loading" className="ent-mirrorball" />
        <img src={dancer} alt="Loading" className="ent-dancer" />
        <img src={dancer2} alt="Loading" className="ent-dancer2" />
        <img src={light1} alt="Loading" className="ent-light1" />
        <img src={light2} alt="Loading" className="ent-light2" />
        <img src={light3} alt="Loading" className="ent-light3" />
        <img src={entgif1} alt="Loading" className="ent-gif2" />
            <span id='entrybox'>
                <button className = "entrybutton" onClick={() => navigate('/main')}>진입하기</button>
            </span>
            <audio src={backgroundMusic} autoPlay loop />
        <img src={entimg3} alt="entry" className="ent-img3" />
        <img src={entimg2} alt="entry" className="ent-img2" />
    </div>
  );
}

export default EntryPage;