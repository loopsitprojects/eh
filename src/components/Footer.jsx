import React, { useState } from 'react';
import { Heart, ShieldCheck } from 'lucide-react';
import PrivacyPolicyModal from './PrivacyPolicyModal';

export default function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleOpenPrivacy = (e) => {
    if (e) e.preventDefault();
    setIsPrivacyModalOpen(true);
  };

  const handleClosePrivacy = () => {
    setIsPrivacyModalOpen(false);
  };

  return (
    <footer className="footer-pink-line-container">
      <div className="footer-pink-line-content">
        
        {/* Privacy Policy Link Button - Kept in English for all languages */}
        <button 
          type="button" 
          onClick={handleOpenPrivacy} 
          className="btn-privacy-policy-link"
          title="Read Privacy Policy"
        >
          <ShieldCheck size={16} />
          <span>Privacy Policy</span>
        </button>

        <span className="footer-line-separator">•</span>

        {/* Copyright Text */}
        <div className="footer-copyright-text">
          <span>© 2026 Elephant House Wonder. All rights reserved.</span>
          <span className="footer-crafted-line">
            Crafted with <Heart size={14} fill="#FFFFFF" color="#FFFFFF" className="footer-heart-icon" /> for children across Sri Lanka.
          </span>
        </div>

      </div>

      {/* Render Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={handleClosePrivacy} 
      />
    </footer>
  );
}
