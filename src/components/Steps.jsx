import React from 'react';
import step1Stick from '../assets/step1-stick.png';
import step2Phone from '../assets/step2-phone.png';
import step3Cloud from '../assets/step3-cloud.png';
import { useLanguage } from '../context/LanguageContext';

export default function Steps({ onOpenModal }) {
  const { t } = useLanguage();

  return (
    <section className="steps-section">
      {/* Rebuilt CSS+SVG Ribbon Banner — scales perfectly at any width */}
      <div className="ribbon-banner">
        <div className="ribbon-inner">
          {/* Left doodles */}
          <div className="ribbon-doodles ribbon-doodles-left">
            {/* Pink Heart */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 28s-14-9-14-18a8 8 0 0 1 14-5.3A8 8 0 0 1 30 10c0 9-14 18-14 18z" fill="#E8277A" stroke="#C0185C" strokeWidth="1.5"/>
            </svg>
            {/* Dash lines */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="ribbon-doodle-dash">
              <line x1="2" y1="5" x2="20" y2="5" stroke="#1B1B2E" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="2" y1="12" x2="14" y2="12" stroke="#1B1B2E" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="ribbon-doodle-dash ribbon-doodle-dash--offset">
              <line x1="2" y1="5" x2="20" y2="5" stroke="#1B1B2E" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="2" y1="12" x2="14" y2="12" stroke="#1B1B2E" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Center badge + text */}
          <div className="ribbon-center">
            <div className="ribbon-badge">3</div>
            <span className="ribbon-text">{t('easySteps')}</span>
          </div>

          {/* Right doodles */}
          <div className="ribbon-doodles ribbon-doodles-right">
            {/* Dash lines */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="ribbon-doodle-dash ribbon-doodle-dash--flip">
              <line x1="2" y1="5" x2="20" y2="5" stroke="#1B1B2E" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="2" y1="12" x2="14" y2="12" stroke="#1B1B2E" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            {/* Outlined star with tick mark */}
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <path d="M19 3l3.5 10.5H34l-9 6.5 3.5 10.5L19 24l-9.5 6.5L13 20 4 13.5h11.5z" stroke="#1B1B2E" strokeWidth="2" fill="none" strokeLinejoin="round"/>
            </svg>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ribbon-star-dash">
              <line x1="2" y1="8" x2="14" y2="8" stroke="#1B1B2E" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* SVG wavy scalloped bottom edge — cream bumps cut into the lime ribbon */}
        <svg className="ribbon-wave-bottom" viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 L0,32 C60,5 120,5 180,32 C240,60 300,60 360,32 C420,5 480,5 540,32 C600,60 660,60 720,32 C780,5 840,5 900,32 C960,60 1020,60 1080,32 C1140,5 1200,5 1260,32 C1320,60 1380,60 1440,32 L1440,60 Z" fill="#FFFDF2"/>
        </svg>
      </div>

      <div className="steps-container">
        {/* 3 Steps Cards Grid */}
        <div className="steps-grid">
          
          {/* STEP 01 */}
          <div className="step-card card-blue">
            <div className="card-top-row">
              <span className="step-badge">{t('step1Badge')}</span>
              <div className="card-text-col">
                <h3 className="step-title">{t('step1Title')}</h3>
                {t('step1Subtitle') ? <span className="step-subtitle-sinhala">{t('step1Subtitle')}</span> : null}
                <p className="step-desc desc-purple">{t('step1Desc')}</p>
              </div>
            </div>

            <div className="step-illus-wrapper stick-heart-container">
              <div className="card-white-heart">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <img 
                src={step1Stick} 
                alt="Wooden ice cream stick wish illustration" 
                className="img-step-illus-stick" 
              />
            </div>
          </div>

          {/* STEP 02 */}
          <div className="step-card card-lime">
            <div className="card-top-row">
              <span className="step-badge">{t('step2Badge')}</span>
              <div className="card-text-col">
                <h3 className="step-title">{t('step2Title')}</h3>
                {t('step2Subtitle') ? <span className="step-subtitle-sinhala">{t('step2Subtitle')}</span> : null}
                <p className="step-desc desc-olive">{t('step2Desc')}</p>
              </div>
            </div>

            <div className="step-illus-wrapper">
              <img 
                src={step2Phone} 
                alt="Pink smartphone camera photo illustration" 
                className="img-step-illus-phone" 
              />
            </div>
          </div>

          {/* STEP 03 */}
          <div 
            className="step-card card-pink card-clickable" 
            onClick={onOpenModal} 
            title="Click to Upload Your Wish"
          >
            <div className="card-top-row">
              <span className="step-badge">{t('step3Badge')}</span>
              <div className="card-text-col">
                <h3 className="step-title">{t('step3Title')}</h3>
                {t('step3Subtitle') ? <span className="step-subtitle-sinhala">{t('step3Subtitle')}</span> : null}
                <p className="step-desc desc-purple">{t('step3Desc')}</p>
              </div>
            </div>

            <div className="step-illus-wrapper">
              <img 
                src={step3Cloud} 
                alt="Fluffy 3D cloud with upward green upload arrow" 
                className="img-step-illus-cloud" 
              />
            </div>
          </div>

        </div>
      </div>

      {/* Rebuilt SVG Bottom Wave — sky-blue scalloped bumps on cream background */}
      <div className="steps-bottom-wave-wrap">
        <svg
          className="img-bottom-wave"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sky-blue fill with scalloped top edge */}
          <path
            d="M0,100 L0,42 C40,68 80,68 120,42 C160,16 200,16 240,42 C280,68 320,68 360,42 C400,16 440,16 480,42 C520,68 560,68 600,42 C640,16 680,16 720,42 C760,68 800,68 840,42 C880,16 920,16 960,42 C1000,68 1040,68 1080,42 C1120,16 1160,16 1200,42 C1240,68 1280,68 1320,42 C1360,16 1400,16 1440,42 L1440,100 Z"
            fill="#ADE5FE"
          />
        </svg>
      </div>
    </section>
  );
}
