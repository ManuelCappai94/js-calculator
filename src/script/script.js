import { initKeyboard } from "./keyboard_input.js"

const calcButtons = document.querySelector(".calcButtons")
const display = document.querySelector("#display")
const decimalBtn = document.querySelector('[data-action="decimal"]')

const calcuator = {
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false,
  hasError: false,
};

let currentInput = "";

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


const SNARKY_DIVIDE_BY_ZERO = "Can't divide by 0.";

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
function formatResult(n) {
  if (!isFinite(n)) return "ERROR";

  let rounded = Math.round((n + Number.EPSILON) * 1e9) / 1e9;
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


function updateDisplay(value) {
  if (display) {
    display.value = String(value);
    // Force the visible scroll position to the end, so the rightmost
    // (most recently typed) digits stay in view instead of the start.
    display.scrollLeft = display.scrollWidth;
  }
  console.log(value);
}

function enableDecimalButton() {
  if (decimalBtn) decimalBtn.disabled = false;
}

function disableDecimalButton() {
  if (decimalBtn) decimalBtn.disabled = true;
}

function resetCalculator() {
  calcuator.firstOperand = null;
  calcuator.operator = null;
  calcuator.waitingForSecondOperand = false;
  calcuator.hasError = false;
  currentInput = "";
  enableDecimalButton();
  updateDisplay("0");
}

function initCalcDigits() {
  calcButtons.addEventListener("click", (e) => {
    const digit = e.target.closest("[data-number]");
    const operator = e.target.closest("[data-operator]");
    const actionBtn = e.target.closest("[data-action]");

    // If we're in an error state, any press except "clear" resets first.
    if (calcuator.hasError && !(actionBtn && actionBtn.dataset.action === "clear")) {
      resetCalculator();
    }

    if (digit) {
      currentInput += digit.dataset.number;
      updateDisplay(currentInput);
      return;
    }

    if (operator) {
      if (currentInput === "" && calcuator.firstOperand === null) return;

      if (calcuator.firstOperand === null) {
        calcuator.firstOperand = Number(currentInput);
      } else if (currentInput !== "") {
        const secondOperand = Number(currentInput);
        const result = operate(calcuator.operator, calcuator.firstOperand, secondOperand);

        if (result === "ERROR") {
          updateDisplay(SNARKY_DIVIDE_BY_ZERO);
          calcuator.hasError = true;
          return;
        }

        const displayValue = formatResult(result);
        calcuator.firstOperand = Number(displayValue);
        updateDisplay(displayValue);
      }

      calcuator.operator = operator.dataset.operator;
      currentInput = "";
      calcuator.waitingForSecondOperand = true;
      enableDecimalButton();
      return;
    }

    if (actionBtn && actionBtn.dataset.action === "equals") {
      if (calcuator.operator === null || currentInput === "") return;

      const secondOperand = Number(currentInput);
      const result = operate(calcuator.operator, calcuator.firstOperand, secondOperand);

      if (result === "ERROR") {
        updateDisplay(SNARKY_DIVIDE_BY_ZERO);
        calcuator.hasError = true;
        return;
      }

      const displayValue = formatResult(result);
      updateDisplay(displayValue);

      calcuator.firstOperand = Number(displayValue);
      calcuator.operator = null;
      calcuator.waitingForSecondOperand = false;
      currentInput = "";
      enableDecimalButton();
      return;
    }

    if (actionBtn && actionBtn.dataset.action === "clear") {
      resetCalculator();
      return;
    }

    if (actionBtn && actionBtn.dataset.action === "decimal") {
      if (currentInput.includes(".")) return;
      currentInput += currentInput === "" ? "0." : ".";
      disableDecimalButton();
      updateDisplay(currentInput);
      return;
    }

    if (actionBtn && actionBtn.dataset.action === "undo") {
      currentInput = currentInput.slice(0, -1);

      if (!currentInput.includes(".")) enableDecimalButton();

      updateDisplay(currentInput === "" ? "0" : currentInput);
      return;
    }
  });
}

function initScrollButtons() {
  document.addEventListener("click", (e) => {
    const scrollBtn = e.target.closest("[data-scroll]");
    if (!scrollBtn || !display) return;

    const amount = 40; // pixels per click, tune to taste
    if (scrollBtn.dataset.scroll === "left") {
      display.scrollLeft -= amount;
    } else if (scrollBtn.dataset.scroll === "right") {
      display.scrollLeft += amount;
    }
  });
}

// keyboard event listeners
document.addEventListener("keydown", function (event) {

    if (event.key >= "0" && event.key <= "9") {
        const button = document.querySelector(`[data-number="${event.key}"]`);
        if (button) button.click();
        return;
    }

    if (event.key === "+") {
        const btn = document.querySelector('[data-operator="+"]');
        if (btn) btn.click();
        return;
    }

    if (event.key === "-") {
        const btn = document.querySelector('[data-operator="-"]');
        if (btn) btn.click();
        return;
    }

    if (event.key === "*") {
        const btn = document.querySelector('[data-operator="*"]');
        if (btn) btn.click();
        return;
    }

    if (event.key === "/") {
        const btn = document.querySelector('[data-operator="/"]');
        if (btn) btn.click();
        return;
    }

    // Enter = equals
    if (event.key === "Enter") {
        const btn = document.querySelector('[data-action="equals"]');
        if (btn) btn.click();
        return;
    }

    // Backspace = undo
    if (event.key === "Backspace") {
        const btn = document.querySelector('[data-action="undo"]');
        if (btn) btn.click();
        return;
    }

    // Escape = clear
    if (event.key === "Escape") {
        const btn = document.querySelector('[data-action="clear"]');
        if (btn) btn.click();
        return;
    }
});



initScrollButtons()
initKeyboard()
initCalcDigits()
