import { describe, test, expect } from "vitest";
import { transformSync } from "@babel/core";
import transform from "./";

function runTransform(input: string) {
  const result = transformSync(input, {
    plugins: [transform()],
  });

  return result?.code;
}

describe("transform", () => {
  test("Does not transforms function without jsx", () => {
    expect(
      runTransform(`@reactive()
class App {}`)
    ).toBe(`class App {
  constructor() {
    reactive(this);
  }
}`);
  });
});
