const userInputText = document.getElementsByClassName('form-control')[0];
const words = document.getElementsByClassName('word'); //p tag elements containing words inside p tags
const wordsDiv = document.getElementsByClassName('words-div');

var pushedWords = []; //array containing all words on screen
var currentWord; //what word user needs to spell
var currentChar = 0; //what char in the word being spelled is user on ['c (0)', 'a (1)', 't (2)']
var correctSpelling = []; //contains all the chars of the current word ['c', 'a', 't']
var onWordsDiv = 0; //which inline-div the user is on, used for highlighting word that needs to be spelled

function printDetails() {
    console.log('The current word to spell is ' + currentWord);
    console.log('The char needed to spell in ' + currentWord + ' is at index ' + currentChar);
    console.log('The correct spelling of this word is ' + correctSpelling);
}

function highlightWord() {
    //highlights first words on page load
    if(onWordsDiv == 0) {
        wordsDiv[onWordsDiv].style.backgroundColor = '#007bff';
        wordsDiv[onWordsDiv].style.color = 'white';
        wordsDiv[onWordsDiv].style.borderRadius = '10px';
        words[onWordsDiv].style.fontSize = '25px';
    } else {
        //remove highlight on previous word
        wordsDiv[onWordsDiv-1].style.backgroundColor = 'white';
        wordsDiv[onWordsDiv-1].style.color = 'black';
        wordsDiv[onWordsDiv-1].style.borderRadius = '0px';
        words[onWordsDiv-1].style.fontSize = '20px';
        //highlight current word to be spelled
        wordsDiv[onWordsDiv].style.backgroundColor = '#007bff';
        wordsDiv[onWordsDiv].style.color = 'white';
        wordsDiv[onWordsDiv].style.borderRadius = '10px';
        words[onWordsDiv].style.fontSize = '25px';
    }
}

function checkCharacter(char) {
    var span = document.createElement('span');
    span.innerText = char;
    span.style.color = 'red';
    var word = words[onWordsDiv].innerText;
    if(char == correctSpelling[currentChar]) {
        alert('Correct!')
        var replaceChar = word.replace(word[currentChar], span);
        console.log(replaceChar);
        words[onWordsDiv].innerText = replaceChar;
    } else {
        alert('Wrong!');
    }
}

window.onload = () => {
    //pushes all words to be spelled into array
    for(i=0; i<words.length; ++i) {
        pushedWords.push(words[i].innerText);
    }
    console.log(pushedWords);
    currentWord = pushedWords[0];
    correctSpelling = currentWord.split('');
    highlightWord();
    printDetails();
}

//click listener on input text
userInputText.addEventListener('click', () => {
    userInputText.setAttribute('placeholder', '');
})

//onkeydown listener on input text 
userInputText.addEventListener('keydown', (x) => {
    //user presses space 
    if(x.keyCode === 32) {
        onWordsDiv += 1;
        //user presses space after last word, ends test
        if(onWordsDiv == 100) {
            alert('test done');
            location.reload();
        } else {
            userInputText.value = '';
            pushedWords.shift();
            currentWord = pushedWords[0];
            correctSpelling = currentWord.split('');
            printDetails();
            highlightWord();
        }
    //user presses backspace
    } else if(x.keyCode === 8) {
        //if input bar is blank, don't do anything
        if(userInputText.value == '') {
            
        } else {
            
        }
    //user typing word
    } else {
        checkCharacter(x.key);
    }
})
