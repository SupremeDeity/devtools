function getPrecedence(C: string) {
  if (C == "-" || C == "+") return 1;
  else if (C == "*" || C == "/") return 2;
  else if (C == "^") return 3;
  return 0;
}

export type NotationOutput = {
  id: number;
  token: string;
  stack: string;
  notation: string;
};

export function infixToPostfix(expression: string, prefix = false) {
  const exp = expression.replace(/\s/g, "");
  let postfix = "";
  const stack: string[] = [];
  const output: NotationOutput[] = [];

  for (let x = 0; x < exp.length; x++) {
    switch (exp.charAt(x)) {
      case "(":
        stack.push("(");
        break;
      case ")": {
        while (stack.length > 0 && stack[stack.length - 1] !== "(") {
          postfix += stack.pop();
        }
        stack.pop();
        break;
      }
      case "+":
      case "-":
      case "*":
      case "/":
      case "^": {
        while (
          stack.length > 0 &&
          getPrecedence(stack[stack.length - 1]) >=
            getPrecedence(exp.charAt(x)) + (prefix ? 1 : 0)
        ) {
          postfix += stack.pop();
        }
        stack.push(exp.charAt(x));
        break;
      }
      default:
        postfix += exp.charAt(x);
    }
    output.push({
      id: x + 1,
      token: exp.charAt(x),
      stack: stack.join(""),
      notation: postfix,
    });
  }
  while (stack.length > 0) {
    postfix += stack.pop();
  }
  output.push({
    id: expression.length + 1,
    token: "",
    stack: "",
    notation: postfix,
  });

  return output;
}

export function postfixToInfix(expression: string) {
  const exp = expression.replace(/\s/g, "");
  const stack: string[] = [];
  const output: NotationOutput[] = [];

  for (let x = 0; x < exp.length; x++) {
    switch (exp.charAt(x)) {
      case "+":
      case "-":
      case "*":
      case "/":
      case "^": {
        const opA = stack.pop();
        const opB = stack.pop();
        stack.push("(" + opB + exp.charAt(x) + opA + ")");
        output.push({
          id: x + 1,
          stack: stack.join(""),
          token: exp.charAt(x),
          notation: stack.join(""),
        });
        break;
      }
      default:
        stack.push(exp.charAt(x));
        output.push({
          id: x + 1,
          stack: stack.join(""),
          token: exp.charAt(x),
          notation: stack.join(""),
        });
    }
  }

  output.push({
    id: output.length + 1,
    stack: "",
    token: "",
    notation: stack.join(""),
  });

  return output;
}

export function infixToPrefix(expression: string) {
  const reverseInfix = expression
    .split("")
    .map((val) => {
      if (val === "(") return ")";
      else if (val === ")") return "(";
      return val;
    })
    .reverse()
    .join("");

  const output = infixToPostfix(reverseInfix, true);

  output.push({
    id: output.length + 1,
    stack: "",
    token: "",
    notation: output[output.length - 1].notation?.split("").reverse().join(""),
  });

  return output;
}

export function prefixToInfix(expression: string) {
  const reversed = expression.split("").reverse().join("");
  const output = postfixToInfix(reversed);

  const reversedPostfix = output[output.length - 1].notation
    .split("")
    .map((val) => {
      if (val === "(") return ")";
      else if (val === ")") return "(";
      return val;
    })
    .reverse()
    .join("");

  output.push({
    id: output.length + 1,
    notation: reversedPostfix,
    stack: "",
    token: "",
  });

  return output;
}

export function prefixToPostfix(expression: string) {
  let infix = prefixToInfix(expression);
  const postfix = infixToPostfix(infix[infix.length - 1].notation);
  return [
    {
      id: 1,
      token: "",
      notation: postfix[postfix.length - 1].notation,
      stack: "",
    },
  ];
}

export function postfixToPrefix(expression: string) {
  let infix = postfixToInfix(expression);
  const prefix = infixToPrefix(infix[infix.length - 1].notation);
  return [
    {
      id: 1,
      token: "",
      notation: prefix[prefix.length - 1].notation,
      stack: "",
    },
  ];
}
