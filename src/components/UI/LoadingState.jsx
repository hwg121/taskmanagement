import React from 'react';

const LoadingState = ({ 
  type = 'spinner', 
  size = 'medium', 
  text = 'Đang tải...', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={`animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400 ${sizeClasses[size]}`} />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`animate-pulse bg-blue-400 rounded-full ${sizeClasses[size]}`} />
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-blue-400 animate-pulse"></div>
            <div className="w-1 h-6 bg-blue-400 animate-pulse" style={{animationDelay: '0.1s'}}></div>
            <div className="w-1 h-8 bg-blue-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1 h-6 bg-blue-400 animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="w-1 h-4 bg-blue-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        );
      
      case 'skeleton':
        return (
          <div className="space-y-3">
            <div className="animate-pulse">
              <div className="h-4 bg-blue-400/20 rounded w-3/4"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-blue-400/20 rounded w-1/2"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-blue-400/20 rounded w-5/6"></div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={`animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400 ${sizeClasses[size]}`} />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {renderLoader()}
      {text && (
        <p className={`text-blue-200 font-medium ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
