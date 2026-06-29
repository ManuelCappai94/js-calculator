function add(num1, num2) {
  return num1 + num2;
}
function subtract(num1, num2) {
  return num1 - num2;
}
function multiply(num1, num2) {
  return num1 * num2;
}
function divide(num1, num2) {
  return num1 / num2;
}

function operate(operator, num1, num2) {
  switch (operator) {
    case "+": return add(num1, num2);
    case "-": return subtract(num1, num2);
    case "*": return multiply(num1, num2);
    case "/":
      if (num2 === 0) return "ERROR"; // sentinel, handled by caller
      return divide(num1, num2);
    default: return num2;
  }
}


// Round off floating point noise, and keep the string short enough not to overflow the display.
// THIS FUNCTION IS A VERY GOOD CALL
// YES we have to remove these comments, don't forget
function formatResult(result) {
  if (!isFinite(result)) return "ERROR";

  let rounded = Math.round((result + Number.EPSILON) * 1e9) / 1e9;
  let str = String(rounded);

  const digitCount = str.replace("-", "").replace(".", "").length;
  if (digitCount > 12) {
    if (Math.abs(rounded) >= 1e9 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
      str = rounded.toExponential(4);
    } else {
      str = String(Number(rounded.toPrecision(10)));
    }
  }
  return str;
}

export {
    operate,
    formatResult
}