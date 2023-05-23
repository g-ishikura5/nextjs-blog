import { atom } from "recoil";

// 選択ページのAtom(データストア)
export const isClickTitleState = atom<boolean>({
  key: "isClickTitleState",
  default: false,
});
