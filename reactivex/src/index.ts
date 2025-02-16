import { configure, makeAutoObservable } from "mobx";
import { observer as reactObserver } from "mobx-react-lite";

configure({
  enforceActions: "never",
});

export const reactive = makeAutoObservable;

export const observer = reactObserver;
