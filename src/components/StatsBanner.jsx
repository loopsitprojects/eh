import React, { useState, useEffect } from 'react';
import { Gift, Heart, Sparkles, Award } from 'lucide-react';

export default function StatsBanner() {
  const [stats, setStats] = useState({
    total_wishes: 1420,
    total_likes: 3890,
    granted_wishes: 245,
    formatted_pool: 'LKR 1 MILLION'
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('api/stats.php');
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(prev => ({
          ...prev,
          total_wishes: data.stats.total_wishes + 1416, // combine live + baseline
          total_likes: data.stats.total_likes + 3800,
          granted_wishes: data.stats.granted_wishes
        }));
      }
    } catch (e) {
      console.error('Stats fetch error:', e);
    }
  };

  return (
    <section className="stats-section">
      <div className="stats-container">
        
        <div className="stats-card-wrapper tactile-card">
          <div className="stat-box">
            <div className="stat-icon icon-yellow">
              <Gift size={28} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.formatted_pool}</span>
              <span className="stat-label">Total Wish Pool</span>
            </div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-box">
            <div className="stat-icon icon-pink">
              <Sparkles size={28} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.total_wishes.toLocaleString()}</span>
              <span className="stat-label">Wishes Submitted</span>
            </div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-box">
            <div className="stat-icon icon-cyan">
              <Heart size={28} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.total_likes.toLocaleString()}</span>
              <span className="stat-label">Community Votes</span>
            </div>
          </div>

          <div className="stat-divider"></div>

          <div className="stat-box">
            <div className="stat-icon icon-lime">
              <Award size={28} />
            </div>
            <div className="stat-info">
              <span className="stat-number">{stats.granted_wishes}+</span>
              <span className="stat-label">Dreams Granted</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
