(function(root) {
  let calculatorVariables = {
    operator: null,
    firstOperand: null,
    waitingForSecondOperand: false,
    displayValue: '0',
    addMinus: false
  }

  root.calc = calculatorVariables;
})(this);

function initializeApp() {
  console.log(event.target.dataset.value);
  let displayContent = document.getElementById('display').textContent.trim();
  const { target } = event;

  if (target.className === 'btn operator') {
    if (target.dataset.value === '-' && displayContent === '0') {
      addMinus();
      displayScreen();
      return;
    }
    handleOperator(target.dataset.value);
    displayScreen();
    return;
  }
  
  if(target.className === 'btn clear') {
    clearCalc();
    displayScreen();
    return;
  }
  if (target.className === 'btn dot') {
    addDecimal(event);
    displayScreen();
    return;
  }
  inputNum(target.textContent);
  displayScreen();
}

function handleOperator(nextOperator) {
  let currentValue = parseInt((calc.displayValue * 1000), 10) / 1000;
  nextOperator = addMinus(nextOperator);
  
  if (calc.operator && calc.waitingForSecondOperand && !calc.addMinus) {
    calc.operator = nextOperator;
    return;
  }
  if (calc.firstOperand === null) {
    calc.firstOperand = currentValue;
  } else if (calc.operator && !calc.addMinus) {

    if (calc.operator === '=') {
      calc.operator = null;
      calc.firstOperand = currentValue;
      displayScreen();
      return;
    }

    let previousValue = parseInt((calc.firstOperand * 1000), 10) / 1000;
    const result = operations[calc.operator](previousValue, currentValue);
    if (result % 1 !== 0) {
      calc.displayValue = result.toFixed(2);
      calc.firstOperand = result.toFixed(2);
    } else {
      calc.displayValue = result;
      calc.firstOperand = result;
    }
  }
  if (!calc.addMinus) {
    calc.waitingForSecondOperand = true;
  }
  calc.operator = nextOperator;
}

function inputNum(num) {
  let { displayValue } = calc;
  if (num % num !== 0) {
    calc.displayValue = num 
  }

  if (calc.waitingForSecondOperand === true && !calc.addMinus) {
    calc.displayValue = num;
    calc.waitingForSecondOperand = false;
  } else if (displayValue === '-0' && num % num == 0) {
    calc.displayValue = '-' + num;
  } else {
    calc.addMinus = false;
    calc.displayValue = displayValue === '0' ? num : displayValue + num;
  }
}

function addMinus(nextOperator) {
  let minusTarget = event.target.dataset.value === '-';
  let displayContent = document.getElementById('display').textContent.trim();
  let { operator, displayValue, firstOperand, addMinus } = calc;
  
  if (operator && nextOperator === '-' || operator === null && minusTarget) {
    calc.displayValue = '-';
    calc.addMinus = true;
    calc.waitingForSecondOperand = false;
    nextOperator = operator;
  } else if (0) {
    displayContent = '-' + displayContent;
    calc.displayValue = displayContent;
  }
  return nextOperator;
}

function addDecimal(dot) {
  let displayValue = calc.displayValue;
  if (calc.addMinus || calc.waitingForSecondOperand) {
    if (calc.firstOperand && calc.operator) {
      document.getElementById('display').textContent = '0.';
      inputNum('0' + dot.target.textContent);
    }
    return;
  } else if (!displayValue.includes('.')) {
    calc.displayValue += ".";
  }
}

function clearCalc() {
  calc.operator = null;
  calc.firstOperand = null;
  calc.waitingForSecondOperand = false;
  calc.displayValue = '0';
}

function displayScreen() {
  let display = document.getElementById('display');
  if (calc.displayValue === 'Infinity') {
    display.textContent = `You can't divide with zero`;
  } else {
    display.textContent = calc.displayValue;
  }
  if (display.textContent.trim().length > 5) {
    calc.displayValue = display.textContent.substring(0, display.textContent.length - 1); // An answer needs more than 5 spaces!
    display.textContent = calc.displayValue;
  }
}

const operations = {
  '+': (value1, value2) => value1 + value2,
  '-': (value1, value2) => value1 - value2,
  '*': (value1, value2) => value1 * value2,
  '/': (value1, value2) => value1 / value2,
}

const keys2 = document.querySelector('.buttons-left');
const keys1 = document.querySelector('.buttons-right');
keys1.addEventListener('click', initializeApp);
keys2.addEventListener('click', initializeApp);