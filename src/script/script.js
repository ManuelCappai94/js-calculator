import { initKeyboard } from "./keyboard_input.js"

const calcButtons = document.querySelector(".calcButtons")

let currentInput = ""


function initCalcDigits(){
    calcButtons.addEventListener("click", (e)=>{
      const digit =  e.target.closest("[data-number]")
      const operator = e.target.closest("[data-operator]")
      const actionBtns = e.target.closest("[data-action]")

    //   if(!digit)return
    //   console.log(digit.dataset.number, operator.dataset.operator)
    if(digit){
        // console.log(digit.dataset.number)
        currentInput += digit.dataset.number
        console.log(currentInput)
        return
    }
    if(operator){
        console.log(operator.dataset.operator)
        return
    }
    if(actionBtns){
        console.log(actionBtns.dataset.action)
        return
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
        document.querySelector('[data-operator="+"]').click();
    }

        if (event.key === "-") {
        document.querySelector('[data-operator="-"]').click();
    }

        if (event.key === "*") {
        document.querySelector('[data-operator="*]').click();
    }

        if (event.key === "/") {
        document.querySelector('[data-operator="/"]').click();
    }

    //Enter = equals
    if(event.key === "Enter"){
        document.querySelector('[data-operator="equals"]').click();
    }

    // Backspace = undo
    if(event.key === "Backspace"){
        document.querySelector('[data-operator="undo"]').click();
    }

    //Escape = clear
    if(event.key === "Escape"){
        doctype.querySelector('[data-action]="clear').click();
    }
});

function clearDisplay(){
    currentInput = '';
    previousInput = '';
    currentOperation = '';
    document.getElementById('display').value ='';
}


initKeyboard()
initCalcDigits()