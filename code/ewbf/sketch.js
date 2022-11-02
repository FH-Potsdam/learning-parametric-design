const colors = ['#008BD2', '#ED7203', '#E5007E', '#82368C'];
const dColor = '#000000';

let theFont;

function preload(){
  theFont = loadFont('SpaceGrotesk-Regular.otf');
}

let colorSelects = [];
let seedInput;
let weightSliders = [];

let permissionGranted = false;

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

  // if (
  //   typeof DeviceOrientationEvent !== "undefined" &&
  //   typeof DeviceOrientationEvent.requestPermission === "function"
  // ) {
  //   //ios device

  //   DeviceOrientationEvent.requestPermission()
  //     .catch(() => {
  //       let button = createButton("click to allow access to sensors");
  //       button.style("font-size", "24px");
  //       button.center();
  //       button.mousePressed(requestAccess);
  //       throw error;
  //     })
  //     .then(() => {
  //       permissionGranted = true;
  //     });
  // } else {
  //   //non ios device
  //   permissionGranted = true;
  // }
}

// function requestAccess() {
//   DeviceOrientationEvent.requestPermission().then((response) => {
//     if (response == "granted") {
//       permissionGranted = true;
//     } else {
//       permissionGranted = false;
//     }
//   });
//   this.remove();
// }

let waver = 0;
let listening = false;
const deviceRotation = {
  x: 0,
  y: 0,
  z: 0
};

// function handleOrientation(event) {
//   deviceRotation.z = event.alpha || 0;
//   deviceRotation.x = event.beta || 0;
//   deviceRotation.y = event.gamma || 0;
// }

function draw() {
  if (permissionGranted && !listening) {
    // window.addEventListener("deviceorientation", handleOrientation);
    listening = true;
  }

  randomSeed(parseInt(seedInput.value())*1777);

  rotateX(180);
  background(255);

  noStroke();
  strokeWeight(2);

  push();

  // rotateZ(deviceRotation.x);
  // rotateX(deviceRotation.y);
  // rotateY(deviceRotation.z);

  translate(0, 0, -40);
  noFill();

  for (let i = 0; i < 4; i += 1) {
    stroke(colorSelects[i].value());
    drawCircle(weightSliders[i].value() + noise(i, waver) * 20);
    translate(0, 0, 20);
  }

  pop();

  decorations();
  // noLoop();

  waver += 0.02;
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

  push();
  translate(180, -180);
  fill('black');
  noStroke();
  textSize(8);
  textAlign(RIGHT);
  let y = 0;
  text('X:' + (rotationX || deviceRotation.x), 0, y);
  y += 20;
  text('Y:' + deviceRotation.y, 0, y);
  y += 20;
  text('Z:' + deviceRotation.z, 0, y);
  pop();
}

function drawCircle(radiusDiff) {
  const maxIter = 10;
  const radiusMin = 75;
  const radiusMax = radiusMin + radiusDiff;
  const offset = 15; // TODO: Bigger Radius > Bigger Offset (Smoother)

  const points = [];
  for (let i = 0; i <= maxIter; i += 1) {
    points.push(random(radiusMin, radiusMax));
  }
  points.push(points[0]);

  const max = Math.max(radiusMin + 1,...points) - radiusMin;
  const iterations = Math.ceil(max / 5);

  for (let iter = 0; iter < iterations; iter += 1) {
    beginShape();
    for (let i = 0; i <= maxIter + 1; i += 1) {
      let radius = radiusMin + (points[i] - radiusMin) / iterations * iter;
      let angle = 360 / (maxIter + 1) * i;

      const p = polarCoords(angle, radius);
      // const c2 = calcOffset(angle, radius, offset);
      const c1 = calcOffset(angle, radius, -offset*(radius/100));

      if (i === 0) {
        vertex(p.x, p.y);
      } else {
        radius = radiusMin + (points[i - 1] - radiusMin) / iterations * iter;
        angle = 360 / (maxIter + 1) * (i - 1);

        // const lp = polarCoords(angle, radius);
        const lc2 = calcOffset(angle, radius, offset*(radius/100));
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