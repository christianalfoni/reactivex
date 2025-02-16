import observingComponentsPlugin from "babel-plugin-observing-components";

export default function plugins() {
  return [observingComponentsPlugin({ importPath: "reactivex" })];
}
