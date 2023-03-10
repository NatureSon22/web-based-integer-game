const first_number = document.querySelector("#firstnum");
const second_number = document.querySelector("#secondnum");
const operation = document.querySelector("#operation");
const checkBtn = document.querySelector("#check");
const userAnswer = document.querySelector("#answer");
const btns = document.querySelectorAll(".btn");
const headInfo = document.querySelectorAll(".header_info");
const acBtn = document.querySelector('#clear_btn');
const deleteBtn = document.querySelector('#delete_btn');
const queryParams = new URLSearchParams(window.location.search);
const difficultyLevel = queryParams.get("difficulty");
const totalQuestions = difficultyLevel === 'easy' ? 15 : difficultyLevel === 'average' ? 20 : 30;  


let correctAnswer = 0;
let numQuestions = 1;
let finalAnswer = 0;


acBtn.onclick = () => {
  userAnswer.textContent = '';
}

deleteBtn.onclick = () => {
  userAnswer.textContent = userAnswer.textContent.substring(0, userAnswer.textContent.length - 1);
}

// Update the user's answer as they click the number buttons
btns.forEach((button) => {
  button.onclick = () => {
    if (button.textContent === "-" && !userAnswer.textContent.includes("-")) {
      userAnswer.textContent = `-${userAnswer.textContent}`;
    } else if (button.textContent === "+") {
      if (userAnswer.textContent.startsWith("-")) {
        userAnswer.textContent = userAnswer.textContent.substring(1);
      }
    } else {
      userAnswer.textContent += button.textContent;
    }    
  };
});

// Generate a new math problem
const generateProblem = () => {
  userAnswer.textContent = '';
  userAnswer.style.color = '#FFFFFF';
  let firstNum = Math.floor(Math.random() * 10 + 1);
  let secondNum = Math.floor(Math.random() * 10 + 1);

  if(difficultyLevel === 'easy') {
    firstNum = Math.floor(Math.random() * 4 + 1);
    secondNum = Math.floor(Math.random() * 4 + 1);
  } else if(difficultyLevel == 'average') {
    let randNum = Math.floor(Math.random() * 2 + 1);
    if(randNum === 2) {
      firstNum =  Math.floor((Math.random() * 6) + 5);
      secondNum =  Math.floor((Math.random() * 6) + 15);
    } else {
      firstNum =  Math.floor((Math.random() * 6) + 15);
      secondNum = Math.floor((Math.random() * 6) + 5);
    }
  } else { 
    firstNum =  Math.floor((Math.random() * 11) + 15);
    secondNum =  Math.floor((Math.random() * 11) + 15);
  }

  if (firstNum < secondNum) {
    [firstNum, secondNum] = [secondNum, firstNum];
  }

  const { result, operator } = solveProblem(firstNum, secondNum);

  if (Number.isInteger(result)) {
    operation.textContent = operator;
    first_number.textContent = firstNum;
    second_number.textContent = secondNum;
    finalAnswer = result;
  } else {
    // If the result is not an integer, generate a new problem
    return generateProblem();
  }
};

// Solve a math problem
const solveProblem = (firstNum, secondNum) => {
  let result = 0;
  let operator = "";
  const randomOperator = Math.floor(Math.random() * 4 + 1);

  switch (randomOperator) {
    case 1:
      result = firstNum + secondNum;
      operator = "+";
      break;
    case 2:
      result = firstNum - secondNum;
      operator = "-";
      break;
    case 3:
      result = firstNum * secondNum;
      operator = "x";
      break;
    case 4:
      result = firstNum / secondNum;
      operator = "÷";
      break;
  }

  return { result, operator };
};

// Check the user's answer and update the score
checkBtn.onclick = () => {
  if (Number(userAnswer.textContent) === finalAnswer) {
    correctAnswer++;
    headInfo[2].textContent = `Correct: ${correctAnswer}/${totalQuestions}`;
  }
  numQuestions++;
  headInfo[1].textContent = `Q: ${numQuestions}/${totalQuestions}`;

  userAnswer.style.color = Number(userAnswer.textContent) === finalAnswer ? "#00BF63": "#FF4136";
  
  if(numQuestions === totalQuestions) {
    setTimeout(() => window.location.href = 'game-level.html', 1000)
  }
  
  setTimeout(generateProblem, 1000);
};

headInfo[2].textContent = `Correct: ${correctAnswer}/${totalQuestions}`;
headInfo[1].textContent = `Q: ${numQuestions}/${totalQuestions}`;
generateProblem(); // Generate the first math problem
