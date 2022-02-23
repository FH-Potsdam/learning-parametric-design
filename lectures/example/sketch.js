function setup() {
  createCanvas(400, 400);
}

function draw() {
  noLoop();
  background(255);
  noFill();
  stroke(0);
  strokeWeight(1);

  beginShape();
  vertex(0, 0);
  bezierVertex(20, 50, 80, 100, 100, 100);
  bezierVertex(150, 100, 180, 150, 200, 200);
  endShape();

  stroke("red");
  strokeWeight(5);
  point(0, 0);
  point(100, 100);
  point(200, 200);
  stroke("blue");
  point(20, 50);
  point(80, 100);
  point(120, 100);
  point(180, 150);
  strokeWeight(1);
  line(0, 0, 20, 50);
  line(100, 100, 80, 100);
  line(100, 100, 120, 100);
  line(200, 200, 180, 150);
}