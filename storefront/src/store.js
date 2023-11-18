import { atom, useAtom } from "jotai";
const counterAtom = atom(0);
import { BASE_URL } from './constants';

const useCount = () => useAtom(counterAtom);

const articleData = atom(async () => {
    const response = await fetch(`${BASE_URL}store/product/?ordering=-created_at`, {mode: 'no-cors', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': 'true', 'Access-Control-Allow-Methods': 'GET', 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization', withCredentials: true }});
    const data = await response.json();
    return data;
});

export const useArticleData = () => useAtom(articleData);

export default useCount;

