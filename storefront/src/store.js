import { atom, useAtom } from "jotai";
const counterAtom = atom(0);

const useCount = () => useAtom(counterAtom);

export default useCount;
