const BASE_VALUE = "0";
const EMPTY_STRING = "";
const DOT = ".";
const MAX_RESULT_LENGTH = 20;
const MAX_INPUT_LENGTH = 16;

const errorMessageElement = document.querySelector(".error-message");
const numberButtons = document.querySelectorAll(".button.number");
const numberZeroButton = document.querySelector(".button.zero");
const dotButton = document.querySelector(".button.dot");
const resetButton = document.querySelector(".button.reset");
const switchPlusMinusButton = document.querySelector(".button.plus-minus-switcher");
const backspaceButton = document.querySelector(".button.backspace");
const operatorsButtons = document.querySelectorAll(".button.operator");
const equalButton = document.querySelector(".button.equal");
const buttons = document.querySelectorAll(".button");
const screenInput = document.querySelector(".input");
const screenOutput = document.querySelector(".output");

let dotAlreadyUsed = false;
let mathExpression = [];
let currentNumber = BASE_VALUE;
let currentOperator = EMPTY_STRING;
let firstNumber = 0;
let secondNumber = 0;

const operatorsList = {
  "+": sum,
  "-": subtraction,
  "*": multiply,
  "/": division,
};

numberButtons.forEach((numberButton) => {
  numberButton.addEventListener("click", recordNumberButton);
});

operatorsButtons.forEach((operatorButton) => {
  operatorButton.addEventListener("click", recordOperatorButton);
});

numberZeroButton.addEventListener("click", recordZeroButton);
dotButton.addEventListener("click", recordDotButton);
switchPlusMinusButton.addEventListener("click", recordSwitchPlusMinusButton);
backspaceButton.addEventListener("click", recordBackspaceButton);
resetButton.addEventListener("click", resetCalculator);
equalButton.addEventListener("click", makeCalculations);

function sum() {
  return (Number(firstNumber) + Number(secondNumber)).toFixed(7);
}

function subtraction() {
  return (Number(firstNumber) - Number(secondNumber)).toFixed(7);
}

function multiply() {
  return (Number(firstNumber) * Number(secondNumber)).toFixed(7);
}

function division() {
  return (Number(firstNumber) / Number(secondNumber)).toFixed(7);
}

function displayError(message, resetCalculatorFlag) {
  errorMessageElement.textContent = message;
  errorMessageElement.style.display = "block";

  if (resetCalculatorFlag) resetCalculator();

  setTimeout(() => {
    errorMessageElement.style.display = "none";
  }, 3000);
}

function removeTrailingZeros(value) {
  return value.includes(".") ? value.replace(/\.?0+$/, "") : value;
}

function currentElementIsOperator() {
  if (mathExpression.length === 0) {
    return false;
  }

  return (operatorsList.hasOwnProperty(mathExpression.at(-1)) 
          && currentNumber.length === 0);
}

function recordNumberButton(event) {
  if (screenInput.textContent === BASE_VALUE) {
    screenInput.textContent = event.target.textContent;
    currentNumber = event.target.textContent;
  } else {
    if (screenInput.textContent.length > MAX_INPUT_LENGTH) {
      displayError("Character limit reached", false);
    } else {
      screenInput.textContent += event.target.textContent;
      currentNumber += event.target.textContent;
      currentOperator = EMPTY_STRING;
    }
  }
}

function recordOperatorButton(event) {
  if (currentNumber.at(-1) === DOT) {
    screenInput.textContent = screenInput.textContent.slice(0, -1);
    currentNumber = currentNumber.slice(0, -1);
    dotAlreadyUsed = false;
  }

  if (currentElementIsOperator()) {
    mathExpression.pop();
    currentOperator = event.target.textContent;
    mathExpression.push(currentOperator);
    screenInput.textContent = screenInput.textContent.slice(0, -1);
    screenInput.textContent += event.target.textContent;
    dotAlreadyUsed = false;
  } else if (currentOperator === EMPTY_STRING) {
    mathExpression.push(currentNumber);
    currentOperator = event.target.textContent;
    mathExpression.push(currentOperator);
    currentOperator = EMPTY_STRING;
    currentNumber = EMPTY_STRING;
    dotAlreadyUsed = false;
    screenInput.textContent += event.target.textContent;
  }
}

function recordZeroButton(event) {
  if (screenInput.textContent !== BASE_VALUE && currentNumber !== BASE_VALUE) {
    screenInput.textContent += event.target.textContent;
    currentNumber += event.target.textContent;
    currentOperator = EMPTY_STRING;
  }
}

function recordDotButton(event) {
  if (currentOperator !== DOT && !dotAlreadyUsed) {
    screenInput.textContent += event.target.textContent;
    currentNumber += event.target.textContent;
    dotAlreadyUsed = true;
  }
}

function resetCalculator() {
  dotAlreadyUsed = false;
  mathExpression = [];
  currentNumber = BASE_VALUE;
  currentOperator = EMPTY_STRING;
  firstNumber = 0;
  secondNumber = 0;
  screenInput.textContent = BASE_VALUE;
  screenOutput.textContent = "...";
}

function recordSwitchPlusMinusButton(event) {
  if (
    screenInput.textContent !== BASE_VALUE &&
    currentNumber !== EMPTY_STRING &&
    currentNumber !== DOT
  ) {
    screenInput.textContent = screenInput.textContent.slice(
      0,
      -currentNumber.length
    );

    if (currentNumber.at(-1) === DOT) {
      dotAlreadyUsed = false;
    }

    currentNumber = String(currentNumber * -1);
    screenInput.textContent += currentNumber;
  }
}

function recordBackspaceButton() {
  if (mathExpression.length < 1 && currentNumber.length <= 1) {
    screenInput.textContent = BASE_VALUE;
    currentNumber = BASE_VALUE;
    return;
  }

  let ExpressionElement;

  if (currentNumber === EMPTY_STRING) {
    ExpressionElement = mathExpression.pop();

    if (operatorsList.hasOwnProperty(ExpressionElement)) {
      currentNumber = mathExpression.pop();
      screenInput.textContent = screenInput.textContent.slice(0, -1);

      Array.from(currentNumber).forEach((element) => {
        if (element === DOT) {
          dotAlreadyUsed = true;
        }
      });
    }
  } else {
    if (Array.from(currentNumber).at(-1) === DOT) {
      dotAlreadyUsed = false;
    }

    currentNumber = currentNumber.slice(0, -1);

    if(currentNumber === '-' || currentNumber === '+') {
      currentNumber = EMPTY_STRING;
    }
    screenInput.textContent = screenInput.textContent.slice(0, -1);
  }
}

function makeCalculations() {
  if (currentNumber !== EMPTY_STRING) mathExpression.push(currentNumber);

  if (mathExpression.length <= 2) {
    displayError("Invalid expression", true);
    return;
  } 

  mathExpression.reverse();

  screenOutput.textContent = screenInput.textContent;

  firstNumber = mathExpression.pop();

  while (mathExpression.length !== 0) {
    currentOperator = mathExpression.pop();

    secondNumber = mathExpression.pop();

    if (secondNumber === undefined) {
      continue;
    }

    if (currentOperator === "/" && Number(secondNumber) === 0) {
      displayError("Division by zero", true);
      return;
    }

    if (operatorsList.hasOwnProperty(currentOperator)) {
      firstNumber = operatorsList[currentOperator]();
    }
  }

  const result = removeTrailingZeros(firstNumber);

  if (result.length <= MAX_RESULT_LENGTH) {
    screenInput.textContent = result;
  } else {
    displayError("Result is too long, and was cutted to 20 elements", false);
    screenInput.textContent = result.slice(0, 20);
  }

  mathExpression = [];
  currentNumber = String(firstNumber);
  currentOperator = EMPTY_STRING;
  firstNumber = 0;
  secondNumber = 0;

  if (currentNumber.includes(DOT)) {
    dotAlreadyUsed = true;
  }
}
