import { useState, useEffect } from "react";

export const usePersistedState = (defaultValue, localStoreKey) => {
    const [storedValue, setStoredValue] = useState(() => {
        const localStoreItem = window.localStorage.getItem(localStoreKey);
        if (localStoreItem) {
            return JSON.parse(localStoreItem);
        }
        try {
            return JSON.parse(localStoreItem);
        } catch (error) {
            return defaultValue;
        }
    });

    useEffect(() => {
        window.localStorage.setItem(localStoreKey, JSON.stringify(storedValue));
    }, [localStoreKey, storedValue]);

    return [storedValue, setStoredValue];
}