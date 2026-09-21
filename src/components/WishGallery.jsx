import React, { useState, useEffect } from 'react';
import { Heart, MapPin, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WishGallery({ refreshTrigger }) {
  const { language, t } = useLanguage();
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [likedIds, setLikedIds] = useState(new Set());

  useEffect(() => {
    fetchWishes();
  }, [searchQuery, selectedCity, sortBy, language, refreshTrigger]);

  const fetchWishes = async () => {
    setLoading(true);
    try {
      const url = `api/get_wishes.php?q=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(selectedCity)}&sort=${sortBy}&lang=${language}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setWishes(data.wishes);
      }
    } catch (e) {
      console.error('Failed to load wishes gallery:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (wishId) => {
    if (likedIds.has(wishId)) return; // prevent double like in session

    // Optimistic UI update
    setWishes(prev => prev.map(w => w.id === wishId ? { ...w, likes_count: parseInt(w.likes_count) + 1 } : w));
    setLikedIds(prev => new Set(prev).add(wishId));

    try {
      await fetch('api/like_wish.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wish_id: wishId })
      });
    } catch (e) {
      console.error('Like failed:', e);
    }
  };

  return (
    <section className="gallery-section">
      <div className="gallery-container">
        
        {/* Wishes Grid */}
        {loading ? (
          <div className="gallery-loading-state">
            <div className="spinner"></div>
            <span>{t('submitting', 'Loading wishes...')}</span>
          </div>
        ) : wishes.length === 0 ? (
          <div className="gallery-empty-state">
            <MessageCircle size={48} color="#00B5EC" />
            <h3>{t('noWishesFound')}</h3>
            <p>{t('beFirstWish')}</p>
          </div>
        ) : (
          <div className="wishes-grid">
            {wishes.map((item) => (
              <div key={item.id} className="wish-card tactile-card">
                
                {/* Stick Image Preview */}
                <div className="wish-card-image">
                  <img 
                    src={item.image_path.startsWith('/') ? item.image_path : `/${item.image_path}`} 
                    alt={item.wish_title}
                    onError={(e) => {
                      e.target.src = '/uploads/sample_stick1.png';
                    }}
                  />
                  <div className="location-pill">
                    <MapPin size={12} />
                    <span>{t(`cities.${item.city_region}`, item.city_region)}</span>
                  </div>
                  {item.lang && (
                    <span className={`lang-badge-tag lang-tag-${item.lang}`}>
                      {item.lang.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="wish-card-body">
                  <h4 className="wish-title-text">{item.wish_title}</h4>
                  <p className="wish-story-text">{item.wish_story}</p>
                  
                  <div className="wish-card-footer">
                    <div className="submitter-info">
                      <span className="submitter-name">{t('by')} {item.submitter_name}</span>
                    </div>

                    <button 
                      onClick={() => handleLike(item.id)} 
                      className={`like-btn ${likedIds.has(item.id) ? 'liked' : ''}`}
                    >
                      <Heart 
                        size={18} 
                        fill={likedIds.has(item.id) ? '#E6007E' : 'none'} 
                        color={likedIds.has(item.id) ? '#E6007E' : '#1E293B'} 
                      />
                      <span>{item.likes_count}</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
