import { atom } from "recoil";

// 選択タグのAtom(データストア)
export const selectedTagState = atom<string>({
  key: "selectedTagState",
  default: "",
});
