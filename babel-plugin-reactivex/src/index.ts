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

        // Remove @reactive() decorator
        if (node.decorators && node.decorators.length) {
          node.decorators = node.decorators.filter((decorator) => {
            if (
              t.isCallExpression(decorator.expression) &&
              t.isIdentifier(decorator.expression.callee, { name: "reactive" })
            ) {
              hasReactiveDecorator = true;
              return false;
            }
            return true;
          });
          if (!node.decorators.length) {
            node.decorators = null;
          }
        }

        if (hasReactiveDecorator) {
          // Find existing constructor
          let constructorMethod = node.body.body.find(
            (method) => t.isClassMethod(method) && method.kind === "constructor"
          );

          if (constructorMethod) {
            // Cast to t.ClassMethod to access the body safely
            const classMethod = constructorMethod as t.ClassMethod;
            classMethod.body.body.push(
              t.expressionStatement(
                t.callExpression(t.identifier("reactive"), [t.thisExpression()])
              )
            );
          } else {
            // Create new constructor with reactive(this) call
            const constructor = t.classMethod(
              "constructor",
              t.identifier("constructor"),
              [],
              t.blockStatement([
                t.expressionStatement(
                  t.callExpression(t.identifier("reactive"), [
                    t.thisExpression(),
                  ])
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
