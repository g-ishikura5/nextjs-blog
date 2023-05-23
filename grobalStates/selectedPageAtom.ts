import { atom } from "recoil";

// 選択ページのAtom(データストア)
export const selectedPageState = atom<number>({
  key: "selectedPageState",
  default: 0,
});
