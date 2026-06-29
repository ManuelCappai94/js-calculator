const keyInput = document.getElementById("display");

keyInput.addEventListener("keydown", function (numberEnter) {
    if (numberEnter.code === 0, 1, 2, 3, 4, 5, 6, 7, 8, 9){
        console.log("the inserted number was:" +numberEnter.key);
    }
});

