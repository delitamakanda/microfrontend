import { useState, useEffect } from "react";

export const usePersistedState = (defaultValue, localStoreKey) => {
    const [value, setValue] = useState(() => {
        const localStoreItem = localStorage.getItem(localStoreKey);
        if (localStoreItem === null) {
            return defaultValue;
        }
        try {
            return JSON.parse(localStoreItem);
        } catch (error) {
            return defaultValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(localStoreKey, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
}