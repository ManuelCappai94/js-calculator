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

<<<<<<< HEAD

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
  if (display) display.value = value;
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

=======
//mouse-click event listeners
>>>>>>> 92cb0a80a1242fda997c397a4652ee95843aff0b
function initCalcDigits() {
    calcButtons.addEventListener("click", (e) => {
        const digit = e.target.closest("[data-number]")
        const operator = e.target.closest("[data-operator]")
        const actionBtns = e.target.closest("[data-action]")

        //   if(!digit)return
        //   console.log(digit.dataset.number, operator.dataset.operator)
        if (digit) {
            // console.log(digit.dataset.number)
            currentInput += digit.dataset.number
            console.log(currentInput)
            return
        }
        if (operator) {
            console.log(operator.dataset.operator)
            return
        }
        if (actionBtns) {
            console.log(actionBtns.dataset.action)
            return
        }

        if (actionBtns) {
            switch (actionBtns.dataset.action) {
                case "decimal":
                    addDecimal();
                    break;

                case "clear":
                    clearCalculatorDisplay();
                    break;
                case undo:
                    break;
            }

            return;
        }
    })
}

<<<<<<< HEAD
initKeyboard();
initCalcDigits();

=======
>>>>>>> 92cb0a80a1242fda997c397a4652ee95843aff0b
//keyboard event listeners
document.addEventListener("keydown", function (event) {

    if (event.key >= "0" && event.key <= "9") {
        const button = document.querySelector(`[data-number="${event.key}"]`);
        button.click();
    }

    if (event.key === "+") {
        document.querySelector('[data-action="+"]').click();
    }

    if (event.key === "-") {
        document.querySelector('[data-action="-"]').click();
    }

    if (event.key === "*") {
        document.querySelector('[data-action="*"]').click();
    }

    if (event.key === "/") {
        document.querySelector('[data-action="/"]').click();
    }

    //Enter = equals
    if (event.key === "Enter") {
        document.querySelector('[data-action="equals"]').click();
    }

    if(event.key === "."){
        document.querySelector('[data-action="."]').click();
    }

    // Backspace = undo
    if (event.key === "Backspace") {
        document.querySelector('[data-action="undo"]').click();
    }

    //Escape = clear
    if (event.key === "Escape") {
        document.querySelector('[data-action="clear"]').click();
    }
});

//decimal numbers
function addDecimal() {
    if (currentInput === "") {
        currentInput = "0.";
    }
    else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    display.value = currentInput;
}

//To clear the calculator
function clearCalculatorDisplay() {
    currentInput = '';
    previousInput = '';
    currentOperation = '';
    document.getElementById('display').value = '';
}

if (calcButtons.dataset.action === "clear") {
    clearCalculatorDisplay();
}

initKeyboard()
initCalcDigits()
