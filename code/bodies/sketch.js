function preload(){
  // preload assets
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // full view
  camera(0, -300, 600);
  frameRate(30);
}

function polarPoint (radius, angle) {
  const rad = Math.PI / 180 * angle;
  return {
    x: radius * Math.cos(rad),
    y: radius * Math.sin(rad)
  };
}

const numPoints = 8;
const maxRadius = 40;
let zNoise = 0;
let levels = [];
let zDist = 0.1;
const maxLevels = 60;
const roundNess = 2; // 5

let breakMode = false;
let nextBreak = 10;
let breakCount = 0;
let breakDist = 0;

let rotationCounter = 0;

let growCount = 0;
const growMax = 200;
const fadeMax = 500;

function draw() {
  pointLight(200, 200, 200, -width/2, -400, 300);
  pointLight(200, 200, 200, width/2, -400, 300);
  // ambientMaterial(255);
  normalMaterial();

  if (zDist < 4) {
    zDist += 0.02;
  }

  scale(1.5);
  rotateX(Math.PI/180*90);
  rotateZ(Math.PI/180*rotationCounter);
  rotationCounter += 0.1;
  translate(0, 0, -100);
  // orbitControl();
  background(0);
  noFill();
  stroke('white');

  if (growCount < growMax) {

    const w = 10 + noise(-1, zNoise) * 300;

    // line(-w/2, 0, w/2, 0);

    let hasBreak = false;

    if (breakCount > nextBreak) {
      breakCount = 0;
      nextBreak = random(
        breakMode ? 3 : 10,
        breakMode ? 6 : 20
      );
      breakMode = !breakMode;
      breakDist = random(10, 20);
      hasBreak = true;
    }

    breakCount += 1;

    const points = new Array(numPoints * 2 - 2);
    const breakPoints = new Array(numPoints * 2 - 2);

    for (let x = 0; x < numPoints; x += 1) {
      const tx = -w/2 + w / (numPoints - 1) * x;
      // circle(
      //   tx,
      //   0,
      //   5
      // );
      const p = polarPoint(maxRadius + noise(x / roundNess, zNoise) * 200, 180 - 180 / (numPoints - 1) * x);
      points[x] = [
        p.x + tx,
        p.y + 0
      ];

      const bp = polarPoint(maxRadius + noise(x / roundNess, zNoise) * 200 - breakDist, 180 - 180 / (numPoints - 1) * x);
      breakPoints[x] = [
        bp.x + tx,
        bp.y + 0
      ];

      // line(
      //   tx,
      //   0,
      //   p.x + tx,
      //   p.y + 0
      // );
      if (x > 0 && x < numPoints - 1) {
        points[numPoints * 2 - 2 - x] = [
          p.x + tx,
          p.y * -1 + 0
        ];

        breakPoints[numPoints * 2 - 2 - x] = [
          bp.x + tx,
          bp.y * -1 + 0
        ];
        // line(
        //   tx,
        //   0,
        //   p.x + tx,
        //   p.y * -1 + 0
        // );
      }
    }

    zNoise += 0.005;
    
    if (hasBreak && breakMode) {
      levels.unshift(breakPoints);
      levels.unshift(points);
    } else if (hasBreak && !breakMode) {
      levels.unshift(points);
      levels.unshift(breakPoints);
    } else if (!breakMode) {
      levels.unshift(breakPoints);
    } else {
      levels.unshift(points);
    }
    
    levels = levels.slice(0,maxLevels);
  }
  growCount += 1;

  let fadeColor = 255;

  if (growCount > fadeMax) {
    fadeColor -= (growCount-fadeMax) * 3;
  }

  fill(fadeColor);
  noStroke();

  //  normal();

  levels.forEach((l, z) => {
    if (z < levels.length - 1 && levels[z + 1] && levels[z]) {
      beginShape(TRIANGLE_STRIP);
      for (let x = 0; x < l.length; x += 1) {
        normal(l[x][0], l[x][1], 0);
        vertex(l[x][0], l[x][1], z * zDist);
        normal(levels[z + 1][x][0], levels[z + 1][x][1], 0);
        vertex(levels[z + 1][x][0], levels[z + 1][x][1], (z + 1) * zDist);
      }
      normal(l[0][0], l[0][1], 0);
      vertex(l[0][0], l[0][1], z * zDist);
      normal(levels[z + 1][0][0], levels[z + 1][0][1], 0);
      vertex(levels[z + 1][0][0], levels[z + 1][0][1], (z + 1) * zDist);
      endShape();
    } else if (levels[z]) {
      beginShape(TRIANGLE_FAN);
      // normal(0, 0, 0);
      vertex(0, 0, z * zDist);
      for (let x = 0; x < l.length; x += 1) {
        // normal(0, 0, 0);
        vertex(l[x][0], l[x][1], z * zDist);
      }
      // normal(0, 0, 0);
      vertex(l[0][0], l[0][1], z * zDist);
      endShape();
    }
  });


  noFill();
  levels.forEach((l, z) => {
    if (z === 0 || z === levels.length - 1) {
      stroke(fadeColor);
    } else {
      stroke(fadeColor/2 + 30);
    }
    if (l) {
      beginShape(TESS);
      curveVertex(l[0][0], l[0][1], z * zDist);
      l.forEach(p => {
        curveVertex(p[0], p[1], z * zDist);
      });
      curveVertex(l[0][0], l[0][1], z * zDist);
      endShape(CLOSE);
    }
  });

  if (growCount > fadeMax + 100) {
    zDist = 0.1;
    levels = [];
    breakMode = false;
    nextBreak = 10;
    breakCount = 0;
    breakDist = 0;
    rotationCounter = 0;
    growCount = 0;
  }
}