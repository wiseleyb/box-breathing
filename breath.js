class Circle {
  constructor(x, y, minSize, maxSize, direction, time) {
    this.x = x;
    this.y = y;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.time = time;
    this.fps = 60;

    // figure out how much to change size based on max-minSize at fps over time
    var sz = this.maxSize - this.minSize;
    var ms = this.fps * this.time;
    this.direction = sz / ms * direction;

    if (this.direction > 0) {
      this.directionText = '🔼 Breath In: ';
    } else {
      this.directionText = '🔽 Breath Out: ';
    };

    this.reset();
  }

  draw() {
    if (this.currentSize <= this.maxSize && this.currentSize >= this.minSize) {
      this.tickTock();
      fill(51);
      setCircleGradient();
      circle(this.x, this.y, this.currentSize);
      fill(51);
      this.currentSize += this.direction;
      return true;
    }
    return false;
  }

  tickTock() {
    this.fpsCnt += 1;
    if (this.fpsCnt % this.fps == 0) {
      this.currentTime -= 1;
    };
    stepTitle(this.directionText + this.currentTime, this);
  }

  reset() {
    this.fpsCnt = 0
    this.currentTime = this.time;
    if (this.direction > 0) {
      this.currentSize = this.minSize;
    } else {
      this.currentSize = this.maxSize;
    }
  }
}

class Hold {
  constructor(x, y, maxSize, time) {
    this.x = x;
    this.y = y;
    this.maxSize = maxSize;
    this.time = time;
    this.fps = 60;
    this.stepSize = (2 * PI) / (this.fps * this.time);
    this.directionText = '🚫 Hold: ';

    this.reset();
  }

  draw() {
    this.timeLeft -= 1;
    stroke(0);
    //circle(this.x, this.y, this.maxSize);
    this.tickTock();
    if (this.timeLeft > 0) {
      this.currentStep += this.stepSize;
      fill(51);
      setCircleGradient();
      arc(this.x,
          this.y,
          this.maxSize,
          this.maxSize,
          - HALF_PI,
          - HALF_PI + this.currentStep,
          PIE);
      fill(51);
      noFill();

      return true;
    }
    return false;
  }

  tickTock() {
    this.fpsCnt += 1;
    if (this.fpsCnt % this.fps == 0) {
      this.currentTime -= 1;
    };
    stepTitle(this.directionText + this.currentTime, this);
  }

  reset() {
    this.fpsCnt = 0
    this.currentTime = this.time;
    this.timeLeft = this.time * this.fps;
    this.currentStep = 0;
  }
}

function stepTitle(title, klass) {
  //textAlign(CENTER, CENTER);
  stroke(0);
  fill(colors['colorTextBG']);
  x1 = klass.x - (klass.maxSize / 2);
  x2 = klass.maxSize - 10;
  y1 = klass.y - (klass.maxSize / 2) - 60;
  y2 = 55;
  rect(x1, y1, x2, y2, 5);
  noStroke();
  stroke(colors['colorFont']);
  fill(colors['colorFont']);
  textAlign(CENTER, CENTER);
  text(title, x1, y1, x2, y2);
  /*
  text(title,
       klass.x - 50,
       klass.y - (klass.maxSize / 2) - 10);
       */
}

var breathCanvas;
var steps;
var stepsIdx;
var stepDesc;
var cycles;
var colors = {};

function setup() {
  var formSteps = params('steps', 'in-3,hold-3,out-3,hold-3');
  $('#steps').val(formSteps);

  colors['colorBackground1'] = params('colorBackground1', '#ffffff');
  colors['colorBackground2'] = params('colorBackground2', '#346eeb');
  colors['colorCircle1'] = params('colorCircle1', '#eb3734');
  colors['colorCircle2'] = params('colorCircle2', '#ebe534');
  colors['colorFont'] = params('colorFont', '#000000');
  colors['colorTextBG'] = params('colorTextBG', '#ffffff');

  $('#colorBackground1').val(colors['colorBackground1']);
  $('#colorBackground2').val(colors['colorBackground2']);
  $('#colorCircle1').val(colors['colorCircle1']);
  $('#colorCircle2').val(colors['colorCircle2']);
  $('#colorFont').val(colors['colorFont']);
  $('#colorTextBG').val(colors['colorTextBG']);

  textSize(64);

  // Creates a canvas with 800px width and 600px height
  // breathCanvas = createCanvas(800, 600);
  breathCanvas = createCanvas(windowWidth, windowHeight);
  breathCanvas.parent('breathCanvasDiv');
  var x = width / 2;
  var y = height / 2;
  var m = 50;
  var s = 500;

  var inputSteps = $('#steps').val().split(',');
  steps = [];
  stepDesc = [];
  //console.log(inputSteps);
  for (i = 0; i < inputSteps.length; i++) {
    var step = inputSteps[i];
    var s1 = step.split("-")[0];
    var s2 = step.split("-")[1];
    //console.log(s1, s2);
    switch(s1) {
      case 'in':
        steps.push(new Circle(x, y, m, s, 1, s2));
        stepDesc.push('🔼 ' + s2);
        break;
      case 'out':
        steps.push(new Circle(x, y, m, s, -1, s2));
        stepDesc.push('🔽 ' + s2);
        break;
      case 'hold':
        steps.push(new Hold(x, y, s, s2));
        stepDesc.push('🚫 ' + s2);
        break;
    }
  }
  //console.log(steps);
  /*
  steps = [
    new Circle(x, y, m, s, 1, 5),
    new Hold(x, y, s, 4),
    new Circle(x, y, m, s, -1, 3),
    new Hold(x, y, m, 2)
  ];
  */
  stepsIdx = 0;
  cycles = 0;
}

function draw() {
  clear();
  drawBackgroundGradient()
  showStats();
  drawStep();
  showSteps();
}

function drawBackgroundGradient() {
  //background(50);
  let gradient = drawingContext.createLinearGradient(20,20, width-20,height-20);
  gradient.addColorStop(0, colors['colorBackground1']);
  gradient.addColorStop(1, colors['colorBackground2']);
  drawingContext.fillStyle = gradient;
  noStroke();
  rect(0, 0, width, height, 10);
}

function setCircleGradient() {
  let gradient = drawingContext.createLinearGradient(20,20, width-20,height-20);
  gradient.addColorStop(0, colors['colorCircle1']);
  gradient.addColorStop(1, colors['colorCircle2']);
  drawingContext.fillStyle = gradient;
}

function drawStep() {
  if (steps[stepsIdx].draw()) {
  } else {
    steps[stepsIdx].reset();
    stepsIdx += 1;
    if (stepsIdx > steps.length - 1) {
      stepsIdx = 0
      cycles += 1;
    };
    steps[stepsIdx].draw();
  }
}

function showStats() {
  var d = new Date();
  x1 = 25;
  y1 = height - 125;
  x2 = 150;
  y2 = 100;

  stroke(51);
  fill(colors['colorTextBG']);
  rect(x1, y1, x2, y2, 5);
  fill(colors['colorFont']);
  stroke(colors['colorFont']);
  let str = 'Cycles: ' + cycles + "\n" + d.toLocaleTimeString();
  textSize(20);
  textAlign(LEFT, CENTER);
  text(str, x1 + 10, y1, x2, y2);
  noFill();
}

function showSteps() {
  for (i = 0; i < stepDesc.length; i++) {
    noStroke();
    if (i == stepsIdx) {
      stroke(0);
      fill(colors['colorTextBG']);
      rect(25, 75 + (50 * i), 75, 50, 5);
    }
    stroke(colors['colorFont']);
    fill(colors['colorFont']);
    textAlign(CENTER, CENTER);
    text(stepDesc[i], 25, 75 + (50 * i), 75, 50, 5);
  }
}

function mouseClicked() {
  if (isLooping()) { noLoop(); } else { loop(); };
}

function doubleClicked() {
  showFullscreen();
}

function showFullscreen() {
  var elem = document.querySelector(".p5Canvas");

  elem.requestFullscreen()
    .then(function() {
      fullScreen = true;
    })
    .catch(function(error) {
      fullScreen = false;
      alert("Full-screen couldn't be started");
    });
}

function params(sParam, sDefault) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return sDefault;
};
