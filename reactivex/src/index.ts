import { AnnotationsMap, configure, makeAutoObservable } from "mobx";
import { observer as reactObserver } from "mobx-react-lite";

configure({
  enforceActions: "never",
});

export const reactive = makeAutoObservable as <
  T extends { new (...args: any[]): any }
>(
  overrides?: AnnotationsMap<InstanceType<T>, never>
) => (constructor: T) => void;

export const observer = reactObserver;
