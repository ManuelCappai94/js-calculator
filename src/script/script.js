import {
    operate,
    formatResult
} from "./calculatorOperations.js"

const container = document.querySelector(".calculator")
const calcButtons = container.querySelector(".calcButtons")
const calcDisplay = container.querySelector(".calcDisplay")
const decimalBtn = calcButtons.querySelector('[data-action="decimal"]')

const SNARKY_DIVIDE_BY_ZERO = "Can't divide by 0.";

const calculator = {
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false,
  hasError: false,
};

let currentInput = "";

function resetCalculator() {
  calculator.firstOperand = null;
  calculator.operator = null;
  calculator.waitingForSecondOperand = false;
  calculator.hasError = false;

  currentInput = "";

  setDecimalButtonEnabled(true);
  updateDisplay("0");
}


<<<<<<< Updated upstream
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


=======
>>>>>>> Stashed changes
function updateDisplay(value) {
  if (calcDisplay) {
    calcDisplay.value = String(value);
    // Force the visible scroll position to the end, so the rightmost
    // (most recently typed) digits stay in view instead of the start.
    calcDisplay.scrollLeft = calcDisplay.scrollWidth;
  }
}

// function enableDecimalButton() {
//   if (decimalBtn) decimalBtn.disabled = false;
// }

// function disableDecimalButton() {
//   if (decimalBtn) decimalBtn.disabled = true;
// }

function setDecimalButtonEnabled(isEnabled){
  if (!decimalBtn) return;
  decimalBtn.disabled = !isEnabled
}

function handleDigit(number) {
    currentInput += number;
    updateDisplay(currentInput);
}

function handleOperator(nextOperator){
  if (currentInput === "" && calculator.firstOperand === null) return;

  if (calculator.firstOperand === null) {
        calculator.firstOperand = Number(currentInput);
    } else if (currentInput !== "") {
        const secondOperand = Number(currentInput);

        const result = operate(
          calculator.operator,
           calculator.firstOperand,
            secondOperand
          );

        if (result === "ERROR") {
          updateDisplay(SNARKY_DIVIDE_BY_ZERO);
          calculator.hasError = true;
          return;
        }

        const displayValue = formatResult(result);

        calculator.firstOperand = Number(displayValue);
        updateDisplay(displayValue);
      }

      calculator.operator = nextOperator;
      currentInput = "";
      calculator.waitingForSecondOperand = true;
      setDecimalButtonEnabled(true);
}

function calculate(){
  if (calculator.operator === null || currentInput === "") return;

    const secondOperand = Number(currentInput);

    const result = operate(
        calculator.operator,
        calculator.firstOperand,
        secondOperand
      );

    if (result === "ERROR") {
      updateDisplay(SNARKY_DIVIDE_BY_ZERO);
      calculator.hasError = true;
      return;
    }

    const displayValue = formatResult(result);

    updateDisplay(displayValue);

    calculator.firstOperand = Number(displayValue);
    calculator.operator = null;
    calculator.waitingForSecondOperand = false;

    currentInput = "";
    setDecimalButtonEnabled(true);
}

function inputDecimal(){
  if (currentInput.includes(".")) return;

  currentInput += currentInput === "" ? "0." : ".";
  setDecimalButtonEnabled(false);
  updateDisplay(currentInput);
}

function inputUndo(){
  currentInput = currentInput.slice(0, -1);

  if (!currentInput.includes(".")){
    setDecimalButtonEnabled(true);
  } 

  updateDisplay(currentInput === "" ? "0" : currentInput);
}

function handleActionBtn(action){
  if(action === "clear"){
    resetCalculator();
    return
  }
  if(action === "equals"){
    calculate()
    return
  }
  if(action === "decimal"){
    inputDecimal()
    return
  }
  if(action === "undo"){
    inputUndo()
  }
}

function initCalcDigits() {
  calcButtons.addEventListener("click", (e) => {
    const digit = e.target.closest("[data-number]");
    const operator = e.target.closest("[data-operator]");
    const actionBtn = e.target.closest("[data-action]");

    // If we're in an error state, any press except "clear" resets first.
    if(calculator.hasError && actionBtn?.dataset.action !== "clear"){
      resetCalculator();
    }

    if (digit) {
      handleDigit(digit.dataset.number)
      return;
    }

    if (operator) {
      handleOperator(operator.dataset.operator)
      return;
    }

    if(actionBtn){
      handleActionBtn(actionBtn.dataset.action)
    }
  });
}

<<<<<<< Updated upstream
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
=======
//keyboard event listeners
// document.addEventListener("keydown", function (event) {

//     if (event.key >= "0" && event.key <= "9") {
//         const button = document.querySelector(`[data-number="${event.key}"]`);
//         button.click();
//     }

//     if (event.key === "+") {
//         document.querySelector('[data-operator="+"]').click();
//     }

//         if (event.key === "-") {
//         document.querySelector('[data-operator="-"]').click();
//     }

//         if (event.key === "*") {
//         document.querySelector('[data-operator="*]').click();
//     }

//         if (event.key === "/") {
//         document.querySelector('[data-operator="/"]').click();
//     }

//     //Enter = equals
//     if(event.key === "Enter"){
//         document.querySelector('[data-operator="equals"]').click();
//     }

//     // Backspace = undo
//     if(event.key === "Backspace"){
//         document.querySelector('[data-operator="undo"]').click();
//     }

//     //Escape = clear
//     if(event.key === "Escape"){
//         doctype.querySelector('[data-action]="clear').click();
//     }
// });


>>>>>>> Stashed changes
initCalcDigits()
