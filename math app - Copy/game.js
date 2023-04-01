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
const currentLev = queryParams.get('current');
const difficultyLevel = queryParams.get('difficulty');
const backBtn = document.querySelector('#back-game');
const restartBtn = document.querySelector('#restart-game');
const answerContainer = document.querySelector('#answer_container');
const totalQuestions = 15;
const effect = document.querySelector('.restart-effect')[0];
const nextDifficultyLevel = difficultyLevel === 'add' ? 'subtract' :
                            difficultyLevel === 'subtract' ? 'multiply' :
                            difficultyLevel === 'multiply' ? 'divide' : ''
const nextLev = currentLev === 'easy' ? 'average' :
                currentLev === 'average' ? 'difficult' : ''; 

const Scores = {
  easy: 0,
  average: 0,
  difficult: 0
};

let wrongAnswer = 0;
let correctAnswer = 0;
let numQuestions = 1;
let finalAnswer = 0;
let arrLevels = [];
let arrScores = [];
let level = [];
let currentLevGame = [];

console.log(currentLev)


acBtn.onclick = () => {
  userAnswer.textContent = '';
}

deleteBtn.onclick = () => {
  userAnswer.textContent = userAnswer.textContent.substring(0, userAnswer.textContent.length - 1);
}

backBtn.onclick = () => {
  window.location.href = 'game-level.html';
}

restartBtn.onclick = () => {
  const effect = document.querySelectorAll('.restart-effect')[0];
  console.log(effect)
  wrongAnswer = 0;
  correctAnswer = 0;
  numQuestions = 1;
  finalAnswer = 0;
  headInfo[0].textContent = `Level: ${difficultyLevel.toLocaleUpperCase()}`;
  headInfo[2].textContent = `Correct: ${correctAnswer}/${totalQuestions}`;
  headInfo[1].textContent = `Q: ${numQuestions}/${totalQuestions}`;
  effect.style.top = "-200%";
  setTimeout(() => {
    effect.style.top = '120%';
  }, 500);
  
  generateProblem();
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

const generateNumbers = () => {
  let firstNum, secondNum, firstRandom, secondRandom;
  const chance = Math.round((Math.random() * -1) * 10) / 10;

  switch(currentLev) {
    case 'easy':
      if (Math.random() < 0.4) {
        firstRandom = Math.floor(Math.random() * 9 + 1);
        secondRandom = Math.floor(Math.random() * 9 + 1);
      } else {
        firstRandom = Math.floor(Math.random() * 30 + 1);
        secondRandom = Math.floor(Math.random() * 30 + 1);
      }
      break;

    case 'average':
      if (Math.random() < 0.4) {
        firstRandom = Math.floor(Math.random() * 31 + 30);
        secondRandom = Math.floor(Math.random() * 11 + 29);
      } else {
        firstRandom = Math.floor(Math.random() * 31 + 30);
        secondRandom = Math.floor(Math.random() * 31 + 30);
      }
      break;
    case 'difficult':
      if(difficultyLevel === 'divide') {
        firstNum = Math.floor(Math.random() * 70 + 30);
      }

      firstRandom =  Math.floor(Math.random() * 40) + 60;
      secondRandom = Math.floor(Math.random() * 40) + 60;
      break; 
  }

  firstNum = Math.max(firstRandom, secondRandom);
  secondNum = Math.min(firstRandom, secondRandom);

  if(chance === -0.8) {
    firstNum *= - 1;
    secondNum *= -1;
  } else if(chance === -0.6) {
    firstNum *= -1;
  } else if(chance === -0.5){
    secondNum *= -1;
  }
  return {firstNum, secondNum};
}



// Generate a new math problem
const generateProblem = () => {
  userAnswer.textContent = '';
  userAnswer.style.color = '#FFFFFF';

  let {firstNum, secondNum} = generateNumbers();

  // if (firstNum < secondNum) {
  //   [firstNum, secondNum] = [secondNum, firstNum];
  // }

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

  switch (difficultyLevel) {
    case 'add':
      result = firstNum + secondNum;
      operator = "+";
      break;
    case 'subtract':
      result = firstNum - secondNum;
      operator = "-";
      break;
    case 'multiply':
      result = firstNum * secondNum;
      operator = "x";
      break;
    case 'divide':
      result = firstNum / secondNum;
      operator = "÷";
      break;
  }
  return { result, operator };
};

// Check the user's answer and update the score
checkBtn.onclick = () => {
  if(userAnswer.textContent.length === 0) {
    setTimeout(() => {
      answerContainer.style.borderColor = 'red';
      setTimeout(() => {
        answerContainer.style.borderColor = 'white';
      }, 600)
    }, 400);
    return;
  }

  let audio; 
  if (Number(userAnswer.textContent) === finalAnswer) {
    ++correctAnswer;
    headInfo[2].textContent = `Correct: ${correctAnswer}/${totalQuestions}`;
    audio = new Audio('music/Correct Answer Sound Effect.mp3');
  } else {
    ++wrongAnswer;
    audio = new Audio('music/Incorrect sound effect.mp3');
  };
  numQuestions++; 
  if(numQuestions <= totalQuestions) {
    headInfo[1].textContent = `Q: ${numQuestions}/${totalQuestions}`;
  }

  audio.volume = 0.9;
  userAnswer.style.color = Number(userAnswer.textContent) === finalAnswer ? "#00BF63": "#FF4136";
  audio.play();
  setTimeout(generateProblem, 1000);
 
  
  if(numQuestions === totalQuestions + 1 ) {
    localStorage.setItem('Correct', correctAnswer);
    localStorage.setItem('Wrong', wrongAnswer);
    
    if(correctAnswer > wrongAnswer) {
      const score = JSON.parse(localStorage.getItem('mainScores')) || Scores;
      const currentScore = score[currentLev] += correctAnswer;
      score[currentLev] = currentScore;
      localStorage.setItem('mainScores', JSON.stringify(score));

      arrLevels.push(nextDifficultyLevel);
      currentLevGame.push(nextDifficultyLevel);
      arrScores.push(correctAnswer);
    
      if (localStorage.getItem('Difficulty')) {
        const savedDifficultyLevels = JSON.parse(localStorage.getItem('Difficulty'));
        arrLevels = arrLevels.concat(...savedDifficultyLevels);
      }
      const savedScores = JSON.parse(localStorage.getItem('Scores'));
      arrScores = localStorage.getItem('Scores') ? arrScores.concat(...savedScores) : arrScores ;

      if(localStorage.getItem(`${currentLev}`)) {
        const savedLevels = JSON.parse(localStorage.getItem(`${currentLev}`));
        currentLevGame = currentLevGame.concat(...savedLevels);
      }

      localStorage.setItem('Scores', JSON.stringify(arrScores));
      localStorage.setItem('Difficulty', JSON.stringify(arrLevels));
      localStorage.setItem('NextDifficulty', nextDifficultyLevel);
      localStorage.setItem(`${currentLev}`, JSON.stringify(currentLevGame));
    } else {
      localStorage.setItem('CurrentLevel', difficultyLevel);
    }
    
    if (difficultyLevel === 'divide' && correctAnswer > wrongAnswer) {
      level.push(nextLev);
      if(level) {
        const savedLevel = JSON.parse(localStorage.getItem("level"));
        level = savedLevel ? level.concat(...savedLevel) : level;
      }
      localStorage.setItem('level', JSON.stringify(level));
      if(currentLev === 'difficult') {
        window.location.href = 'tally.html';
      } else window.location.href ='game-difficulty.html';
    } else {
      window.location.href = 'result.html';
    }   
  }
};

headInfo[0].textContent = `Level: ${difficultyLevel.toLocaleUpperCase()}`;
headInfo[2].textContent = `Correct: ${correctAnswer}/${totalQuestions}`;
headInfo[1].textContent = `Q: ${numQuestions}/${totalQuestions}`;
generateProblem(); // Generate the first math problem

