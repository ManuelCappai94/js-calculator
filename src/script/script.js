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


initCalcDigits()