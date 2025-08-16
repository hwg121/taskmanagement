import React from 'react';
import { RefreshCw } from 'lucide-react';

const PullToRefreshIndicator = ({ pullProgress, isRefreshing, threshold }) => {
  if (pullProgress === 0 && !isRefreshing) return null;

  const opacity = Math.min(pullProgress * 2, 1);
  const scale = 0.8 + (pullProgress * 0.2);
  const rotation = isRefreshing ? 360 : pullProgress * 180;

  return (
    <div 
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
      style={{
        opacity,
        transform: `translateY(${Math.min(pullProgress * 20, 20)}px) scale(${scale})`
      }}
    >
      <div className="bg-white/20 backdrop-blur-xl rounded-full p-3 shadow-lg border border-white/30">
        <RefreshCw 
          className={`h-6 w-6 text-white transition-transform duration-300 ${
            isRefreshing ? 'animate-spin' : ''
          }`}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      
      {/* Progress indicator */}
      <div className="mt-2 text-center">
        <div className="text-white/80 text-xs font-medium">
          {isRefreshing ? 'Đang làm mới...' : 'Kéo xuống để làm mới'}
        </div>
        {pullProgress > 0 && (
          <div className="mt-1 w-16 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/60 rounded-full transition-all duration-200"
              style={{ width: `${pullProgress * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PullToRefreshIndicator;
