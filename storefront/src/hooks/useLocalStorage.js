import { useState } from "react";

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                return JSON.parse(item);
            } else {
                window.localStorage.setItem(key, initialValue);
                return initialValue;
            }
        } catch (error) {
            return initialValue;
        }
    });
    const setValue = (newValue) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch(error) {
            console.log(error);
        }
        setStoredValue(newValue);
    }
    return [storedValue, setValue]
};