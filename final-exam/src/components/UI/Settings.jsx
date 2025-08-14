import React from 'react';
import { Settings as SettingsIcon, Moon, Sun, Palette } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useTheme } from '../../hooks/useTheme';

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { theme, currentTheme, themes, changeTheme } = useTheme();

  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/10 p-4 shadow-lg">
      <div className="flex items-center mb-4">
        <SettingsIcon className="h-5 w-5 text-white/70 mr-2" />
        <h3 className="text-white font-semibold">Cài đặt</h3>
      </div>
      
      {/* Dark Mode Toggle */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isDarkMode ? (
              <Moon className="h-4 w-4 text-white/70 mr-2" />
            ) : (
              <Sun className="h-4 w-4 text-white/70 mr-2" />
            )}
            <span className="text-white/80 text-sm">Chế độ tối</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Theme Selector */}
      <div>
        <div className="flex items-center mb-3">
          <Palette className="h-4 w-4 text-white/70 mr-2" />
          <span className="text-white/80 text-sm">Màu chủ đạo</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(themes).map(([key, themeData]) => (
            <button
              key={key}
              onClick={() => changeTheme(key)}
              className={`p-2 rounded-lg border-2 transition-all ${
                currentTheme === key
                  ? 'border-white scale-105'
                  : 'border-white/20 hover:border-white/40'
              }`}
              style={{
                background: `linear-gradient(135deg, ${themeData.background.split(' ').map(color => {
                  const colorMap = {
                    'from-emerald-400': '#34d399',
                    'via-teal-500': '#14b8a6',
                    'to-cyan-600': '#0891b2',
                    'from-blue-400': '#60a5fa',
                    'via-indigo-500': '#6366f1',
                    'to-purple-600': '#9333ea',
                    'from-purple-400': '#a78bfa',
                    'via-violet-500': '#8b5cf6',
                    'to-indigo-600': '#4f46e5',
                    'from-pink-400': '#f472b6',
                    'via-rose-500': '#f43f5e',
                    'to-red-600': '#dc2626',
                    'from-orange-400': '#fb923c',
                    'via-amber-500': '#f59e0b',
                    'to-yellow-600': '#ca8a04'
                  };
                  return colorMap[color] || color;
                }).join(', ')})`
              }}
            >
              <div className="w-full h-8 rounded flex items-center justify-center">
                <span className="text-white text-xs font-medium">{themeData.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
