import { atom, useAtom } from "jotai";
const counterAtom = atom(0);
import { BASE_URL } from './constants';

const useCount = () => useAtom(counterAtom);

const articleData = atom(async () => {
    const response = await fetch(`${BASE_URL}store/product/?ordering=-created_at`, {}, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'withCredentials': 'true',
            'Access-Control-Allow-Origin': '*',
        }
    });
    const data = await response.json();
    return data;
});

export const useArticleData = () => useAtom(articleData);

export default useCount;

