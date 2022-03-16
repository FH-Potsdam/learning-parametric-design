function preload(){
  // preload assets
}

function setup() {
  createCanvas(400, 400, SVG);
}

function draw() {
  background(255);
  fill(0);

  translate(200, 200);
  circle(0, 0, 200);
}

function keyPressed() {
  save('image.svg');
}
