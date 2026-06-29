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

//mouse-click event listeners
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
