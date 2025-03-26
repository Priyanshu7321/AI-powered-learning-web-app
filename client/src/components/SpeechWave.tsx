import React from 'react';

interface SpeechWaveProps {
  isActive: boolean;
  className?: string;
}

const SpeechWave: React.FC<SpeechWaveProps> = ({ isActive, className = "" }) => {
  return (
    <div 
      className={`speech-wave mb-8 transition-opacity duration-300 ${isActive ? 'speaking opacity-100' : 'opacity-0'} ${className}`}
    >
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
};

export default SpeechWave;
