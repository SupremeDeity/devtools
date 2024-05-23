const precendenceTable = [
  {
    token: "+",
    precendence: 1,
  },
  {
    token: "-",
    precendence: 1,
  },
  {
    token: "*",
    precendence: 2,
  },
  {
    token: "/",
    precendence: 2,
  },
  {
    token: "^",
    precendence: 3,
  },
];

export type NotationOutput = {
  id: number;
  token: string;
  stack: string;
  notation: string;
};

export function infixToPostfix(expression: string) {
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
          precendenceTable.find((val) => val.token === stack[stack.length - 1])
            ?.precendence! >=
            precendenceTable.find((val) => val.token === exp.charAt(x))
              ?.precendence!
        ) {
          console.log(
            precendenceTable.find(
              (val) => val.token === stack[stack.length - 1]
            )?.precendence!,
            precendenceTable.find((val) => val.token === exp.charAt(x))
              ?.precendence!
          );
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

  output.push({ id: output.length + 1, stack: "", token: "", notation: stack.join("") });

  return output;
}
