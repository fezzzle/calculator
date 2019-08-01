function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function operate(operator, num1, num2) {
  if (operator === 'add') {
    return add(num1, num2);
  } if (operator === 'subtract') {
    return subtract(num1, num2);
  }
}

function selectElements() {
  const display = document.getElementById('display');
  const buttons = Array.from(document.querySelectorAll('.button'));
  let saveInputOne = 2;
  let saveInputTwo = 2;
  let operator = 'add';

  document.addEventListener('click', (event) => {
    buttons.map((button) => {
      // console.log(operator);
      if (event.target !== button) {
        console.log('Nothing');
      } else {
        // take the textContent of event.target and put it in the display area
        // display.textContent = button.textContent;

        // it should be able to display more numbers than one
        display.textContent += button.textContent;
        // console.log(button.textContent);
        // console.log(typeof display.textContent);

        // if one of operator buttons were pressed, it should clear the area and save the inputted numbers
        if (event.target.getAttribute('data-special')) {
          // when operator is pressed, save it in a variable
          operator += event.target.getAttribute('data-special');
          if (saveInputOne === 0) {
            saveInputOne += parseInt(display.textContent, 10);
            display.textContent = '';
          } else {
            saveInputTwo += parseInt(display.textContent, 10);
            display.textContent = '';
          }
        }
      }
    });
    // console.log('saveInputOne:', saveInputOne, 'saveInputTwo:', saveInputTwo);
  });
  return {
    inputOne: saveInputOne,
    inputTwo: saveInputTwo,
    op: operator,
  };
}

function selectButtons() {
  const buttons = Array.from(document.querySelectorAll('.button'));
  const specialButtonArray = [];
  const numButtonArray = [];
  buttons.map((button) => {
    const dataNumbers = button.hasAttribute('data-number');

    if (dataNumbers === true) {
      numButtonArray.push(button.getAttribute('data-number'));
    } else if (dataNumbers === false) {
      specialButtonArray.push(button.getAttribute('data-special'));
    }
  });
}

selectElements();

const calculate = selectElements();

calculate(calculate.op, calculate.inputOne, calculate.inputTwo);
