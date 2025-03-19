"use client";

import { useEffect, useState } from "react";

const getStorageValue = <T>(key: string, initialValue: T): T => {
  if (typeof window !== "undefined") {
    const savedValue = localStorage.getItem(key);
    if (savedValue) {
      return JSON.parse(savedValue);
    }
  }
  return initialValue;
};

const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getStorageValue(key, initialValue),
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
