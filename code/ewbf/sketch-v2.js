const colors = ['#008BD2', '#ED7203', '#E5007E', '#82368C'];
const dColor = '#000000';

let theFont;

function preload(){
  theFont = loadFont('SpaceGrotesk-Regular.otf');
}

let colorSelects = [];
let seedInput;
let weightSliders = [];

function setup() {
  createCanvas(400, 400, WEBGL);
  angleMode(DEGREES);
  ortho(-width / 2, width / 2, height / 2, -height / 2, 0, 500);
  textFont(theFont);

  const allColors = [dColor, ...colors];
  for (let i = 0; i < 4; i += 1) {
    const colorSelect = createSelect();
    colorSelect.position(20, 420 + i * 30);
    allColors.forEach(c => {
      colorSelect.option(c);
    });
    colorSelects.push(colorSelect);

    const slider = createSlider(0, 100, 0);
    slider.position(100,  420 + i * 30);
    weightSliders.push(slider);
  }

  seedInput = createInput((new Date()).getDate());
  seedInput.position(20, 550);
}

function draw() {
  randomSeed(parseInt(seedInput.value())*1777);

  rotateX(180);
  background(255);

  noStroke();
  strokeWeight(2);

  push();
  rotateX(mouseY/2);

  const diff = mouseX/2;

  translate(0, 0, -40);
  noFill();

  for (let i = 0; i < 4; i += 1) {
    stroke(colorSelects[i].value());
    drawCircle(weightSliders[i].value());
    translate(0, 0, 20);
  }

  pop();

  decorations();
  // noLoop();
}

function decorations() {
  push();
  stroke('black');
  strokeWeight(1);
  noFill();
  translate(-160, 180, 0);
  rotateX(65);
  circle(0, 0, 40);
  translate(0, 0, 5);
  circle(0, 0, 40);
  translate(0, 0, 5);
  circle(0, 0, 40);
  translate(0, 0, 5);
  circle(0, 0, 40);
  rotateX(-75);
  fill('black');
  noStroke();
  textSize(16);
  text('EWBF/Berlin', 30, 13);
  pop();

  push();
  translate(-180, -180);
  fill('black');
  noStroke();
  textSize(8);
  const d = new Date();
  text(d.toString().split('(')[0], 0, 0);
  text('52°29\'55.2"N 13°22\'45.4"E', 0, 10);
  pop();

}

function drawCircle(radiusDiff) {
  const maxIter = 10;
  const radiusMin = 100;
  const radiusMax = radiusMin + radiusDiff;
  const offset = 25;

  const points = [];
  for (let i = 0; i <= maxIter; i += 1) {
    points.push(random(radiusMin, radiusMax));
  }
  points.push(points[0]);

  beginShape();
  for (let i = 0; i <= maxIter + 1; i += 1) {
    let radius = points[i];
    let angle = 360 / (maxIter + 1) * i;

    const p = polarCoords(angle, radius);
    // const c2 = calcOffset(angle, radius, offset);
    const c1 = calcOffset(angle, radius, -offset);

    if (i === 0) {
      vertex(p.x, p.y);
    } else {
      radius = points[i-1];
      angle = 360 / (maxIter + 1) * (i - 1);

      // const lp = polarCoords(angle, radius);
      const lc2 = calcOffset(angle, radius, offset);
      // const lc1 = calcOffset(angle, radius, -offset);

      bezierVertex(lc2.x, lc2.y, c1.x, c1.y, p.x, p.y);
    }

    // Circle Points
    // fill('black');
    // circle(p.x, p.y, 10);

    // Control Points
    // fill('red');
    // circle(c1.x, c1.y, 5);
    // circle(c2.x, c2.y, 5);

  }
  endShape();
}

function polarCoords(angle, radius) {
  const rad = Math.PI / 180 * angle;
  const x = radius * Math.cos(rad);
  const y = radius * Math.sin(rad);
  return {
    x, y
  };
}

function calcOffset(angle, radius, offset) {
  const offsetRadius = Math.pow((Math.pow(radius, 2) + Math.pow(offset, 2)), 1/2);
  const offsetAngle = Math.atan(offset/radius) / Math.PI * 180;
  return polarCoords(angle + offsetAngle, offsetRadius);
}