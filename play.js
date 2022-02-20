const gridDivs = Array.from(document.getElementsByClassName("square"));
const keys = Array.from(document.getElementsByClassName("key"));
const errorLabel = document.getElementById("error");
const lottiePlayer = document.getElementById("lottie");

let errorTimeout = 0;

const encryptWord = (word) => {
    let output = "";

    for (let i = 0; i < word.length; i++) {
        output += String.fromCharCode((((word.charCodeAt(i) - "a".charCodeAt(0)) + 13) % 26) + "a".charCodeAt(0))
    }
    
    return output;
}

const getWordFromRow = (ind) =>{
    let output = "";

    for (let i = 0; i < 5; i++) {
        output += gridDivs[ind * 5 + i].textContent.toLowerCase();
    }

    return output;
}

const isWordValid = (word) => {
    return wordlist.includes(word);
}

const showError = (message)=>{
    errorLabel.style.opacity = "1";
    errorLabel.textContent = message;
    clearTimeout(errorTimeout);
    errorTimeout = setTimeout(() => {
        errorLabel.style.opacity = "0";
    }, 3000);
}

const isLetterValid = (letter) => {
    return letter.length === 1 && /^[a-zA-Z]+$/.test(letter);
}

const updateColors = (row) => {
    let letters = new Set();
    let lettersInPlace = new Set();
    let lettersInWord = new Set();

    for (let i = 0; i < row * cellsPerRow; i++) {
        let letter = gridDivs[i].textContent.toLowerCase();

        letters.add(letter);
        if(word[i % cellsPerRow] === letter){
            lettersInPlace.add(letter);
        } else if(word.includes(letter)){
            lettersInWord.add(letter);
        }
    }

    for (let i = 0; i < row * cellsPerRow; i++) {
        let letter = gridDivs[i].textContent.toLowerCase();
        if(word[i % cellsPerRow] === letter) {
            gridDivs[i].style.color = "green";
        } else if(lettersInWord.has(letter)){
            gridDivs[i].style.color = "yellow";
        } else if(letters.has(letter)){
            gridDivs[i].style.color = "gray";
        } else{
            gridDivs[i].style.color = "lightgray";
        }
    }

    for (const key of keys) {
        let letter = key.textContent.toLowerCase();

        if(lettersInPlace.has(letter)) {
            key.style.color = "green";
        } else if(lettersInWord.has(letter)){
            key.style.color = "yellow";
        } else if(letters.has(letter)){
            key.style.color = "gray";
        } else{
            key.style.color = "lightgray";
        }
    }
}

const handleLetter = (letter)=>{
    letter = letter.toLowerCase();
    let currentWord = getWordFromRow(Math.floor(currentCell / cellsPerRow));

    if(currentCell >= cellsPerRow * cellsPerRow){
        return;
    }

    if(letter == "enter"){
        if(currentCell % cellsPerRow !== cellsPerRow - 1){
            showError("Not enough letters");
        } else if(!isWordValid(currentWord)) {
            showError("Invalid Word");
        } else {
            currentCell++;
            updateColors(Math.floor(currentCell / cellsPerRow));

            // Win state
            if(currentWord === word){
                currentCell = cellsPerRow * cellsPerRow;
                lottiePlayer.style.display = "block";
            }
        }
    } else if(letter == "backspace" || letter === ""){
        gridDivs[currentCell].textContent = "";

        if(currentCell % cellsPerRow !== 0){
            currentCell--;
        }

        gridDivs[currentCell].textContent = "";
    } else if(gridDivs[currentCell].textContent === "" && isLetterValid(letter)) {
        gridDivs[currentCell].textContent = letter.toUpperCase();

        if(currentCell % cellsPerRow !== cellsPerRow - 1){
            currentCell++;
        }
    }
}

let currentCell = 0;
const cellsPerRow = 5;
const word = encryptWord(document.location.hash.slice(1));
console.log(word);

for (const key of keys) {
    key.addEventListener("click", (event) => {
        handleLetter(event.target.textContent);
    });
}

document.addEventListener("keydown", (event) => {
    handleLetter(event.key);
});

