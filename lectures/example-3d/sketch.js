function preload(){
  // preload assets
}

function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES);
}

let r = 1;

function draw() {
  background(255);

  shininess(1);
  ambientLight(255);
  specularColor(155, 155, 155);
  pointLight(155, 155, 155, 0, -300, 0);

  rotateX(r);
  rotateY(r);

  specularMaterial(200, 0, 0);
  box(100);

  beginShape();
  vertex(-120, 0, 0);
  vertex(0, 120, 0);
  vertex(120, 0, 0);
  vertex(0, -120, 0);
  endShape(CLOSE);

  r += 1;
}