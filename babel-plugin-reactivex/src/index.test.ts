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
  test("Transforms class reactive decorator", () => {
    expect(
      runTransform(`@reactive()
class App {}`)
    ).toBe(`class App {
  constructor() {
    reactive(this);
  }
}`);
  });
  test("Transforms with options", () => {
    expect(
      runTransform(`@reactive({ count: false })
class App {
  count = 0
}`)
    ).toBe(`class App {
  constructor() {
    reactive(this, {
      count: false
    });
  }
  count = 0;
}`);
  });
});
