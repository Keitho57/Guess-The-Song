import { atom } from "recoil";

export const playState = atom({
  key: "playState",
  default: false,
});

export const playingTrackState = atom({
  key: "playingTrackState",
  default: "" as any,
});

export const playlistState = atom({
  key: "playlistIdState",
  default: "5rOwkANoQvj0qDPgXw73Ts",
});

export const GetRandomSongState = atom({
  key:"GetRandomSongState",
  default: "" as any,
});