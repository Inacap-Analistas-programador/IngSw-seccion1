import React from 'react';

const HeroImage = ({ src, alt = 'Hero Image', className = '', overlay = true }) => {
  return (
    <div className={`relative w-full h-64 md:h-96 overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      )}
    </div>
  );
};

export default HeroImage;
