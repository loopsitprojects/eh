import React from 'react';
import handStickEn from '../assets/hand-stick.png';
import handStickSi from '../assets/hand-stick-si.png';
import handStickTa from '../assets/hand-stick-ta.png';
import popsiclePink from '../assets/popsicle-pink.png';
import popsicleYellow from '../assets/popsicle-yellow.png';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onOpenModal }) {
  const { language, t } = useLanguage();

  const getHandStickImage = () => {
    if (language === 'si') return handStickSi;
    if (language === 'ta') return handStickTa;
    return handStickEn;
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        
        {/* Left Column: Headlines, Copy & CTA */}
        <div className="hero-content">
          <div className="hero-headline-wrapper">
            <h1 className="hero-title">
              <span className="title-row-lime">{t('heroTitleLine1')}</span>
              <span className="title-row-white">{t('heroTitleLine2')}</span>
              <span className="title-row-white">{t('heroTitleLine3')}</span>
            </h1>
          </div>

          <p className="hero-description">
            {t('heroDescription')}
          </p>

          <div className="hero-cta-area">
            <div className="cta-button-relative">
              <button onClick={onOpenModal} className="btn-make-wish">
                {t('makeAWishBtn')}
              </button>
              
              {/* White doodle rays under button */}
              <div className="button-doodle-rays">
                <svg width="42" height="42" viewBox="0 0 50 50" fill="none">
                  <path d="M10 16L3 25" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M22 22L17 35" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M34 24L34 38" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Fully Regenerated Dynamic Code Scene */}
        <div className="hero-middle-scene">

          {/* Top Left Pink Floating Popsicle */}
          <div className="floating-popsicle-wrap popsicle-pink-wrap animate-float-slow">
            <div className="popsicle-inner">
              <img src={popsiclePink} alt="Pink Popsicle" className="img-popsicle-pink" />
              {/* White motion arc doodles */}
              <svg className="motion-arcs-left" width="22" height="32" viewBox="0 0 22 32" fill="none">
                <path d="M4 4C2 10 5 18 2 28" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M14 2C11 8 15 16 11 24" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Top Right Floating Soft 3D Cloud */}
          <div className="floating-cloud-wrap cloud-top animate-float-delayed">
            <svg width="84" height="54" viewBox="0 0 78 50" fill="none">
              <path d="M20 46h40a16 16 0 0016-16c0-7.2-4.8-13.4-11.6-15.3A21.3 21.3 0 0024 20a16 16 0 00-20 14c0 8.8 7.2 12 16 12z" fill="#FFFFFF" fillOpacity="0.95" />
            </svg>
          </div>

          {/* Bottom Left Floating Soft 3D Cloud */}
          <div className="floating-cloud-wrap cloud-bottom animate-float">
            <svg width="74" height="48" viewBox="0 0 68 44" fill="none">
              <path d="M16 40h36a14 14 0 0014-14c0-6.4-4.2-11.8-10.2-13.4A18.7 18.7 0 0022 18A14 14 0 004 28c0 7.7 6.3 12 14 12z" fill="#FFFFFF" fillOpacity="0.95" />
            </svg>
          </div>

          {/* Center Typography Stack */}
          <div className="middle-typography-block">
            <span className="script-every-wish">{t('everyWish')}</span>
            
            <div className="matters-text-row">
              {/* Left yellow rays */}
              <svg className="rays-left" width="26" height="26" viewBox="0 0 24 24" fill="none">
                <line x1="2" y1="12" x2="10" y2="12" stroke="#FFDE00" strokeWidth="3" strokeLinecap="round" />
                <line x1="4" y1="5" x2="12" y2="9" stroke="#FFDE00" strokeWidth="3" strokeLinecap="round" />
                <line x1="4" y1="19" x2="12" y2="15" stroke="#FFDE00" strokeWidth="3" strokeLinecap="round" />
              </svg>

              <span className="matters-title">{t('matters')}</span>

              {/* Right yellow rays */}
              <svg className="rays-right" width="26" height="26" viewBox="0 0 24 24" fill="none">
                <line x1="14" y1="12" x2="22" y2="12" stroke="#FFDE00" strokeWidth="3" strokeLinecap="round" />
                <line x1="12" y1="9" x2="20" y2="5" stroke="#FFDE00" strokeWidth="3" strokeLinecap="round" />
                <line x1="12" y1="15" x2="20" y2="19" stroke="#FFDE00" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            <p className="middle-subheading">{t('middleSubheading')}</p>

            {/* Small Yellow Heart */}
            <svg className="doodle-heart-center" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFDE00" strokeWidth="2.8">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>

          {/* Sweeping Dashed Arch Path + White Paper Plane */}
          <div className="paper-plane-trail-wrap">
            <svg width="230" height="95" viewBox="0 0 230 95" fill="none">
              <path 
                d="M 15 30 Q 95 95, 175 35" 
                stroke="#FFFFFF" 
                strokeWidth="2.5" 
                strokeDasharray="5 5" 
                strokeLinecap="round" 
              />
              {/* Paper Plane Icon at end of path */}
              <g transform="translate(172, 20) rotate(18)">
                <polygon points="0,18 24,0 16,24 10,14" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
                <line x1="0" y1="18" x2="10" y2="14" stroke="#FFFFFF" strokeWidth="2" />
              </g>
            </svg>
          </div>

          {/* Bottom Right Yellow Floating Popsicle */}
          <div className="floating-popsicle-wrap popsicle-yellow-wrap animate-float-reverse">
            <div className="popsicle-inner">
              <img src={popsicleYellow} alt="Yellow Popsicle" className="img-popsicle-yellow" />
              {/* White splash rays */}
              <svg className="splash-rays-yellow" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="4" y1="4" x2="10" y2="10" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="2" y1="14" x2="8" y2="14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="10" y1="20" x2="14" y2="16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Cute Yellow Smiley Stars */}
          <div className="smiley-star star-tl">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="#FFDE00">
              <path d="M16 2l3.8 8.5L29 12l-6.5 6 1.8 9.5L16 23l-8.3 4.5L9.5 18 3 12l9.2-1.5L16 2z" />
              <circle cx="12" cy="13" r="1.3" fill="#101E4A" />
              <circle cx="20" cy="13" r="1.3" fill="#101E4A" />
              <path d="M13 17q3 3 6 0" stroke="#101E4A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          <div className="smiley-star star-br">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="#FFDE00">
              <path d="M16 2l3.8 8.5L29 12l-6.5 6 1.8 9.5L16 23l-8.3 4.5L9.5 18 3 12l9.2-1.5L16 2z" />
              <circle cx="12" cy="13" r="1.3" fill="#101E4A" />
              <circle cx="20" cy="13" r="1.3" fill="#101E4A" />
              <path d="M13 17q3 3 6 0" stroke="#101E4A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* 4-Pointed White Sparkle Stars */}
          <svg className="white-sparkle sparkle-top" width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
          </svg>
          <svg className="white-sparkle sparkle-bottom" width="16" height="16" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
          </svg>

        </div>

        {/* Right Column: Rebuilt Layered Artwork Scene */}
        <div className="hero-artwork">
          <div className="artwork-scene">
            {/* Sky-blue blob background */}
            <div className="scene-sky-blob">
              {/* Cloud bumps on top-left */}
              <div className="sky-cloud sky-cloud--top"></div>
              <div className="sky-cloud sky-cloud--mid"></div>
            </div>

            {/* "WISHES WORTH LKR 1 MILLION" badge */}
            <div className="scene-badge">
              <span className="badge-top-text">{t('badgeTopText')}</span>
              <span className="badge-bottom-text">{t('badgeBottomText')}</span>
            </div>

            {/* White splash doodles (left side) */}
            <svg className="scene-splash-left" width="40" height="50" viewBox="0 0 40 50" fill="none">
              <path d="M20 3L20 18" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
              <path d="M8 14L15 26" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
              <path d="M30 16L25 28" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round"/>
            </svg>

            {/* White heart (right side) */}
            <svg className="scene-heart-right" width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M13 23s-11-7.5-11-14.5a6.5 6.5 0 0 1 11-4.7A6.5 6.5 0 0 1 24 8.5c0 7-11 14.5-11 14.5z" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
            </svg>

            {/* Hand holding ice cream stick — photo with embedded language handwritten text */}
            <div className="scene-hand-stick-wrapper">
              <img 
                src={getHandStickImage()} 
                alt="Hand holding ice cream stick" 
                className="scene-hand-stick"
              />
            </div>

            {/* Yellow-green squiggles at bottom */}
            <svg className="scene-squiggle scene-squiggle--bl" width="22" height="40" viewBox="0 0 22 40" fill="none">
              <path d="M11 2C6 8 16 14 8 22C14 28 6 34 11 38" stroke="#CEEF2D" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
            <svg className="scene-squiggle scene-squiggle--br" width="28" height="24" viewBox="0 0 28 24" fill="none">
              <path d="M3 12C8 4 14 20 20 8C24 16 26 6 27 12" stroke="#CEEF2D" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
        </div>

      </div>
    </section>
  );
}
