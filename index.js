// const operations = require('./operations');
const display = document.querySelector('.display');
const calculator = document.querySelector('#calculator');
const inputs = {
    0: {
        key: 0,
        code: 'Digit0',
        keyCode: 48,
        type: "number",
        canDisplay: true,
    }, 1: {
        key: 1,
        code: 'Digit1',
        keyCode: 49,
        type: "number",
        canDisplay: true,
    }, 2: {
        key: 2,
        code: 'Digit2',
        keyCode: 50,
        type: "number",
        canDisplay: true,
    }, 3: {
        key: 3,
        code: 'Digit3',
        keyCode: 51,
        type: "number",
        canDisplay: true,
    }, 4: {
        key: 4,
        code: 'Digit4',
        keyCode: 52,
        type: "number",
        canDisplay: true,
    }, 5: {
        key: 5,
        code: 'Digit5',
        keyCode: 53,
        type: "number",
        canDisplay: true,
    }, 6: {
        key: 6,
        code: 'Digit6',
        keyCode: 54,
        type: "number",
        canDisplay: true,
    }, 7: {
        key: 7,
        code: 'Digit7',
        keyCode: 55,
        type: "number",
        canDisplay: true,
    }, 8: {
        key: 8,
        code: 'Digit8',
        keyCode: 56,
        type: "number",
        canDisplay: true,
    }, 9: {
        key: 9,
        code: 'Digit9',
        keyCode: 57,
        type: "number",
        canDisplay: true,
    }, ".": {
        key: ".",
        code: 'Period',
        keyCode: 190,
        type: "number",
        canDisplay: true,
    }, "c": {
        key: "c",
        code: 'KeyC',
        keyCode: 67,
        type: "modify",
        canDisplay: false,
    }, 'Backspace': {
        key: "Backspace",
        code: 'Backspace',
        keyCode: 8,
        type: "modify",
        canDisplay: false,
    }, '←': {
        key: "Backspace",
        code: 'Backspace',
        keyCode: 8,
        type: "modify",
        canDisplay: false,
    }, 'x': {
        key: "x",
        code: 'KeyX',
        keyCode: 88,
        type: "operator",
        canDisplay: true,
    }, "-": {
        key: "-",
        code: 'Minus',
        keyCode: 189,
        type: "operator",
        canDisplay: true,
    }, "/": {
        key: "/",
        code: 'Slash',
        keyCode: 191,
        type: "operator",
        canDisplay: true,
    }, "+": {
        key: "+",
        code: 'Equal',
        keyCode: 187,
        type: "operator",
        canDisplay: true,
    }, "=": {
        key: "=",
        code: 'Equal',
        keyCode: 187,
        type: "operator",
        canDisplay: false,
    }, "Enter": {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        type: "operator",
        canDisplay: false,
    }
}
const validKeys = Object.keys(inputs);
const operationSigns = ["x", "/", "+", "-"];

// create buttons
const numbers = [0, ".", "(-)", 1, 2, 3, 4, 5, 6, 7, 8, 9];
const numSection = document.querySelector('.numbers');
const operators = ["←", "c", "x", "/", "+", "-", "="];
const operSection = document.querySelector('.operators');

for (const number of numbers) {
    makeButton('number-button', number, numSection);
}
for (const operator of operators) {
    makeButton('operator-button', operator, operSection);
}

function makeButton(className, textContent, parentNode) {
    const newBut = document.createElement('button');
    newBut.classList.add(className);
    newBut.textContent = textContent;
    newBut.value = textContent;
    newBut.onclick = updateDisplay;
    parentNode.appendChild(newBut);
}
const negativeButton = document.querySelectorAll('.number-button')[2];
negativeButton.value = "-";

// receive inputs *****************************
function identifyInputValue(e) {
    if (e.key) {
        return e.key
    } else if (e.target.value) {
        return e.target.value
    }
}
function updateDisplay(e) {
    let pressedKey;
    if (e.key) {
        pressedKey = e.key;
    } else {
        pressedKey = e.target.value;
    }
    if (inputs[pressedKey].canDisplay) {
        showTypedKey(pressedKey);
    } else if (inputs[pressedKey].key === "Backspace") {
        backSpace();
    } else if (inputs[pressedKey].key === "c") {
        clear();
    } else if (inputs[pressedKey].key === "=" || inputs[pressedKey].key === "Enter") {
        let parsedArray = readInput();
        let answer = operate(parsedArray);
        showAnswer(answer);
    }
    console.log(pressedKey);

}
//calculate***********************
function readInput() {
    let characters = display.textContent.split("");
    console.log(characters);
    let lastCharacter = characters[characters.length - 1];
    if (inputs[lastCharacter].type === 'operator') {
        showError();
        return;
    }
    let parsedCharacters = [];
    let previousChar = "";
    let newEntry;
    let currentChar;
    let nextCharIsNegative = false;
    let currentIndex = 0;
    for (const character of characters) {
        currentChar = character;
        if (previousChar === "") {
            if (currentChar == "-") { nextCharIsNegative = true; }
            newEntry = currentChar;//first character -> update entry and prevChar

        } else if (inputs[previousChar].type === 'operator' && inputs[currentChar].type === 'number') {
            nextCharIsNegative ?
                newEntry = "-" + currentChar :
                newEntry = currentChar; //oper-num -> update prevChar
            nextCharIsNegative = false;

        } else if (inputs[previousChar].type === 'number' && inputs[currentChar].type === 'number') {
            newEntry = newEntry + currentChar.toString(); //num-num -> concat

        } else if (inputs[previousChar].type === 'operator' && inputs[currentChar].type === 'operator') {
            if (currentChar === '-') { //make next number negative if it's a minus sign
                nextCharIsNegative = !nextCharIsNegative;
            } else {//ignore if consecutive operators
                return;
            }

        } else if (inputs[previousChar].type === 'number' && inputs[currentChar].type === 'operator') {
            parsedCharacters.push(newEntry); //num-operator -> push to parsedCharacters
            parsedCharacters.push(currentChar);
            newEntry = "";
        }

        previousChar = currentChar;

        if (currentIndex == characters.length - 1) { //handling final entry
            parsedCharacters.push(newEntry);
        }
        currentIndex++;
    }
    console.table(parsedCharacters);
    return parsedCharacters;
}

// handle calculations ****************************************
function operate(parsedArray) {
    console.log(parsedArray);
    //identify operations
    let answer = 0;
    let remainingTerms = parsedArray;
    const operationCounts = countOperators(parsedArray);
    console.log(operationCounts);
    const operationsToDo = Object.keys(operationCounts);

    // sort operations by order of operations
    operationsToDo.sort().reverse();
    // perform operations
    for (let operation of operationsToDo) {
        for (let opCount = 1; opCount <= operationCounts[operation]; opCount++) {
            let i = parsedArray.indexOf(operation);
            let previous = remainingTerms[i - 1];
            let next = remainingTerms[i + 1];
            let answer;
            if (operation === 'x') {
                answer = multiply(previous, next);
            } else if (operation === '/') {
                answer = divide(previous, next);
            } else if (operation === "+") {
                answer = add(previous, next);
            } else if (operation === "-") {
                answer = subtract(previous, next);
            }
            remainingTerms.splice(i - 1, 3, answer);
        }
    }
    console.log(`remaining terms: ${remainingTerms}`);
    // let answer = operations.sum(a,b);
    // return answer;
    answer = remainingTerms[0];
    if (!parseFloat(answer)) {
        showError();
        return;
    }
    return answer;
}

function countOperators(parsedArray) {
    let operatorCounts = parsedArray.reduce((totals, entry) => {
        if (!totals[entry] && operationSigns.includes(entry)) {
            totals[entry] = 1;
        } else if (operationSigns.includes(entry)) {
            totals[entry]++;
        }
        return totals;
    }, {});
    return operatorCounts;
}
function add(a, b) {
    console.log(parseFloat(a));
    console.log(parseFloat(b));
    return parseFloat(a) + parseFloat(b);
};

function subtract(a, b) {
    return a - b;
};

function multiply(a, b) {
    return a * b;
};
function divide(a, b) {
    return a / b;
}
//display updates (clear, backspace, error, update typed values)
function showTypedKey(typedKey) {
    if (display.textContent == 0 && inputs[typedKey].type == 'operator') {
        display.textContent = `0`;
    } else if (display.textContent == 0) {
        display.textContent = "";
    }
    // console.log('valid key');
    // console.log(`current content: ${display.textContent}`);
    // console.log(`key pressed: ${pressedKey}`);
    display.textContent = display.textContent.toString() + typedKey;
}
function backSpace() {
    display.textContent.length > 1 ?
        display.textContent = display.textContent.slice(0, -1) :
        display.textContent = "0";
}
function showAnswer(answer) {
    console.log(answer);
    console.log(typeof answer);
    if (answer == 'Infinity' || answer == NaN) {
        showError();
    } else {
        display.textContent = answer;
    }
}
function clear() {
    display.textContent = "0";
    document.removeEventListener('keydown', clear);
    document.removeEventListener('click', clear);
}

function showError() {
    display.textContent = "ERROR";
    document.addEventListener('keydown', clear);
    document.addEventListener('click', clear);
}
document.addEventListener('keydown', updateDisplay);