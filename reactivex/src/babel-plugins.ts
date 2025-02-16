import observingComponentsPlugin from "babel-plugin-observing-components";
import reactivePlugin from "babel-plugin-reactivex";

export default function plugins() {
  return [
    reactivePlugin(),
    observingComponentsPlugin({ importPath: "reactivex" }),
  ];
}
