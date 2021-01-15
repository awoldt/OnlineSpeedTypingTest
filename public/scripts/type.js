const userInputText = document.getElementsByClassName('form-control')[0];
const words = document.getElementsByClassName('word'); //p tag elements containing words inside p tags
const wordsDiv = document.getElementsByClassName('words-div');
const demoDiv = document.getElementById('demo-div');
const container = document.getElementsByClassName('container')[0];

var pushedWords = []; //array containing all words on screen
var currentWord; //what word user needs to spell
var currentChar = 0; //what char in the word being spelled is user on ['c (0)', 'a (1)', 't (2)']
var correctSpelling = []; //contains all the chars of the current word ['c', 'a', 't']
var onWordsDiv = 0; //which inline-div the user is on, used for highlighting word that needs to be spelled
var addedChars = []; //chars user has typed so far 

var startTest = false; //defaults to false, true on first char user types
var charsTyped = 0; //total amount of chars user has typed on screen
var correctChars = 0;
var correctIndex = []; //used to identify what index a correctChar was typed at. used for calculation of score after user backspaces
var accuracyPoints = 'n/a'; 
var correctPoints = 0;
var incorrectPoints = 0;

var timer;

//visual cue on which word is the current word to be spelled
function highlightWord() {
    //highlights first words on page load
    if(onWordsDiv == 0) {
        wordsDiv[onWordsDiv].style.backgroundColor = '#007bff';
        wordsDiv[onWordsDiv].style.color = 'white';
        wordsDiv[onWordsDiv].style.borderRadius = '10px';
        wordsDiv[onWordsDiv].setAttribute('id', 'highlighted-word');
        words[onWordsDiv].style.fontSize = '35px';
        words[onWordsDiv].classList.remove('text-secondary');
    } else {
        //remove highlight on previous word
        wordsDiv[onWordsDiv-1].style.backgroundColor = 'white';
        wordsDiv[onWordsDiv-1].style.color = 'black';
        wordsDiv[onWordsDiv-1].style.borderRadius = '0px';
        wordsDiv[onWordsDiv-1].removeAttribute('id');
        words[onWordsDiv-1].style.fontSize = '20px';
        //highlight current word to be spelled
        wordsDiv[onWordsDiv].style.backgroundColor = '#007bff';
        wordsDiv[onWordsDiv].style.color = 'white';
        wordsDiv[onWordsDiv].style.borderRadius = '10px';
        wordsDiv[onWordsDiv].setAttribute('id', 'highlighted-word');
        words[onWordsDiv].style.fontSize = '35px';
        words[onWordsDiv].classList.remove('text-secondary');
    }
    //places maxlength restriction on userinput
    var userInputLength = words[onWordsDiv].innerText.length;
    userInputText.maxLength = userInputLength;
}

function calculateScore(char) {
    if(char == 'correct') {
        correctIndex.push(currentChar);
        charsTyped += 1;
        correctChars += 1;
        score = (correctChars/charsTyped) * 100;
        var x = score.toFixed(2);
        accuracyPoints = x;
        document.getElementById('accuracy-span').innerText = accuracyPoints + '%';
    } else if(char == 'incorrect') {
        charsTyped += 1;
        score = (correctChars/charsTyped) * 100;
        var x = score.toFixed(2);
        accuracyPoints = x;
        document.getElementById('accuracy-span').innerText = accuracyPoints + '%';
    } else if(char == 'backspace') {
        charsTyped -= 1;
        //user had a correct char in this space, remove point from correctChar count
        if(addedChars[currentChar-1] == correctSpelling[currentChar-1]) {
            correctChars -= 1;
            score = (correctChars/charsTyped) * 100;
            var x = score.toFixed(2);
            accuracyPoints = x;
            document.getElementById('accuracy-span').innerText = accuracyPoints + '%';
        } else {
            score = (correctChars/charsTyped) * 100;
            var x = score.toFixed(2);
            accuracyPoints = x;
            document.getElementById('accuracy-span').innerText = accuracyPoints + '%';
        } 
    }
}

//compares character user typed to character index of word
function checkCharacter(char) {
    var span = document.createElement('span');
    span.innerText = char;
    span.style.fontSize = '35px';
    span.style.display = 'inline-block';
    span.setAttribute('class', 'user-added-char');
    //correct char
    if(char == correctSpelling[currentChar]) {
        addedChars.push(char);
        var y = words[onWordsDiv].innerText.split('');
        y.shift();
        span.style.color = 'black';
        words[onWordsDiv].innerHTML = '';
        wordsDiv[onWordsDiv].insertBefore(span, words[onWordsDiv]);
        for(i=0; i<y.length; ++i) {
            words[onWordsDiv].innerHTML += y[i];
        }
        calculateScore('correct');
    //wrong char
    } else {
        addedChars.push(char);
        var y = words[onWordsDiv].innerText.split('');
        y.shift();
        span.style.color = 'red';
        words[onWordsDiv].innerHTML = '';
        wordsDiv[onWordsDiv].insertBefore(span, words[onWordsDiv]);
        for(i=0; i<y.length; ++i) {
            words[onWordsDiv].innerHTML += y[i];
        }
        calculateScore('incorrect');
    }
}

function countdown() {
    const timer = setInterval(() => {
        //test is over
        if(document.getElementsByClassName('stats-span')[1].innerText == 1) {
            clearInterval(timer);
            userInputText.remove();
            var retryBtn = document.createElement('div');
            retryBtn.setAttribute('class', 'btn btn-danger text-center');
            retryBtn.innerText = 'Retry';
            retryBtn.addEventListener('click', () => {
                location.reload();
            })
            var retryBtnRow = document.createElement('div');
            retryBtnRow.setAttribute('class', 'row justify-content-center');
            retryBtnRow.appendChild(retryBtn);
            container.insertBefore(retryBtnRow, document.getElementById('rules-row'));
            var resultsTag = document.createElement('p');
            resultsTag.setAttribute('class', 'text-center mt-3');
            
            //removes all chars that werent guessed from charstyped total, makes sure WPM score is accurate
            for(i=0; i<document.getElementsByClassName('null-guess-certified').length; ++i) {
                charsTyped -= 1;
            }

            if(correctPoints == 0) {
                resultsTag.innerText = 'You were not able to get a single word typed correctly';
            } 
            else if((correctPoints > 0) && (correctPoints < 100)) {
                resultsTag.innerText = 'You got ' + correctPoints + ' out of 100 words correct\nYour WPM score is ' + (charsTyped/5);
            }
            else {
                resultsTag.style.color = 'green';
                resultsTag.innerText = 'You got all 100 words typed correctly. You are a keybaord warrior. Congrats.';
            }
            resultsTag.style.color = 'red';
            container.insertBefore(resultsTag, document.getElementById('rules-row'));
        }
        var t = document.getElementsByClassName('stats-span')[1].innerText;
        t -= 1;
        document.getElementsByClassName('stats-span')[1].innerText = t;
    }, 1000)

    return timer;
}

//click listener on input text
userInputText.addEventListener('click', () => {
    userInputText.setAttribute('placeholder', '');
})

//onkeydown listener on input text 
userInputText.addEventListener('keydown', (x) => {
    if(startTest == false) {
        startTest = true;
        timer = countdown();
    }
    //SPACE 
    if(x.keyCode === 32) {
        //didnt spell whole word when pressing space
        //shows red errors on chars with missing letter
        if(correctSpelling.length != addedChars.length) {
            incorrectPoints += 1;
            document.getElementById('incorrect-points').innerText = incorrectPoints;
            var startAt = correctSpelling.length - addedChars.length;
            words[onWordsDiv].innerText = '';
            for(i=addedChars.length; i<correctSpelling.length; ++i) {
                var span = document.createElement('span');
                span.setAttribute('class', 'null-guess null-guess-certified');
                span.innerText = correctSpelling[i];
                span.style.fontSize = '20px';
                span.style.display = 'inline-block';
                span.style.backgroundColor = '#FF4545';
                words[onWordsDiv].appendChild(span);
            }
            //incorrect guesses are calculated for each char not guessed after space
            for(i=0; i<document.getElementsByClassName('null-guess').length; ++i) {
                calculateScore('incorrect');
            }
            var nullLength = document.getElementsByClassName('null-guess').length;
            //removes all 'null-guess' classes from page, will be placed again on future null guesses
            for(i=0; i<nullLength; ++i) {
                document.getElementsByClassName('null-guess')[0].classList.remove('null-guess');
            }
        } else {
            //scans word to see if any chars are wrong
            //if so, adds incorrect point to screen
            var incorrectChar = false;
            for(i=0; i<correctSpelling.length; ++i) {
                if(addedChars[i] != correctSpelling[i]) {
                    incorrectChar = true;
                    break;
                } else {
                    continue;
                }
            }
            if(incorrectChar == true) {
                incorrectPoints += 1;
                document.getElementById('incorrect-points').innerText = incorrectPoints;
            } else {
                correctPoints += 1;
                document.getElementById('correct-points').innerText = correctPoints;
            }
        }
        
        addedChars = [];
        currentChar = 0;
        onWordsDiv += 1;

        var userSpans = document.getElementsByClassName('user-added-char');
        var l = userSpans.length;

        //changes all user-added-char classes to user-added-char-certified classes
        for(i=0; i<l; ++i) {
            userSpans[0].setAttribute('class', 'user-added-char-certified');
        }

        //user presses space after last word, ENDS TEST
        if(onWordsDiv == 100) {
            clearInterval(timer);
            userInputText.remove();
            var retryBtn = document.createElement('div');
            retryBtn.setAttribute('class', 'btn btn-danger text-center');
            retryBtn.innerText = 'Retry';
            retryBtn.addEventListener('click', () => {
                location.reload();
            })
            var retryBtnRow = document.createElement('div');
            retryBtnRow.setAttribute('class', 'row justify-content-center');
            retryBtnRow.appendChild(retryBtn);
            container.insertBefore(retryBtnRow, document.getElementById('rules-row'));
            var resultsTag = document.createElement('p');
            resultsTag.setAttribute('class', 'text-center mt-3');

            //removes all chars that werent guessed from charstyped total, makes sure WPM score is accurate
            for(i=0; i<document.getElementsByClassName('null-guess-certified').length; ++i) {
                charsTyped -= 1;
            }
            
            if(correctPoints == 0) {
                resultsTag.innerText = 'You were not able to get a single word typed correctly';
            } 
            else if((correctPoints > 0) && (correctPoints < 100)) {
                resultsTag.innerText = 'You got ' + correctPoints + ' out of 100 words correct\nYour WPM score is ' + (charsTyped/5);
            }
            else {
                resultsTag.style.color = 'green';
                resultsTag.innerText = 'You got all 100 words typed correctly. You are a keybaord warrior. Congrats.';
            }
            resultsTag.style.color = 'red';
            container.insertBefore(resultsTag, document.getElementById('rules-row'));
        } else {
            x.preventDefault(); //keeps from adding ghost space after space click
            userInputText.value = '';
            pushedWords.shift();
            currentWord = pushedWords[0];
            correctSpelling = currentWord.split('');
            highlightWord();
        }
    //BACKSPACE
    } else if(x.keyCode === 8) {
        //if input bar is blank, don't do anything
        if(userInputText.value == '') {
            //do nothing
        } else {
            if(currentChar == 0) {
                //do nothing
            } else {
                calculateScore('backspace');
                currentChar -= 1;
                addedChars.pop();
                //user has not entered any chars into input bar after single backspace, spell normal word out in word div
                if(addedChars.length == 0) {
                    document.getElementsByClassName('user-added-char')[0].remove();
                    words[onWordsDiv].innerText = '';
                        for(i=0; i<correctSpelling.length; ++i) {
                            words[onWordsDiv].innerText += correctSpelling[i];
                        }
                //user has at least on char in input bar still after single backspace 
                } else {
                    var lengthOfWord = correctSpelling.length;
                    var userSpans = document.getElementsByClassName('user-added-char');
                    var l = userSpans.length;
                    //removes all userSpans inside words-div
                    for(i=0;i<l; ++i) {
                        userSpans[0].remove();
                    }
                    words[onWordsDiv].innerText = '';
                    for(i=0; i<addedChars.length; ++i) {
                        var span = document.createElement('span');
                        span.innerText = addedChars[i];
                        span.style.fontSize = '35px';
                    
                        //changes color of char to red if incorrect
                        if(addedChars[i] != correctSpelling[i]) {
                            span.style.color = 'red';
                        } else {
                            span.style.color = 'black';
                        }

                        span.style.display = 'inline-block';
                        span.setAttribute('class', 'user-added-char');
                        wordsDiv[onWordsDiv].insertBefore(span, words[onWordsDiv]);
                    }

                    var x = correctSpelling.length - addedChars.length;
                    var startAt = addedChars.length; //index where correct chars at to be added, done after adding user spans
                    var empty = false;

                    while(empty != true) {
                        if(correctSpelling[startAt] == undefined) {
                            break;
                        } else {
                            words[onWordsDiv].innerText += correctSpelling[startAt];
                            startAt += 1;
                        }
                    }
                }
            }
        }
    //USER TYPES CHAR
    } else {
        //max length of current word, no more input excepted
        if(addedChars.length >= correctSpelling.length) {
            //do nothing
        } else {
            var y = x.key;
            if(y == y.toUpperCase()) {
                y = y.toLowerCase();
            }
            checkCharacter(y);
            currentChar += 1;
        }
    }
})

window.onload = () => {
    //pushes all words to be spelled into array
    for(i=0; i<words.length; ++i) {
        pushedWords.push(words[i].innerText);
    }
    currentWord = pushedWords[0];
    correctSpelling = currentWord.split('');
    highlightWord();
}

