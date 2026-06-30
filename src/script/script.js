import { operate, formatResult } from "./calculatorOperations.js"

const mainContainer = document.querySelector(".calculator-container");
const calcContainer = mainContainer.querySelector(".calculator");
const calcButtons = calcContainer.querySelector(".calcButtons");
const calcDisplay = calcContainer.querySelector(".calcDisplay");
const decimalBtn = calcButtons.querySelector('[data-action="decimal"]');

const operationOverview = mainContainer.querySelector(".operation-overview");
const historyContainer = operationOverview.querySelector(".history-container");
const calculationHistoryList = historyContainer.querySelector(".calculation-history");
const operationPreview = operationOverview.querySelector(".operation-preview");
const clearHistoryBtn = operationOverview.querySelector('[data-action="clear-history"]');
const operatorIndicator = calcContainer.querySelector(".operator-indicator");

const SNARKY_DIVIDE_BY_ZERO = "Can't divide by 0.";

const calculator = {
  firstOperand: null,
  operator: null,
  waitingForSecondOperand: false,
  hasError: false,
  justCalculated: false,
  lastOperation: null
};

let currentInput = "";
let calculationHistory = [];

function resetCalculator() {
  calculator.firstOperand = null;
  calculator.operator = null;
  updateOperatorIndicator();
  calculator.waitingForSecondOperand = false;
  calculator.hasError = false;
  calculator.justCalculated = false;
  calculator.lastOperation = null;

  currentInput = "";

  setDecimalButtonEnabled(true);
  updateDisplay("0");
}

function startNewCalculationAfterResult() {
  if (!calculator.justCalculated) return;

  calculator.firstOperand = null;
  calculator.operator = null;
  calculator.waitingForSecondOperand = false;
  calculator.justCalculated = false;
  calculator.lastOperation = null;

  currentInput = "";
}

function updateOperationPreview() {
  if (!operationPreview) return

  if (
    calculator.firstOperand === null &&
    calculator.operator === null &&
    currentInput === ""
  ) {
    operationPreview.textContent = "No current operation.";
    return;
  }

  operationPreview.textContent = `
  ${calculator.firstOperand ?? currentInput}
  ${calculator.operator ?? ""} 
  ${calculator.waitingForSecondOperand ? currentInput : ""} 
  ${calculator.lastOperation ? ` = ${calculator.lastOperation.result}` : ""}
  `
}

function renderCalculationHistory() {
  if (!calculationHistoryList) return;

  calculationHistoryList.textContent = "";

  calculationHistory.forEach((operation) => {
    const historyItem = document.createElement("li");

    historyItem.textContent = `${operation.firstOperand} ${operation.operator} ${operation.secondOperand} = ${operation.result}`;

    calculationHistoryList.appendChild(historyItem);
  });
}

function updateDisplay(value) {
  if (calcDisplay) {
    calcDisplay.value = String(value);
    // Force the visible scroll position to the end, so the rightmost
    // (most recently typed) digits stay in view instead of the start.
    calcDisplay.scrollLeft = calcDisplay.scrollWidth;
  }
  updateOperationPreview();
}

function setDecimalButtonEnabled(isEnabled) {
  if (!decimalBtn) return;
  decimalBtn.disabled = !isEnabled
}

function handleDigit(number) {
  startNewCalculationAfterResult();
  currentInput += number;
  updateDisplay(currentInput);
}

function handleOperator(nextOperator) {
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

    const completedOperation = {
      firstOperand: calculator.firstOperand,
      operator: calculator.operator,
      secondOperand,
      result: displayValue,
    };

    calculationHistory.push(completedOperation);
    renderCalculationHistory();

    calculator.firstOperand = Number(displayValue);
    updateDisplay(displayValue);
  }

  calculator.operator = nextOperator;
  updateOperatorIndicator();
  currentInput = "";
  calculator.waitingForSecondOperand = true;
  calculator.justCalculated = false;

  setDecimalButtonEnabled(true);
  updateOperationPreview()
}

function calculate() {
  if (calculator.operator === null || currentInput === "") return;
  

  const secondOperand = Number(currentInput);

  const result = operate(
    calculator.operator,
    calculator.firstOperand,
    secondOperand
  );

  if (result === "ERROR") {
    calculator.lastOperation = {
      firstOperand: calculator.firstOperand,
      operator: calculator.operator,
      secondOperand,
      result: SNARKY_DIVIDE_BY_ZERO,
    };

    updateDisplay(SNARKY_DIVIDE_BY_ZERO);
    calculator.hasError = true;
    return;
  }

  const displayValue = formatResult(result);

  updateDisplay(displayValue);

  const completedOperation = calculator.lastOperation = {
    firstOperand: calculator.firstOperand,
    operator: calculator.operator,
    secondOperand,
    result: displayValue,
  };

  updateOperationPreview()
  calculator.lastOperation = completedOperation;
  calculationHistory.push(completedOperation);

  renderCalculationHistory();

  calculator.firstOperand = Number(displayValue);
  calculator.operator = null;
  updateOperatorIndicator();
  calculator.waitingForSecondOperand = false;
  calculator.justCalculated = true;
  calculator.lastOperation = null;

  currentInput = "";
  setDecimalButtonEnabled(true);

}

function inputDecimal() {
  startNewCalculationAfterResult();

  if (currentInput.includes(".")) return;

  currentInput += currentInput === "" ? "0." : ".";
  setDecimalButtonEnabled(false);
  updateDisplay(currentInput);
}

function inputUndo() {
  currentInput = currentInput.slice(0, -1);

  if (!currentInput.includes(".")) {
    setDecimalButtonEnabled(true);
  }

  updateDisplay(currentInput === "" ? "0" : currentInput);
}

function handleActionBtn(action) {
  if (action === "clear") {
    resetCalculator();
    return
  }
  if (action === "equals") {
    calculate()
    return
  }
  if (action === "decimal") {
    inputDecimal()
    return
  }
  if (action === "undo") {
    inputUndo()
  }
  if (action === "clear-history") {
    clearHistory();
    return;
  }
}

function initCalcDigits() {
  calcButtons.addEventListener("click", (e) => {
    const digit = e.target.closest("[data-number]");
    const operator = e.target.closest("[data-operator]");
    const actionBtn = e.target.closest("[data-action]");

    // If we're in an error state, any press except "clear" resets first.
    if (calculator.hasError && actionBtn?.dataset.action !== "clear") {
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

    if (actionBtn) {
      handleActionBtn(actionBtn.dataset.action)
    }
  });
}

function initScrollButtons() {
  document.addEventListener("click", (e) => {
    const scrollBtn = e.target.closest("[data-scroll]");
    if (!scrollBtn || !calcDisplay) return;

    const amount = 40; // pixels per click, tune to taste
    if (scrollBtn.dataset.scroll === "left") {
      calcDisplay.scrollLeft -= amount;
    } else if (scrollBtn.dataset.scroll === "right") {
      calcDisplay.scrollLeft += amount;
    }


  });
}

function initKeyboardInput() {
  document.addEventListener("keydown", function (event) {

    const isClearKey = event.key === "Escape";

    const isCalculatorKey =
      (event.key >= "0" && event.key <= "9") ||
      event.key === "." ||
      event.key === "+" ||
      event.key === "-" ||
      event.key === "*" ||
      event.key === "/" ||
      event.key === "Enter" ||
      event.key === "=" ||
      event.key === "Backspace" ||
      event.key === "Escape";

    if (!isCalculatorKey) return;

    if (calculator.hasError && !isClearKey) {
      resetCalculator();
    }

    if (event.key >= "0" && event.key <= "9") {
      handleDigit(event.key);
      return;
    }

    if (event.key === ".") {
      handleActionBtn("decimal");
      return;
    }

    if (event.key === "+") {
      handleOperator("+");
      return;
    }

    if (event.key === "-") {
      handleOperator("-");
      return;
    }

    if (event.key === "*") {
      handleOperator("*");
      return;
    }

    if (event.key === "/") {
      event.preventDefault()

      handleOperator("/");
      return;
    }

    if (event.key === "Enter" || event.key === "=") {
      event.preventDefault()

      handleActionBtn("equals");
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault()

      handleActionBtn("undo");
      return;
    }

    if (event.key === "Escape") {
      handleActionBtn("clear");
      return;
    }
  });
}

function renderEmptyHistoryMessage() {
  if (!calculationHistoryList) return;

  calculationHistoryList.textContent = "";

  const emptyMessage = document.createElement("li");
  emptyMessage.classList.add("empty-history-message");
  emptyMessage.textContent = "No calculations yet.";

  calculationHistoryList.appendChild(emptyMessage);
}
function clearHistory() {
  calculationHistory = [];
  calculator.lastOperation = null;

  renderEmptyHistoryMessage();
  updateOperationPreview();
}

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", clearHistory);
}


function updateOperatorIndicator() {
  if (!operatorIndicator) return;

  operatorIndicator.textContent = calculator.operator || "";
  operatorIndicator.hidden = !calculator.operator;
}


resetCalculator()
initScrollButtons()
initCalcDigits()
initKeyboardInput()