import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './popUpMsg.module.css';

export default function AnnouncementPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenPopup = localStorage.getItem('hasSeenWelcomePopup');
    
    // If not seen, show it after a short delay (e.g., 1 second)
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Save to storage so it doesn't show again
    localStorage.setItem('hasSeenWelcomePopup', 'false');
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={handleClose}>×</button>
        
        <div className={styles.content}>
          <h2>Important Message!!!</h2>
          <p>This was my first real experience with AI spec-driven development. I made plenty of mistakes along the way, but I did my best throughout the project.</p>
          <p>Inshallah, in the next hackathon I will perform even better. I learned so many things during this one—what to avoid, what to consider when building, and much more.</p>
          <p>With due respect, thank you from the bottom of my heart for your time and effort.</p>
          <p><strong>Special love to Sir Ameen Alam ❤️🙌✨</strong></p>
          
          <button className="button button--primary button--lg" onClick={handleClose}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}