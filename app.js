(function (root) {
  let calculatorVariables = {
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
    displayValue: '0',
    addMinus: false,
    gotResult: false,
    operatorPushed: false
  }

  root.calc = calculatorVariables;
})(this);

function initializeApp(event) {
  const target = event.target;
    
    switch (target.dataset.operation) {
      case 'operator':
      calc.operatorPushed = true;
      let addMinus = controlMinus(target);
      if (!addMinus) handleOperator(target.dataset.value);
      break;
    case 'clear':
      clearCalc();
      break;
    case 'dot':
      addDecimal(event);
      break;
    default:
      inputNum(target);
      break;
  }

  // after calculations are done, update screen value
  updateScreen();
}

function handleOperator(nextOperator) {
  const currentValue = +calc.displayValue;

  // when one operation has been done, operator will be turned from last used operator to nextOperator
  if (calc.operator && calc.waitingForSecondOperand) {
    calc.operator = nextOperator;
    calc.gotResult = false;
    return;
  }

  // no first operand found, mark it and wait for second operand
  if (calc.firstOperand === null) {
    calc.firstOperand = currentValue;
    calc.waitingForSecondOperand = true;
    calc.operator = nextOperator;
    calc.operatorPushed = false;
    return;
  }

  if (calc.operator && calc.operator === '=') {
    calc.operator = null;
    calc.firstOperand = currentValue;
    return;
  }

  // handle used operator
  if (calc.operator) {
    const previousValue = +calc.firstOperand;
    let checkedByFunctionValue = checkIfBothHaveMinus(previousValue, currentValue);
    const result = operations[calc.operator](previousValue, checkedByFunctionValue);

    if (result % 1 !== 0) {
      calc.displayValue = result.toFixed(2);
      calc.firstOperand = result.toFixed(2);
    } else {
      calc.displayValue = result.toString();
      calc.firstOperand = result;
    }
    calc.gotResult = true;
  }
  // when calculation is done and became firstOperand, wait for secondOperand and change operator to nextOperator
  // next step is at line 43
  calc.waitingForSecondOperand = true;
  calc.operator = nextOperator;
}

function inputNum(target) {
  let display = document.getElementById('display')
  let includesMinus = display.textContent.includes('-')
  let num = target.textContent
  let { displayValue } = calc;

 if (calc.waitingForSecondOperand === true && includesMinus && display.textContent.length === 1) {
    calc.displayValue =  displayValue + num;
    calc.waitingForSecondOperand = false;
    return;
  } else if (calc.waitingForSecondOperand === true) {
    calc.displayValue = num;
    calc.waitingForSecondOperand = false;
    return;
  }

  calc.displayValue = displayValue === '0' ? num : displayValue + num;
}

function addDecimal(dot) {
  let displayValue = calc.displayValue;
  if (calc.waitingForSecondOperand === true) {
    if (calc.firstOperand && calc.operator && !displayValue.includes('-')) {
      inputNum('0' + dot.target.textContent);
    }
    return;
  } else if (!displayValue.includes('.')) {
    calc.displayValue += ".";
  }
}

function controlMinus(target) {
  const display = document.getElementById('display').textContent.trim();
  const length = document.getElementById('display').textContent.length;

  if (calc.waitingForSecondOperand === true && target.dataset.value === '-' && calc.gotResult === true) {
    calc.gotResult = false;
  } else if (calc.waitingForSecondOperand === true && target.dataset.value === '-') {
    calc.addMinus = true;
    calc.displayValue = '-';
  } else if (target.dataset.value === '-' && display === '0' || target.dataset.value === '-' && calc.operatorPushed && length <= '2' && calc.operator) {
    calc.addMinus = true;
    calc.gotResult = false;
    calc.displayValue = '-';
    calc.operatorPushed = false;
  } else {
    calc.addMinus = false;
  }
  return calc.addMinus;
}

function checkIfBothHaveMinus(val1, val2) {
  if (val1 < 0 && val2 < 0) {
    val2 = -1 * val2
  }
  return val2;
}

function clearCalc() {
  calc.operator = null;
  calc.firstOperand = null;
  calc.waitingForSecondOperand = false;
  calc.displayValue = '0';
  calc.gotResult = false;
}

function updateScreen() {
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

const keys2 = document.querySelector('.buttons-left');
const keys1 = document.querySelector('.buttons-right');
keys1.addEventListener('click', initializeApp);
keys2.addEventListener('click', initializeApp);