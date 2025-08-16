import { useState, useEffect } from 'react';

const themes = {
  green: {
    name: 'Xanh lá',
    background: 'from-emerald-400 via-teal-500 to-cyan-600',
    primary: 'from-emerald-500 to-teal-600',
    primaryHover: 'from-emerald-600 to-teal-700',
    primaryText: 'text-emerald-400',
    primaryBorder: 'border-emerald-400/30',
    accent: 'emerald'
  },
  blue: {
    name: 'Xanh dương',
    background: 'from-blue-400 via-indigo-500 to-purple-600',
    primary: 'from-blue-500 to-indigo-600',
    primaryHover: 'from-blue-600 to-indigo-700',
    primaryText: 'text-blue-400',
    primaryBorder: 'border-blue-400/30',
    accent: 'blue'
  },
  purple: {
    name: 'Tím',
    background: 'from-purple-400 via-violet-500 to-indigo-600',
    primary: 'from-purple-500 to-violet-600',
    primaryHover: 'from-purple-600 to-violet-700',
    primaryText: 'text-purple-400',
    primaryBorder: 'border-purple-400/30',
    accent: 'purple'
  },
  pink: {
    name: 'Hồng',
    background: 'from-pink-400 via-rose-500 to-red-600',
    primary: 'from-pink-500 to-rose-600',
    primaryHover: 'from-pink-600 to-rose-700',
    primaryText: 'text-pink-400',
    primaryBorder: 'border-pink-400/30',
    accent: 'pink'
  },
  orange: {
    name: 'Cam',
    background: 'from-orange-400 via-amber-500 to-yellow-600',
    primary: 'from-orange-500 to-amber-600',
    primaryHover: 'from-orange-600 to-amber-700',
    primaryText: 'text-orange-400',
    primaryBorder: 'border-orange-400/30',
    accent: 'orange'
  }
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'green';
  });

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  return {
    theme: themes[currentTheme],
    currentTheme,
    themes,
    changeTheme
  };
};