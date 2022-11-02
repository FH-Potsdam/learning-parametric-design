function preload(){
  // preload assets
}

let w, h;

function setup() {
  w = windowWidth;
  h = windowHeight;
  createCanvas(w, h, WEBGL);
  angleMode(DEGREES);
  smooth();
}

const gridSize = 40;
const maxDepth = 40;

let yOffset = 0;

function draw() {
  orbitControl();
  background(0);
  strokeWeight(1);
  rotateX(80);
  translate(0, -100, 0);

  fill('black');
  // noFill();

  for (let x = 0; x < gridSize; x += 1) {
    for (let y = 0; y < gridSize; y += 1) {
      stroke(
        lerpColor(
          color(216, 145, 42, 0),
          color(216, 42, 137, 255),
          y/gridSize
        )
      );

      const h = noise(x/10, (y + yOffset)/10) * 100;
      push();
      translate(
        w / -2 + w / gridSize * x,
        w / gridSize * y,
        h/2
      )
      box(
        w / gridSize,
        w / gridSize,
        h
      );
      pop()
    }
  }

  yOffset += 1;
}