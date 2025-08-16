import { useState, useEffect } from 'react';

/**
 * Custom hook để tạo debounced value
 * @param {any} value - Giá trị cần debounce
 * @param {number} delay - Độ trễ tính bằng milliseconds (mặc định: 500ms)
 * @returns {any} - Giá trị đã được debounce
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Tạo timer để delay việc cập nhật giá trị
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timer khi component unmount hoặc value thay đổi
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
