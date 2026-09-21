import React, { useState } from 'react';
import { X, Upload, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';
import PrivacyPolicyModal from './PrivacyPolicyModal';

export default function WishModal({ isOpen, onClose, onWishSubmitted }) {
  const { language, t } = useLanguage();
  const [wishText, setWishText] = useState('');
  const [story, setStory] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Colombo');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewFileUrl, setPreviewFileUrl] = useState('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewFileUrl(URL.createObjectURL(file));
    }
  };

  const handleOpenPrivacy = (e) => {
    if (e) e.preventDefault();
    setIsPrivacyModalOpen(true);
  };

  const handleClosePrivacy = () => {
    setIsPrivacyModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg(t('fillRequired'));
      return;
    }
    if (!selectedFile) {
      setErrorMsg(t('fillRequired'));
      return;
    }
    if (!acceptedPrivacy) {
      setErrorMsg(
        language === 'si'
          ? 'කරුණාකර Privacy Policy පිළිගන්න.'
          : language === 'ta'
          ? 'தயவுசெய்து Privacy Policy ஐ ஒப்புக்கொள்ளவும்.'
          : 'Please accept the Privacy Policy before submitting.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      const defaultTitle = `Wonder Wish from ${name}`;
      formData.append('wish_title', wishText || defaultTitle);
      formData.append('wish_story', story || wishText || defaultTitle);
      formData.append('submitter_name', name);
      formData.append('submitter_phone', phone);
      formData.append('submitter_email', email);
      formData.append('city_region', city);
      formData.append('lang', language);

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await fetch('api/submit_wish.php', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setSuccessMsg(true);
        // Trigger celebratory confetti burst!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        if (onWishSubmitted) {
          onWishSubmitted(data.wish);
        }

        setTimeout(() => {
          setSuccessMsg(false);
          setWishText('');
          setStory('');
          setName('');
          setPhone('');
          setEmail('');
          setSelectedFile(null);
          setPreviewFileUrl('');
          setAcceptedPrivacy(false);
          onClose();
        }, 2500);

      } else {
        setErrorMsg(data.error || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('Network error. Please check your connection.');
    }
  };

  if (!isOpen) return null;

  const sriLankaDistricts = [
    'Ampara',
    'Anuradhapura',
    'Badulla',
    'Batticaloa',
    'Colombo',
    'Galle',
    'Gampaha',
    'Hambantota',
    'Jaffna',
    'Kalutara',
    'Kandy',
    'Kegalle',
    'Kilinochchi',
    'Kurunegala',
    'Mannar',
    'Matale',
    'Matara',
    'Monaragala',
    'Mullaitivu',
    'Nuwara Eliya',
    'Polonnaruwa',
    'Puttalam',
    'Ratnapura',
    'Trincomalee',
    'Vavuniya'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content tactile-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        {successMsg ? (
          <div className="modal-success-screen">
            <CheckCircle2 size={72} color="#A2E026" className="success-icon animate-bounce" />
            <h2>WISH SUBMITTED!</h2>
            <p>{t('wishSubmittedSuccess')}</p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div className="modal-tag">
                <Sparkles size={18} color="#FFDE00" />
                <span>{t('heroTitleLine1')}</span>
              </div>
              <h2 className="modal-title">{t('modalTitle')}</h2>
              <p className="modal-subtitle">{t('modalSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="wish-form">
              
              {/* Contact Details Fields */}
              <div className="form-grid">
                <div className="input-group">
                  <label className="field-label-bilingual">
                    <span className="label-english">{t('nameLabel')}</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder={t('namePlaceholder')}
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                  />
                </div>

                <div className="input-group">
                  <label className="field-label-bilingual">
                    <span className="label-english">{t('phoneLabel')}</span>
                  </label>
                  <input 
                    type="tel" 
                    required 
                    placeholder={t('phonePlaceholder')}
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                  />
                </div>

                <div className="input-group">
                  <label className="field-label-bilingual">
                    <span className="label-english">{t('emailLabel')}</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder={t('emailPlaceholder')}
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>

                <div className="input-group">
                  <label className="field-label-bilingual">
                    <span className="label-english">{t('cityLabel')}</span>
                  </label>
                  <select value={city} onChange={e => setCity(e.target.value)}>
                    {sriLankaDistricts.map(d => (
                      <option key={d} value={d}>
                        {t(`cities.${d}`, d)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo Upload Dropzone Field (Compulsory) */}
              <div className="photo-upload-area mt-4">
                <div className="input-group">
                  <label className="field-label-bilingual">
                    <span className="label-english">{t('uploadPhotoLabel')}</span>
                  </label>
                  <label className="upload-dropzone">
                    <input type="file" accept="image/*" required onChange={handleFileChange} hidden />
                    {previewFileUrl ? (
                      <div className="image-preview">
                        <img src={previewFileUrl} alt="Uploaded stick preview" />
                        <span className="change-img-text">{t('uploadHint')}</span>
                      </div>
                    ) : (
                      <div className="dropzone-placeholder">
                        <Upload size={40} color="#00B5EC" />
                        <span className="dropzone-main-text">{t('uploadHint')}</span>
                        <small className="file-formats">Supported formats: JPG, PNG, WEBP</small>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Privacy Policy Acceptance Checkbox (Above Submit Button) */}
              <div className="privacy-accept-checkbox-group mt-4">
                <label className="privacy-checkbox-label">
                  <input 
                    type="checkbox" 
                    required
                    checked={acceptedPrivacy} 
                    onChange={e => setAcceptedPrivacy(e.target.checked)} 
                    className="privacy-checkbox-input"
                  />
                  <span className="privacy-checkbox-text">
                    {language === 'si'
                      ? 'මම කරුණු සියල්ල කියවා '
                      : language === 'ta'
                      ? 'நான் அனைத்து விதிகளையும் படித்து '
                      : 'I have read and agree to the '}
                    <button 
                      type="button" 
                      onClick={handleOpenPrivacy}
                      className="privacy-link-inline-btn"
                    >
                      Privacy Policy
                    </button>
                    <span className="required-star">*</span>
                  </span>
                </label>
              </div>

              {errorMsg && <div className="form-error-banner mt-3">{errorMsg}</div>}

              {/* Submit Action */}
              <div className="modal-footer">
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      <span>{t('submitting')}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>{t('submitWishBtn')}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </>
        )}

      </div>

      {/* Embedded Privacy Policy Modal View */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={handleClosePrivacy} 
      />
    </div>
  );
}
