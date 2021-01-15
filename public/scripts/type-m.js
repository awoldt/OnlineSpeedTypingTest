const wordDiv = document.getElementById('current-word');
wordDiv.style.fontSize = '55px';
const userInputText = document.getElementsByClassName('form-control')[0];
const container = document.getElementsByClassName('container')[0];

var generatedWords = [];
var correctSpelling = [];
var addedChars = [];
var currentWord;
var currentChar = 0;
var onWord = 0;
var charsTyped = 0;

var correctPoints = 0;
var incorrectPoints = 0;
var time = 60;

var startTest = false; //defaults to false, true on first char user types

var timer;

window.onload = () => {
    //pushes all words to spell into array above
    for(i=0; i<document.getElementsByClassName('words').length; ++i) {
        generatedWords.push(document.getElementsByClassName('words')[i].innerText);
    }
    var l = document.getElementsByClassName('words').length;
    //removes all words from screen
    for(i=0; i<l; ++i) {
        document.getElementsByClassName('words')[0].remove();
    }
    currentWord = generatedWords[0];
    correctSpelling = currentWord.split('');
    //fills wordDiv with word
    for(i=0; i<correctSpelling.length; ++i) {
        var span = document.createElement('span');
        span.setAttribute('class', 'text-secondary');
        span.innerText += correctSpelling[i];
        span.style.fontSize = '55px';

        wordDiv.appendChild(span);
    }
    userInputText.maxLength = correctSpelling.length;
}

function countdown() {
    var timer = setInterval(() => {
        if(time == 0) {
            clearInterval(timer);
            userInputText.remove();
            //place results 
            var results = document.createElement('div');
            results.setAttribute('class', 'mt-3');

            //removes all chars that werent guessed from charstyped total, makes sure WPM score is accurate
            for(i=0; i<document.getElementsByClassName('null-guess-certified').length; ++i) {
                charsTyped -= 1;
            }
            
            if(correctPoints == 0) {
                results.innerText = 'You were not able to get a single word typed correctly';
            }
            else if((correctPoints > 0) && (correctPoints < 100)) {
                results.innerText = 'You got ' + correctPoints + ' out of 100 words correct\nYour WPM score is ' + (charsTyped/5);
            }
            else {
                results.innerText = 'You got all 100 words typed correctly. You are a keybaord warrior. Congrats.';
            }
            results.style.color = 'red';
            var resultsRow = document.createElement('div');
            resultsRow.setAttribute('class', 'row');
            resultsRow.appendChild(results);
            container.insertBefore(resultsRow, document.getElementById('rules-row'));
            var retryBtn = document.createElement('div');
            retryBtn.setAttribute('class', 'btn btn-danger text-center');
            retryBtn.innerText = 'Retry';
            retryBtn.addEventListener('click', () => {
                location.reload();
            })
            var retryBtnRow = document.createElement('div');
            retryBtnRow.setAttribute('class', 'row justify-content-center mt-5 mb-3');
            retryBtnRow.appendChild(retryBtn);
            container.insertBefore(retryBtnRow, document.getElementById('share-div'));
        }
        var t = time;
        document.getElementById('time-span').innerText = t;
        time -= 1;
    }, 1000)

    return timer;
}

function checkWord() {
    //user didnt type whole word, incorrect point added
    if(addedChars.length != correctSpelling.length) {
        incorrectPoints += 1;
        document.getElementById('incorrect-points').innerText = incorrectPoints;
        document.getElementById('incorrect-points').style.color = 'red';
    }
    //user did type whole word
    else {
        var correct = true;
        for(i=0; i<document.getElementsByClassName('user-added-char').length; ++i) {
            //add incorrect point
            if(document.getElementsByClassName('user-added-char')[i].style.color == 'red') {
                incorrectPoints += 1;
                correct = false;
                document.getElementById('incorrect-points').innerText = incorrectPoints;
                document.getElementById('incorrect-points').style.color = 'red';
                break;
            }
            //add correct point
            else {
                continue;
            }
        }
        if(correct == true) {
            correctPoints += 1;
            document.getElementById('correct-points').innerText = correctPoints;
            document.getElementById('correct-points').style.color = 'green';
        }
    }
}

function checkChar(x) {
    //cannot add anymore guesses, enough chars 
    if(addedChars.length == correctSpelling.length) {
        //do nothing 
    } 
    else {
        //correct guess
        if(x == correctSpelling[currentChar]) {
            addedChars.push(x);
            wordDiv.innerText = '';
            //add all guessed chars 
            for(i=0; i<addedChars.length; ++i) {
                var span = document.createElement('span');
                span.innerText = addedChars[i];
                span.style.fontSize = '55px';
                span.style.display = 'inline-block';
                if(addedChars[i] == correctSpelling[i]) {
                    span.style.color = 'black';
                }
                else {
                    span.style.color = 'red'; 
                }
                span.setAttribute('class', 'user-added-char');

                wordDiv.appendChild(span);
            }
            //add remaining chars 
            var r = correctSpelling.length - addedChars.length;
            for(i=addedChars.length; i<correctSpelling.length; ++i) {
                var span2 = document.createElement('span');
                span2.innerText = correctSpelling[i];
                span2.style.fontSize = '55px';
                wordDiv.appendChild(span2);
            }
        }
        //incorrect guess 
        else {
            addedChars.push(x);
            wordDiv.innerText = '';
            //add all guessed chars 
            for(i=0; i<addedChars.length; ++i) {
                var span = document.createElement('span');
                span.innerText = addedChars[i];
                span.style.fontSize = '55px';
                span.style.display = 'inline-block';
                if(addedChars[i] == correctSpelling[i]) {
                    span.style.color = 'black';
                }
                else {
                    span.style.color = 'red'; 
                }
                span.setAttribute('class', 'user-added-char');

                wordDiv.appendChild(span);
            }
            //add remaining chars 
            var r = correctSpelling.length - addedChars.length;
            for(i=addedChars.length; i<correctSpelling.length; ++i) {
                var span2 = document.createElement('span');
                span2.innerText = correctSpelling[i];
                span2.style.fontSize = '55px';
                wordDiv.appendChild(span2);
            }
        }
    }
}

//click listener on input text
userInputText.addEventListener('click', () => {
    userInputText.setAttribute('placeholder', '');
})

//click listener on input text
userInputText.addEventListener('keydown', (x) => {
    //starts test after first char click
    if(startTest == false) {
        startTest = true;
        timer = countdown();
    }

    //SPACE CLICK
    if(x.keyCode === 32) {
        if(onWord == 99) {
            checkWord();
            alert('test-done');
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
        else {
            checkWord();
            x.preventDefault(); //keeps from adding ghost space after space click
            userInputText.value = '';
            currentChar = 0;
            onWord += 1;
            addedChars = [];
            generatedWords.shift();
            currentWord = generatedWords[0];
            correctSpelling = currentWord.split('');
            wordDiv.innerText = currentWord;
            userInputText.maxLength = correctSpelling.length;
        }
        
    }
    //BACKSPACE CLICK
    else if(x.keyCode === 8) {
        if(userInputText.value == '') {
        //do nothing 
        }
        else {
            if(currentChar == 0) {
                //do nothing
            }
            else {
                charsTyped -= 1;
                currentChar -= 1;
                addedChars.pop();
                wordDiv.innerText = '';
                
                //add all guessed chars 
                for(i=0; i<addedChars.length; ++i) {
                    var span = document.createElement('span');
                    span.innerText = addedChars[i];
                    span.style.fontSize = '55px';
                    span.style.display = 'inline-block';
                    if(addedChars[i] == correctSpelling[i]) {
                        span.style.color = 'black';
                    }
                    else {
                        span.style.color = 'red'; 
                    }
                    span.setAttribute('class', 'user-added-char');

                    wordDiv.appendChild(span);
                }
                //add remaining chars 
                var r = correctSpelling.length - addedChars.length;
                for(i=addedChars.length; i<correctSpelling.length; ++i) {
                    var span2 = document.createElement('span');
                    span2.innerText = correctSpelling[i];
                    wordDiv.appendChild(span2);
                }
            }
        }
    }
    //CHAR CLICK
    else {
        charsTyped += 1;
        var y = x.key;
        if(y == y.toUpperCase()) {
            y = y.toLowerCase();
        }
        checkChar(y);
        currentChar += 1;
    }
})






