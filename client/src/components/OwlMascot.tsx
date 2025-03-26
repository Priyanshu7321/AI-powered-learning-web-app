import React from 'react';

interface OwlMascotProps {
  size?: "tiny" | "small" | "medium" | "large";
  className?: string;
  withAudio?: boolean;
}

const OwlMascot: React.FC<OwlMascotProps> = ({ 
  size = "medium", 
  className = "",
  withAudio = false 
}) => {
  const sizeClasses = {
    tiny: "w-10 h-10",
    small: "w-12 h-12",
    medium: "w-32 h-32 md:w-40 md:h-40",
    large: "w-40 h-40 md:w-48 md:h-48"
  };

  return (
    <div className={`relative ${className}`}>
      <svg 
        className={`${sizeClasses[size]} rounded-full border-2 ${size === "medium" || size === "large" ? "border-4" : "border-2"} border-secondary fill-current text-[#996633]`} 
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Owl body */}
        <circle cx="50" cy="50" r="45" fill="#996633" />
        
        {/* Owl eyes */}
        <circle cx="35" cy="40" r="15" fill="white" />
        <circle cx="65" cy="40" r="15" fill="white" />
        <circle cx="35" cy="40" r="8" fill="#333" />
        <circle cx="65" cy="40" r="8" fill="#333" />
        <circle cx="38" cy="37" r="3" fill="white" />
        <circle cx="68" cy="37" r="3" fill="white" />
        
        {/* Owl beak */}
        <path d="M50 50 L40 60 L60 60 Z" fill="#FF9933" />
        
        {/* Owl ear tufts */}
        <path d="M25 25 L35 35 L30 20 Z" fill="#774411" />
        <path d="M75 25 L65 35 L70 20 Z" fill="#774411" />
      </svg>
      
      {withAudio && (
        <div className="absolute -top-2 -right-2 bg-accent rounded-full w-10 h-10 flex items-center justify-center shadow-md animate-bounce-slow">
          <i className="ri-volume-up-line text-dark text-xl"></i>
        </div>
      )}
    </div>
  );
};

export default OwlMascot;
