import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-300 ${
        isDarkMode
          ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
      }`}
      title={isDarkMode ? 'Chuyển sang White Mode' : 'Chuyển sang Dark Mode'}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
