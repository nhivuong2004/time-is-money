let bg;
let customFont;
let score = 0;
let list = ["overtime", "scheduling", "typing", "report writing", "emailing", "documenting","memo","contract","software","workflow","office","plan"];
givenWord = "ready?";
typedWord = "";
let shakeAmount = 0;
let shakeDuration = 0;
let isGameOver = false;
let gameoverImage;
let firstWordTime = 0;
let warningImage;
let cashSound;
let alarmSound;
let overSound;

// Decrease money
let wordStartTime = 0;
let scorePenaltyStarted = false;
let lastPenaltyTime = 0;

// Warning logic
let warningVisible = false;
let warningStartTime = 0;
let warningShownForThisWord = false;
let hasTyped = false;

function preload() {
  customFont = loadFont('SawtonCircular-Medium.otf');
  gameoverImage = loadImage('burnedout.png');
  warningImage = loadImage('noti.png');
  cashSound = loadSound('cashsound.mp3');
  alarmSound = loadSound('alarmsound.mp3');
  overSound = loadSound('oversound.mp3')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bg = loadImage('digital.jpg');
  timeRunning = 0;
}

function draw() {
  background(bg);

  // Game over popup
  if (isGameOver) {
    image(gameoverImage, 0, 0, width, height);
    return;
  }

  // Text: time is money
  push();
  textAlign(CENTER, BOTTOM);
  textFont(customFont);
  textSize(30);
  fill(250, 200, 75);
  text('Time is money', width / 2, height - 30);
  pop();

  // Score money
  push();
  textFont(customFont);
  textSize(80);
  fill(250, 200, 75);
  textAlign(RIGHT, TOP);
  text("salary: £" + score, width - 80, 50);
  pop();

  // Shake effect
  let shakeX = 0;
  let shakeY = 0;
  if (shakeDuration > 0) {
    shakeX = random(-shakeAmount, shakeAmount);
    shakeY = random(-shakeAmount, shakeAmount);
    shakeDuration--;
  }

  // Score text box
  let boxX = 750 + shakeX;
  let boxY = height - 190 + shakeY;
  push();
  fill(250, 200, 75);
  noStroke();
  rectMode(CENTER);
  rect(boxX, boxY, 500, 100, 10);

  // Time tracking
  if (timeRunning === 1 && givenWord !== "ready?" && !scorePenaltyStarted) {
    if (millis() - wordStartTime > 12000 && typedWord !== givenWord) {
      scorePenaltyStarted = true;
      lastPenaltyTime = millis();
    }
  }

  let totalSeconds = int(millis() / 1000);
  let hours = int(totalSeconds / 3600);
  let minutes = int((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;
  let timeString = nf(hours, 2) + ':' + nf(minutes, 2) + ':' + nf(seconds, 2);

  // Display time
  textFont(customFont);
  textSize(80);
  fill(250, 200, 75);
  text(timeString, 90, 140);

  // Decrease score over time
  if (scorePenaltyStarted && typedWord !== givenWord) {
    if (millis() - lastPenaltyTime > 1000) {
      score -= 1;
      lastPenaltyTime = millis();
    }
  }

  // Typed word
  fill(0, 150, 199);
  textSize(60);
  textAlign(CENTER, CENTER);
  text(typedWord, boxX, boxY);
  pop();

  // Show given word
  if (timeRunning === 1) {
    push();
    textFont(customFont);
    textSize(100);
    fill(250, 200, 75);
    textAlign(CENTER, CENTER);
    text(givenWord, width / 2, height / 2 - 100);
    pop();

    // Show warning after 5s of no typing, for 3s only
    if (
      givenWord !== "ready?" &&
      !hasTyped &&
      !warningShownForThisWord &&
      millis() - wordStartTime > 5000
    ) {
      warningVisible = true;
      alarmSound.play();
      warningStartTime = millis();
      warningShownForThisWord = true;
    }

    if (warningVisible && millis() - warningStartTime > 1800) {
      warningVisible = false;
    }

    if (warningVisible) {
      let warningWidth = 1094;
      let warningHeight = 734;
      let x = width / 2 - warningWidth / 2;
      let y = height / 2 - 320;
      image(warningImage, x, y, warningWidth, warningHeight);
    }
  }

  // Game start screen
  gameOn();
  // Game over check
  gameOver();
}

function wordGen() {
  let newWord;
  do {
    newWord = random(list);
  } while (newWord === givenWord); // Ensure it's different

  givenWord = newWord;
  wordStartTime = millis();
  scorePenaltyStarted = false;
  lastPenaltyTime = millis();

  // Reset warning logic
  warningVisible = false;
  warningShownForThisWord = false;
  hasTyped = false;

  if (firstWordTime === 0) {
    firstWordTime = millis();
  }
}

function keyTyped() {
  if (timeRunning === 1 && key !== ENTER) {
    hasTyped = true; // Mark that player has started typing
    typedWord += key;

    if (typedWord === givenWord) {
      console.log("---SUCCESS---");
      score += 1;
      cashSound.play();
      wordGen();
      typedWord = "";
      scorePenaltyStarted = false;
      return;
    }

    let l = Math.min(givenWord.length, typedWord.length);
    for (let i = 0; i < l; i++) {
      if (givenWord.charAt(i) !== typedWord.charAt(i)) {
        console.log("WRONG letter");
        typedWord = "";
        shakeDuration = 10;
        shakeAmount = 5;
        break;
      }
    }
  }
}

function gameOn() {
  if (timeRunning == 0) {
    push();
    textSize(50);
    textFont(customFont);
    fill(250, 200, 75);
    textAlign(CENTER, CENTER);
    text("click the mouse to begin", width / 2, height / 2);
    pop();
  }
}

function mousePressed() {
  if (timeRunning == 0) {
    timeRunning = 1;
    wordGen();
  }
}

function gameOver() {
  if (
    timeRunning === 1 &&
    score <= 0 &&
    firstWordTime > 0 &&
    millis() - firstWordTime > 6000
  ) {
    isGameOver = true;
    overSound.play();
  }
} 