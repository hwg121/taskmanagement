import React from 'react';

const SkeletonLoading = ({ type = 'default', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'task':
        return (
          <div className="animate-pulse">
            <div className="bg-white/10 rounded-xl p-4 mb-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-white/15 rounded mb-2 w-1/2"></div>
                </div>
                <div className="h-6 w-6 bg-white/20 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-5 w-16 bg-white/20 rounded-full"></div>
                <div className="h-5 w-20 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      
      case 'user':
        return (
          <div className="animate-pulse">
            <div className="bg-white/10 rounded-xl p-3 mb-2">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-white/20 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded mb-1 w-24"></div>
                  <div className="h-3 bg-white/15 rounded w-20"></div>
                </div>
                <div className="h-6 w-16 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        );
      
      case 'card':
        return (
          <div className="animate-pulse">
            <div className="bg-white/10 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="h-8 w-8 bg-white/20 rounded-lg"></div>
                <div className="h-6 w-20 bg-white/20 rounded"></div>
              </div>
              <div className="h-4 bg-white/20 rounded mb-2 w-16"></div>
              <div className="h-2 bg-white/15 rounded w-full"></div>
            </div>
          </div>
        );
      
      case 'stats':
        return (
          <div className="animate-pulse">
            <div className="bg-white/10 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="h-8 w-8 bg-white/20 rounded-lg"></div>
                <div className="text-right">
                  <div className="h-3 bg-white/20 rounded mb-1 w-16"></div>
                  <div className="h-6 bg-white/20 rounded w-12"></div>
                </div>
              </div>
              <div className="h-2 bg-white/15 rounded w-full"></div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="animate-pulse">
            <div className="bg-white/10 rounded-xl p-4 mb-3">
              <div className="h-4 bg-white/20 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-white/15 rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-white/15 rounded w-2/3"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoading;
