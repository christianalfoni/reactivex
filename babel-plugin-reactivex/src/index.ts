import { types as t, PluginObj } from "@babel/core";

export default function reactivePlugin(): PluginObj {
  return {
    name: "reactive-plugin",
    manipulateOptions(_opts, parserOpts) {
      // Enable legacy decorators syntax
      if (!parserOpts.plugins.includes("decorators-legacy")) {
        parserOpts.plugins.push("decorators-legacy");
      }
    },
    visitor: {
      ClassDeclaration(path) {
        const node = path.node;
        let hasReactiveDecorator = false;
        let reactiveOptions: any = null; // store options if provided

        // Remove @reactive(...) decorator and extract its argument if it exists
        if (node.decorators && node.decorators.length) {
          node.decorators = node.decorators.filter((decorator) => {
            if (
              t.isCallExpression(decorator.expression) &&
              t.isIdentifier(decorator.expression.callee, { name: "reactive" })
            ) {
              hasReactiveDecorator = true;
              if (
                decorator.expression.arguments &&
                decorator.expression.arguments.length > 0
              ) {
                reactiveOptions = decorator.expression.arguments[0];
              }
              return false;
            }
            return true;
          });
          if (!node.decorators.length) {
            node.decorators = null;
          }
        }

        if (hasReactiveDecorator) {
          // Determine call arguments for reactive(this, reactiveOptions?)
          const callArgs = [t.thisExpression()];
          if (reactiveOptions) {
            callArgs.push(reactiveOptions);
          }

          // Find existing constructor
          let constructorMethod = node.body.body.find(
            (method) => t.isClassMethod(method) && method.kind === "constructor"
          );

          if (constructorMethod) {
            // Cast to t.ClassMethod to access the body safely
            const classMethod = constructorMethod as t.ClassMethod;
            classMethod.body.body.push(
              t.expressionStatement(
                t.callExpression(t.identifier("reactive"), callArgs)
              )
            );
          } else {
            // Create new constructor with reactive(this, reactiveOptions?) call
            const constructor = t.classMethod(
              "constructor",
              t.identifier("constructor"),
              [],
              t.blockStatement([
                t.expressionStatement(
                  t.callExpression(t.identifier("reactive"), callArgs)
                ),
              ])
            );
            node.body.body.unshift(constructor);
          }
        }
      },
      // ...existing visitors...
    },
  };
}
