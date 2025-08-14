import React from 'react';
import { Palette } from 'lucide-react';

const ThemeSelector = ({ currentTheme, themes, onThemeChange, isOpen, onToggle }) => {
  const themeColors = {
    green: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500'
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="p-2 backdrop-blur-xl bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 border border-white/20 rounded-lg shadow-lg"
        title="Đổi màu giao diện"
      >
        <Palette className="h-4 w-4 text-white" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="p-2 backdrop-blur-xl bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/15 transition-all duration-200 border border-white/30 rounded-lg shadow-lg"
      >
        <Palette className="h-4 w-4 text-white" />
      </button>
      
      <div className="absolute top-full right-0 mt-2 backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg shadow-lg p-3 min-w-[200px] z-50">
        <h4 className="text-white font-medium mb-3 text-sm">Chọn màu giao diện</h4>
        <div className="space-y-2">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => {
                onThemeChange(key);
                onToggle();
              }}
              className={`
                w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200
                ${currentTheme === key 
                  ? 'bg-white/20 border border-white/30' 
                  : 'hover:bg-white/10 border border-transparent'
                }
              `}
            >
              <div className={`w-4 h-4 rounded-full ${themeColors[key]} shadow-sm`} />
              <span className="text-white text-sm">{theme.name}</span>
              {currentTheme === key && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;