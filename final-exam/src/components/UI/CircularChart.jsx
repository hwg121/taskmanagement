import React from 'react';

const CircularChart = ({ data, size = 120, themeColor }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercentage = 0;
  
  // Function to mix color with white
  const mixWithWhite = (color, ratio = 0.7) => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Mix with white (255, 255, 255)
    const mixedR = Math.round(r * ratio + 255 * (1 - ratio));
    const mixedG = Math.round(g * ratio + 255 * (1 - ratio));
    const mixedB = Math.round(b * ratio + 255 * (1 - ratio));
    
    // Convert back to hex
    return `#${mixedR.toString(16).padStart(2, '0')}${mixedG.toString(16).padStart(2, '0')}${mixedB.toString(16).padStart(2, '0')}`;
  };
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
        />
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
          
          cumulativePercentage += percentage;
          
          // Mix the color with white, or use theme color if available
          const colorToUse = themeColor || item.color;
          const mixedColor = mixWithWhite(colorToUse);
          
          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={mixedColor}
              strokeWidth="8"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          );
        })}
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{total}</div>
          <div className="text-xs text-white/70">Tasks</div>
        </div>
      </div>
    </div>
  );
};

export default CircularChart;