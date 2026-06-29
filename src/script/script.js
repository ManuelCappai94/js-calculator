const calcButtons = document.querySelector(".calcButtons")


function initCalcDigits(){
    calcButtons.addEventListener("click", (e)=>{
      const digit =  e.target.closest("[data-number]")
      const operator = e.target.closest("[data-operator]")

    //   if(!digit)return
    //   console.log(digit.dataset.number, operator.dataset.operator)
    if(digit){
        console.log(digit.dataset.number)
        return
    }
    if(operator){
        console.log(operator.dataset.operator)
        return
    }
    })
}
console.log(calcButtons)

initCalcDigits()