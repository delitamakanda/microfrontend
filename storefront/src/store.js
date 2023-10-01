import { atom, useAtom } from "jotai";
const counterAtom = atom(0);

const useCount = () => useAtom(counterAtom);

const articleData = atom(async () => {
    const response = await fetch('https://koreanfashion.herokuapp.com/api/products/');
    const data = await response.json();
    return data;
});

export const useArticleData = () => useAtom(articleData);

export default useCount;
