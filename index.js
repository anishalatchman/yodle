const copyButton = document.getElementById("copy");
const shareButton = document.getElementById("share");
const linkLabel = document.getElementById("link");
const keys = Array.from(document.getElementsByClassName("key"));
const gridDivs = Array.from(document.getElementsByClassName("square"));

const encryptWord = (word) => {
    let output = "";

    for (let i = 0; i < word.length; i++) {
        output += String.fromCharCode((((word.charCodeAt(i) - "a".charCodeAt(0)) + 13) % 26) + "a".charCodeAt(0))
    }
    
    return output;
}

const isWordValid = (word) => {
    return wordlist.includes(word);
}

const isLetterValid = (letter) => {
    return letter.length === 1 && /^[a-zA-Z]+$/.test(letter);
}

const getWord = () =>{
    let output = "";

    for (let i = 0; i < 5; i++) {
        output += gridDivs[i].textContent.toLowerCase();
    }

    return output;
}
 
shareButton.addEventListener("click", () => {
    navigator.share({url: linkLabel.textContent});
});

copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(linkLabel.textContent);
});

let currentCell = 0;
const cellsPerRow = 5;

const handleLetter = (letter) => {
    letter = letter.toLowerCase();
    linkLabel.href = "#";
    linkLabel.textContent = "";

    if(letter == "enter"){
        if(currentCell !== cellsPerRow - 1){
            linkLabel.tabIndex = -1;
            linkLabel.href = "#";
            linkLabel.textContent = "Not enough letters";
        } else if(!isWordValid(getWord())) {
            linkLabel.tabIndex = -1;
            linkLabel.href = "#";
            linkLabel.textContent = "Invalid word";
        }
    } else if(letter == "backspace" || letter === ""){
        if(currentCell < cellsPerRow)
            gridDivs[currentCell].textContent = "";

        if(currentCell !== 0){
            currentCell--;
        }

        gridDivs[currentCell].textContent = "";
    } else if(currentCell < cellsPerRow && gridDivs[currentCell].textContent === "" && isLetterValid(letter)) {
        gridDivs[currentCell].textContent = letter.toUpperCase();
        currentCell++;
    }

    if(currentCell >= cellsPerRow){
        if(isWordValid(getWord())){
            linkLabel.tabIndex = 0;
            let link = `${document.location.origin}/play.html#${encryptWord(getWord())}`;
            linkLabel.href = link;
            linkLabel.textContent = link;
        }else{
            linkLabel.tabIndex = -1;
            linkLabel.href = "#";
            linkLabel.textContent = "Invalid word";
        }
    }
}

for (const key of keys) {
    key.addEventListener("click", (event) => {
        handleLetter(event.target.textContent);
    });
}

document.addEventListener("keydown", (event) => {
    handleLetter(event.key);
});