const keyInput = document.getElementById("display");

export function initKeyboard(){
    keyInput.addEventListener("keydown", function (numberEnter) {
    if (numberEnter.code === 0, 1, 2, 3, 4, 5, 6, 7, 8, 9) {
        // document.getElementById("display").innerHTML = console.log('key pressed' + numberEnter);
    }
});
}

