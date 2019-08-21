(function(root) {
  let calculatorVariables = {
    operator: null,
    firstOperand: null,
    waitingForSecondOperand: false,
    displayValue: '0'
  }

  root.calc = calculatorVariables;
})(this);

function initializeApp() {
  const { target } = event;

  if (target.className === 'btn operator') {
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

  if (calc.operator && calc.waitingForSecondOperand) {
    calc.operator = nextOperator;
    return;
  }
  if (calc.firstOperand === null) {
    calc.firstOperand = currentValue;
  } else if (calc.operator) {

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

  calc.waitingForSecondOperand = true;
  calc.operator = nextOperator;
}

function inputNum(num) {
  let { displayValue } = calc;
  if (calc.waitingForSecondOperand === true) {
    calc.displayValue = num;
    calc.waitingForSecondOperand = false;
  } else {
    calc.displayValue = displayValue === '0' ? num : displayValue + num;
  }
}

function addDecimal(dot) {
  console.log(dot);
  let displayValue = calc.displayValue;
  if (calc.waitingForSecondOperand === true) {
    if (calc.firstOperand && calc.operator) {
      // calc.displayValue = '0.'
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
}

const operations = {
  '+': (value1, value2) => value1 + value2,
  '-': (value1, value2) => value1 - value2,
  '*': (value1, value2) => value1 * value2,
  '/': (value1, value2) => value1 / value2,
}

// const display = document.getElementById('display');
const keys2 = document.querySelector('.buttons-left');
const keys1 = document.querySelector('.buttons-right');
keys1.addEventListener('click', initializeApp);
keys2.addEventListener('click', initializeApp);