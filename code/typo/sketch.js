let h;
let w;
let c;
let gl;

function setup() {
  // setAttributes('preserveDrawingBuffer',true);
  // setAttributes('premultipliedAlpha', false);
  // setAttributes('alpha', true);

  h = windowHeight;
  w = windowWidth;
  c = createCanvas(w, h, WEBGL);
  pixelDensity(1);
  gl = c.GL;
  setAttributes('antialias', true);
  normalMaterial();
  bezierDetail(50);
  reset();
  resetBlocks();
  frameRate(30);
}

// --------------------- FACADE

let building;
let blockWidths;

let time = 0;
let animationTime = 100;
const waitTime = 350;
const aniMaxTime = 50;
let extraBlocks = 100;
let finishedGraph;

function resetBlocks() {
  finishedGraph = createGraphics(width, height);
  finishedGraph.setAttributes('antialias', true);
  finishedGraph.smooth();
  blockIterations += 1;
  animationTime = blockIterations * 200;
  extraBlocks = blockIterations * 200;

  building = {
    barWidth: [20, 100],
    padding: [100, 150, 300],
    steps: blockIterations,
    top: [],
    bottom: [],
    mid: [],
    left: [],
    right: [],
    lines: [],
    tLines: [], // extra lines
    fLines: {}, // finished lines
    sfLines: {}, // finished sub lines
    ttLines: [], // extra lines animation offset
  };

  blockWidths = [];

  time = 0;
  blockRotation = 0;

  building.left.push(
    [
      random(building.padding[1], building.padding[2]),
      random(building.padding[1], building.padding[2])
    ], 
    [
      building.padding[0],
      h / 2
    ],
    [
      random(building.padding[1], building.padding[2]),
      h - random(building.padding[1], building.padding[2])
    ]
  );

  building.right.push(
    [
      w - random(building.padding[1], building.padding[2]),
      random(building.padding[1], building.padding[2])
    ], 
    [
      w - building.padding[0],
      h / 2
    ],
    [
      w - random(building.padding[1], building.padding[2]),
      h - random(building.padding[1], building.padding[2])
    ]
  );

  ['top', 'bottom', 'mid'].forEach(key => {
    let pId = 0;
    switch (key) {
      case 'mid': pId = 1; break;
      case 'bottom': pId = 2; break;
    }
    // midPoint
    building[key].push(
      [
        building.left[pId][0] +
          (building.right[pId][0] - building.left[pId][0]) / 2,
        ((key !== 'mid')
          ? building.left[pId][1] +
          (building.right[pId][1] - building.left[pId][1]) / 2 +
          random(-building.padding[0], building.padding[0])
          : building.top[0][1] +
          (building.bottom[0][1] - building.top[0][1]) / 2
        ),
      ]
    );
  });

  ['top', 'bottom'].forEach(key => {
    let p1 = 0;
    let p2 = 1;
    if (key === 'bottom') {
      p1 = 1;
      p2 = 2;
    }
    for (let i = 0; i < building.steps + 2 + (key === 'bottom') ? 1 : 0; i += 1) {
      building.lines.push([
        [
          building.left[p1][0] + (building.left[p2][0] - building.left[p1][0]) / (building.steps + 2) * i,
          building.left[p1][1] + (building.left[p2][1] - building.left[p1][1]) / (building.steps + 2) * i
        ],
        [
          (key === 'top')
            ? building[key][0][0] + (building.mid[0][0] - building[key][0][0]) / (building.steps + 2) * i
            : building.mid[0][0] + (building[key][0][0] - building.mid[0][0]) / (building.steps + 2) * i,
          (key === 'top')
            ? building[key][0][1] + (building.mid[0][1] - building[key][0][1]) / (building.steps + 2) * i
            : building.mid[0][1] + (building[key][0][1] - building.mid[0][1]) / (building.steps + 2) * i
        ],
        [
          building.right[p1][0] + (building.right[p2][0] - building.right[p1][0]) / (building.steps + 2) * i,
          building.right[p1][1] + (building.right[p2][1] - building.right[p1][1]) / (building.steps + 2) * i
        ]
      ]);
    }
  });

  building.lines.forEach((l, li) => {
    const blocks = [];
    if (li < building.lines.length - 1) {
      let x = random(0,10);
      while (x < 95) {
        let w = random(5, 20);
        if (w + x > 100) {
          w = 100 - x;
        }

        let aniOffset = li;
        if (li >= Math.floor(building.lines.length/2)) {
          aniOffset = Math.abs(li - (building.lines.length - 2));
        }
        aniOffset /= building.lines.length/2;
        
        const topPos = random(20, 45);
        const bottomPos = 100 - topPos; // random(topPos + 5, topPos + 40)

        blocks.push([
          x, w,
          topPos, // topRand 2
          bottomPos, // bottomRand 3
          Math.max(0.05, (30 - Math.abs(19 - topPos)) / 100), // random(0.05, 0.15), // pin 4
          random(aniOffset, aniOffset + 0.2), // startAnimation 5
          random(aniMaxTime / 10, aniMaxTime) // animationDuration 6
        ]);

        x += w + random(5, 15);
      }
    }
    blockWidths.push(blocks);
  });

  for (let b = 0; b < extraBlocks; b += 1) {
    let x = random(0, 80);
    let w = random(0, 20);
    const tr = Math.random() * (building.lines.length - 2);
    const t = Math.round(tr);
    const h = random(0, 100);
    building.tLines.push(drawRect(
      building.lines[t],
      building.lines[t + 1],
      x, w,
      h, h + 2
    ));
    let aniOffset = tr;
    if (tr >= Math.floor(building.lines.length/2)) {
      aniOffset = Math.abs(tr - (building.lines.length - 2));
    }
    aniOffset /= building.lines.length/2;
    building.ttLines.push(aniOffset * animationTime);
  }
}

let blockRotation = 0;
let blockIterations = 0;

function drawRect(top, bottom, x, w, topRand, bottomRand) {
  const rectPoints = [];
  const lines = {top, bottom}; 
  ['top', 'bottom'].forEach(key => {
    const fullD = (lines[key][lines[key].length - 1][0] - lines[key][0][0]);
    const d = fullD / 100;
    const x_1_1 = lines[key][0][0] + d * x;
    const y_1_1 = findY(lines[key], x_1_1);
  
    const x_1_2 = lines[key][0][0] + d * (x + w);
    const y_1_2 = findY(lines[key], x_1_2);
  
    const addOn = [];
  
    // steps inbetween
    let startX = null;
    let endX = null;
    let tY = 0;
    while (tY < lines[key].length - 1) {
      if (lines[key][tY][0] <= x_1_1 && lines[key][tY + 1][0] >= x_1_1 && !startX) {
        startX = tY;
      }
      if (lines[key][tY][0] <= x_1_2 && lines[key][tY + 1][0] >= x_1_2 && !endX) {
        endX = tY;
      }
      tY += 1;
    }
    
    if (startX !== endX) {
      for (let tX = startX + 1; tX <= endX; tX += 1) {
        addOn.push([
          lines[key][tX][0],
          lines[key][tX][1]
        ]);
      }
    }

    let points = [
      [x_1_1, y_1_1],
      ...addOn,
      [x_1_2, y_1_2]
    ];

    rectPoints.push(points);
  });
  
  const morphRectPoints = [[],[]];
  for (let i = 0; i < rectPoints[0].length; i += 1) {
    [0,1].forEach(side => {
      const rand = (side === 0) ? topRand : bottomRand;
      morphRectPoints[side].push([
        rectPoints[0][i][0] + (rectPoints[1][i][0] - rectPoints[0][i][0]) / 100 * rand,
        rectPoints[0][i][1] + (rectPoints[1][i][1] - rectPoints[0][i][1]) / 100 * rand
      ]);
    });
  }

  const finalRectPoints = [...morphRectPoints[0], ...morphRectPoints[1].reverse()];

  return finalRectPoints;
}

function findY(line, x) {
  let y = null;
  let tx = 0;
  while (tx < line.length && y === null) {
    if (line[tx][0] > x || (tx === line.length - 1 && line[tx][0] === x)) {
      const dist = (x - line[tx-1][0]) / (line[tx][0] - line[tx-1][0]);
      y = line[tx-1][1] + (line[tx][1] - line[tx-1][1]) * dist;
    } else {
      tx += 1;
    }
  }
  if (!y) {
    y = line[line.length - 1][1];
  }
  return y;
}

// --------------------- BUILDING

let buildingCounter = 0;

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

// --------------------- FLOWFIELD

let params = {
  num: 500, // 1000,
  noiseScale: 550, // 500,
  noiseStrength: 2.6, // 5,
  transparency: 255, // 100,
  maxLength: 3, // 100,
  maxWidth: 1, // 5,
  numColors: 5,
  color1: 'rgb(255,255,255)', // '#58A69E',
  color2: 'rgb(200,200,200)', // '#F2F2F2',
  color3: 'rgb(155,155,155)', // '#D92B04',
  color4: 'rgb(100,100,100)', // '#8C2016',
  color5: 'rgb(55,55,55)'  // '#590202'
};

// let gui;
let processCount = 0;
let particles = [];

let noiseCount = 1;

let fieldTexture;

function reset() {
  fieldTexture = createGraphics(width, height);
  fieldTexture.background(0);

  noiseSeed(noiseCount);
  noiseCount += 1;
  particles = [];
  processCount = 0;
  for (let i = 0; i < params.num; i++) {
    var loc = createVector(random(width), random(height));
    var angle = random(0, Math.PI * 2);
    var dir = createVector(cos(angle), sin(angle));
    var speed = random(0.2, 1);
    particles.push(new Particle(loc, dir, speed, i));
  }
}

let transparency = 255;
let hideCounter = 0;
const maxCount = 1200;

class Particle{
  constructor(_loc,_dir,_speed,count){
    this.positions = [];
    this.loc = _loc;
    this.dead = false;
    this.dir = _dir;
    this.speed = _speed;
    this.stroke = random(1, map(count, 1, params.num, params.maxWidth, 1));
    this.color = color(params['color' + Math.round(random(1, params.numColors))]);
  }
  run() {
    if (!this.dead) {
      this.move();
      this.checkEdges();
    }
  }
  move(){
    let angle = noise(
      this.loc.x / params.noiseScale,
      this.loc.y / params.noiseScale,
      1 / params.noiseScale
    ) * TWO_PI * params.noiseStrength;
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    var vel = this.dir.copy();
    var d = 1;
    vel.mult(this.speed * d);
    this.loc.add(vel);
    this.positions.push({x: this.loc.x, y: this.loc.y});
    this.positions = this.positions.slice(-params.maxLength);
  }
  checkEdges(){
    if (this.loc.x < 0 || this.loc.x > width || this.loc.y < 0 || this.loc.y > height) {
      this.dead = true;
    }
  }
  draw(){
    if (!this.dead) { 
      fieldTexture.circle(this.positions[0].x, this.positions[0].y, 1);
    }
  }
}

// --------------------- TYPO

let phase = -3;

let counter = 0;

let velocity = 1;
const maxVelocity = 3;

let phaseSetup = true;

let points = [];
let backupPoints = [];

let innerDist = 0;
let outerDist = 0;

const innerDistMax = 100;
const outerDistMax = 200;

function createPoint () {
  const dx = random(-1, 1);
  const dy = random(-1, 1);
  const dx1 = random(-1, 1);
  const dy1 = random(-1, 1);
  const dx2 = random(-1, 1);
  const dy2 = random(-1, 1);
  points.push({
    x: random(0, w),
    y: random(0, h),
    dx: dx/Math.abs(dx),
    dy: dy/Math.abs(dx),
    cx1:null,
    cy1:null,
    dx1: dx1/Math.abs(dx1),
    dy1: dy1/Math.abs(dy1),
    cx2:null,
    cy2:null,
    dx2: dx2/Math.abs(dx2),
    dy2: dy2/Math.abs(dy2),
    r: 10,
    v: velocity,
    opacity: 0,
    partner: null,
    partnerEnd: false,
    partnerTowards: 0,
    segments: [],
    mx: null,
    my: null
  });
}

function randomizePoint(p) {
  const dx = random(-1, 1);
  const dy = random(-1, 1);
  const dx1 = random(-1, 1);
  const dy1 = random(-1, 1);
  const dx2 = random(-1, 1);
  const dy2 = random(-1, 1);

  p.dx = dx/Math.abs(dx);
  p.dy = dy/Math.abs(dx);
  p.dx1 = dx1/Math.abs(dx1);
  p.dy1 = dy1/Math.abs(dy1);
  p.dx2 = dx2/Math.abs(dx2);
  p.dy2 = dy2/Math.abs(dy2);

  return p;
}

let tempCounter = 0;
let waitCounter = 0;

let lineLength = 0;
let lineFadeout = 0;

const blinker = [];

function polar(radius, angle) {
  const rad = Math.PI / 180 * angle;
  const x = radius * Math.cos(rad);
  const y = radius * Math.sin(rad);
  return {
    x, y
  };
}

let skips = [];
let repitions = 0;

function draw() {
  if (phase === -3) {
    scale(2.5);
    if (phaseSetup) {
      while (points.length < 28) {
        createPoint();
      }
      const barWidth = 20;
      const barOffset = 100;
      const barHeight = 200;
      // bars
      for (let i = 0; i < 2; i += 1) {
        let dir = 1;
        if (i === 1) {
          dir = -1;
        }
        points[0 + i*8].x = (-barOffset - 2 * barWidth) * dir;
          points[0 + i*8].y = -barHeight / 2;
        points[1 + i*8].x = (-barOffset) * dir;
          points[1 + i*8].y = -barHeight / 2;
        points[2 + i*8].x = (-barOffset) * dir;
          points[2 + i*8].y = -barHeight / 2 + barWidth;
        points[3 + i*8].x = (-barOffset - barWidth) * dir;
          points[3 + i*8].y = -barHeight / 2 + barWidth;
        points[4 + i*8].x = (-barOffset - barWidth) * dir;
          points[4 + i*8].y = barHeight / 2 - barWidth;
        points[5 + i*8].x = (-barOffset) * dir;
          points[5 + i*8].y = barHeight / 2 - barWidth;
        points[6 + i*8].x = (-barOffset) * dir;
          points[6 + i*8].y = barHeight / 2;
        points[7 + i*8].x = (-barOffset - 2 * barWidth) * dir;
          points[7 + i*8].y = barHeight / 2;
      }
      for (let i = 0; i < 16; i += 1) {
        points[i].cx1 = points[i + ((i%8 === 0) ? +7 : -1)].x;
        points[i].cy1 = points[i + ((i%8 === 0) ? +7 : -1)].y;
        points[i].cx2 = points[i].x;
        points[i].cy2 = points[i].y;
      }

      const dotRadius = 20;
      const controlRadius = Math.sqrt(Math.pow(dotRadius/2,2) + Math.pow(dotRadius/4, 2));
      const dotOffset = 20;
      const dotYOffset = 50;
      let dotStart = -dotRadius - dotOffset;

      for (let i = 0; i < 3; i += 1) {
        for (let a = 0; a < 4; a += 1) {
          let p = polar(dotRadius/2, a * 90);
          points[16 + 4 * i + a].x = dotStart + p.x;
          points[16 + 4 * i + a].y = p.y + dotYOffset;

          p = polar(controlRadius, a * 90 - 60);
          points[16 + 4 * i + a].cx1 = dotStart + p.x;
          points[16 + 4 * i + a].cy1 = p.y + dotYOffset;

          p = polar(controlRadius, a * 90 - 30);
          points[16 + 4 * i + a].cx2 = dotStart + p.x;
          points[16 + 4 * i + a].cy2 = p.y + dotYOffset;
        }
        dotStart += dotRadius + dotOffset;
      }
    }
    background(0);

    noFill();
    fill('white');
    stroke('white');

    // leftBar
    beginShape(TESS);
    vertex(points[7].x, points[7].y);
    for (let p = 0; p < 8; p += 1) {
      bezierVertex(
        points[p].cx1,
        points[p].cy1,
        points[p].cx2,
        points[p].cy2,
        points[p].x,
        points[p].y
      );
    }
    endShape();

    // leftBar
    beginShape(TESS);
    vertex(points[15].x, points[15].y);
    for (let p = 8; p < 16; p += 1) {
      bezierVertex(
        points[p].cx1,
        points[p].cy1,
        points[p].cx2,
        points[p].cy2,
        points[p].x,
        points[p].y
      );
    }
    endShape();

    // dots
    for (let i = 0; i < 3; i += 1) {
      beginShape(TESS);
      vertex(
        points[16 + i * 4].x,
        points[16 + i * 4].y
      )
      for (let p = 1; p < 5; p += 1) {
        let pp = p;
        if (pp === 4) {
          pp = 0;
        }
        bezierVertex(
          points[16 + i * 4 + pp].cx1,
          points[16 + i * 4 + pp].cy1,
          points[16 + i * 4 + pp].cx2,
          points[16 + i * 4 + pp].cy2,
          points[16 + i * 4 + pp].x,
          points[16 + i * 4 + pp].y
        );
      }
      endShape(CLOSE);
    }

    if (skips.includes(-3)) {
      phase += 1;
      phaseSetup = true;
    }

  } else if (phase === -2) {
    if (phaseSetup) {
      tempCounter = 0;
      phaseSetup = false;
      for (let i = 0; i < 30; i += 1) {
        blinker.push(random(i/2, i));
      }
    }
    scale(2.5);
    background(0);

    fill(255 - Math.sin(tempCounter/1) * tempCounter);
    tempCounter += 1;
    if (tempCounter > 100 || skips.includes(-2)) {
      skips = [-2];
      noFill();
    }
  
    stroke('white');

    // leftBar
    beginShape(TESS);
    for (let p = 0; p < 8; p += 1) {
      vertex(points[p].x, points[p].y, 0);
    }
    vertex(points[0].x, points[0].y, 0);
    endShape();

    // leftBar
    beginShape(TESS);
    for (let p = 8; p < 16; p += 1) {
      vertex(points[p].x, points[p].y, 0);
    }
    vertex(points[8].x, points[8].y, 0);
    endShape();

    // dots
    for (let i = 0; i < 3; i += 1) {
      beginShape(TESS);
      vertex(
        points[16 + i * 4].x,
        points[16 + i * 4].y
      )
      for (let p = 1; p < 5; p += 1) {
        let pp = p;
        if (pp === 4) {
          pp = 0;
        }
        bezierVertex(
          points[16 + i * 4 + pp].cx1,
          points[16 + i * 4 + pp].cy1,
          points[16 + i * 4 + pp].cx2,
          points[16 + i * 4 + pp].cy2,
          points[16 + i * 4 + pp].x,
          points[16 + i * 4 + pp].y
        );
      }
      endShape(CLOSE);
    }

    if (skips.includes(-2)) {
      phase += 1;
      phaseSetup = true;
    }
  
  } else if (phase === -1) {
    background(0);
    const maxLevels = 200;
    const division = 6 / (repitions/3 + 1);
    const maxSteps = 20;
    scale(2.5);
    if (phaseSetup) {
      waitCounter = 0;
      tempCounter = 0;
      phaseSetup = false;
      points.forEach((p, pi) => {
        if (pi < 16) {
          p.dx1 = points[pi + ((pi === 0 || pi === 8) ? 7 : -1)].dx2 * -1;
          p.dy1 = points[pi + ((pi === 0 || pi === 8) ? 7 : -1)].dy2 * -1;
        } else {
          p.dx1 = points[pi + (((pi-16)%4===0) ? 3 : -1)].dx2 * -1;
          p.dy1 = points[pi + (((pi-16)%4===0) ? 3 : -1)].dy2 * -1;
        }
      });
    }

    // points.forEach((p, pi) => {
    //   p.cx1 = p.cx1 + p.dx1;
    //   p.cy1 = p.cy1 + p.dy1;
    //   p.cx2 = p.cx2 + p.dx2;
    //   p.cy2 = p.cy2 + p.dy2;
    // });

    noFill();
    
    for (let i = 0; i < maxSteps; i += 1) {
      // if (i === 0) {
      //   strokeWeight(5);
      // } else {
        strokeWeight(1);
      // }

      const lerpStep = Math.pow(i/maxSteps, 2);
      const lerpCounter = tempCounter / division;
      stroke(255, 255 * lerpStep - Math.sqrt(waitCounter/255)*255); // (maxSteps - i)

      // leftBar
      beginShape(TESS);
      vertex(points[7].x, points[7].y, 0);
      for (let p = 0; p < 8; p += 1) {
        bezierVertex(
          points[p].cx1 + lerp(0, points[p].dx1 * lerpCounter, lerpStep),
          points[p].cy1 + lerp(0, points[p].dy1 * lerpCounter, lerpStep),
          0,
          points[p].cx2 + lerp(0, points[p].dx2 * lerpCounter, lerpStep),
          points[p].cy2 + lerp(0, points[p].dy2 * lerpCounter, lerpStep),
          0,
          points[p].x,
          points[p].y,
          0
        );
      }
      endShape();

      // leftBar
      beginShape(TESS);
      vertex(points[15].x, points[15].y, 0);
      for (let p = 8; p < 16; p += 1) {
        bezierVertex(
          points[p].cx1 + lerp(0, points[p].dx1 * lerpCounter, lerpStep),
          points[p].cy1 + lerp(0, points[p].dy1 * lerpCounter, lerpStep),
          0,
          points[p].cx2 + lerp(0, points[p].dx2 * lerpCounter, lerpStep),
          points[p].cy2 + lerp(0, points[p].dy2 * lerpCounter, lerpStep),
          0,
          points[p].x,
          points[p].y,
          0
        );
      }
      endShape();

      // dots
      for (let ci = 0; ci < 3; ci += 1) {
        beginShape(TESS);
        vertex(
          points[16 + ci * 4].x,
          points[16 + ci * 4].y
        )
        for (let p = 1; p < 5; p += 1) {
          let pp = p;
          if (pp === 4) {
            pp = 0;
          }
          bezierVertex(
            points[16 + ci * 4 + pp].cx1 + lerp(0, points[16 + ci * 4 + pp].dx1 * lerpCounter, lerpStep),
            points[16 + ci * 4 + pp].cy1 + lerp(0, points[16 + ci * 4 + pp].dy1 * lerpCounter, lerpStep),
            0,
            points[16 + ci * 4 + pp].cx2 + lerp(0, points[16 + ci * 4 + pp].dx2 * lerpCounter, lerpStep),
            points[16 + ci * 4 + pp].cy2 + lerp(0, points[16 + ci * 4 + pp].dy2 * lerpCounter, lerpStep),
            0,
            points[16 + ci * 4 + pp].x,
            points[16 + ci * 4 + pp].y,
            0
          );
        }
        endShape(CLOSE);
      }
    }

    tempCounter += 0.5;
    if (tempCounter > maxLevels) {
      tempCounter -= 0.25;
      waitCounter += 1;
      if (waitCounter > 200) {
        if (repitions > 3) {
          background(0);
          phase += 1;
        } else {
          skips = [-3, -2];
          phase = -2;
          phaseSetup = true;
          points.forEach(p => {
            p = randomizePoint(p);
          });
          repitions += 1;
        }
      }
    }
  } else if (phase === 0) {
    rotateY(Math.PI / 180 * blockRotation);
    rotateX(Math.PI / 180 * blockRotation);
    blockRotation += 0.01 * ((blockIterations%2 === 0) ? -1 : 1);
  
    translate(-w/2, -h/2, 0);
    background(0);
    image(finishedGraph, 0, 0);
    finishedGraph.background(0);
    noFill();
  
    // stroke('green');
    // ['left', 'right'].forEach(key => {
    //   beginShape();
    //   building[key].forEach(v => {
    //     vertex(v[0], v[1], 0);
    //   });
    //   endShape();
    // });
    // beginShape();
    // vertex(building.top[0][0],building.top[0][1],0);
    // vertex(building.mid[0][0],building.mid[0][1],0);
    // vertex(building.bottom[0][0],building.bottom[0][1],0);
    // endShape();
  
    // stroke('red');
    // ['top', 'bottom', 'mid'].forEach(key => {
    //   let pId = 0;
    //   switch (key) {
    //     case 'mid': pId = 1; break;
    //     case 'bottom': pId = 2; break;
    //   }
    //   // midPoint
    //   beginShape();
    //   vertex(
    //     building.left[pId][0],
    //     building.left[pId][1], 0
    //   );
    //   building[key].forEach(v => {
    //     vertex(v[0], v[1], 0);
    //   });
    //   vertex(
    //     building.right[pId][0],
    //     building.right[pId][1], 0
    //   );
    //   endShape();
    // });
  
    finishedGraph.noStroke();
    finishedGraph.fill(150);
  
    building.tLines.forEach((l, li) => {
      if (building.ttLines[li] < time) {
        finishedGraph.beginShape(TESS);
        l.forEach(a => {
          finishedGraph.vertex(a[0], a[1]);
        });
        finishedGraph.endShape(CLOSE);
      }
    });
  
    building.lines.forEach((l, li) => {
      finishedGraph.strokeWeight(2);
      finishedGraph.stroke('white');
      finishedGraph.noFill();
  
      if (li === 0 || li === building.lines.length - 1 || li === Math.floor(building.lines.length/2)) {
        finishedGraph.beginShape();
        l.forEach(lp => {
          finishedGraph.vertex(lp[0], lp[1]);
        });
        finishedGraph.endShape();
      }
  
      finishedGraph.fill('white');
      finishedGraph.noStroke();
  
      if (li < building.lines.length - 1) {
        blockWidths[li].forEach((b, bi) => {
          if (time > animationTime * b[5]) {
            let lineRect;
            if (building.fLines[li + '_' + bi]) {
              lineRect = building.fLines[li + '_' + bi];
            } else {
              let progress = (time - (animationTime * b[5])) / b[6];
              if (progress > 1) {
                progress = 1;
              }
              
              lineRect = drawRect(
                building.lines[li],
                building.lines[li + 1],
                b[0], b[1] * progress,
                b[2], b[3]
              );
              if (progress >= 1) {
                building.fLines[li + '_' + bi] = lineRect;
              }
            }
            finishedGraph.beginShape(TESS);
            lineRect.forEach(a => {
              finishedGraph.vertex(a[0], a[1]);
            });
            finishedGraph.endShape(CLOSE);
  
            if (building.sfLines[li + '_' + bi]) {
              lineRect = building.sfLines[li + '_' + bi];
            } else {
              let progress = (time - (animationTime * b[5])) / (b[6] * b[4]);
              if (progress > 1) {
                progress = 1;
              }
              
              lineRect = drawRect(
                building.lines[li],
                building.lines[li + 1],
                b[0], b[1] * b[4] * progress,
                b[2], 100
              );
              if (progress >= 1) {
                building.sfLines[li + '_' + bi] = lineRect;
              }
            }
            finishedGraph.beginShape(TESS);
            lineRect.forEach(a => {
              finishedGraph.vertex(a[0], a[1]);
            });
            finishedGraph.endShape(CLOSE);
  
          }
        });
      }
    });
  
    time += 0.75;
  
    if (time > animationTime + waitTime) {
      resetBlocks();
      if (blockIterations > 6) {
        phase += 1;
      }
    }
  } else if (phase === 1) {
    camera(0, -300, 600);
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
      buildingCounter++;
      if (buildingCounter > 5) {
        phase += 1;
      }
    }

  } else if (phase === 2) {
    console.log('PHASE 0');
    camera();
    background(0);
    phase += 1; 
  } else if (phase === 3) {
    translate(-width/2, -height/2);
    image(fieldTexture, 0, 0);
    
    fieldTexture.background(0, transparency);
    transparency -= 0.75;

    fieldTexture.noStroke();
    if (hideCounter > maxCount) {
      fieldTexture.fill(255, 255 - (hideCounter - maxCount) * 4);
    } else {
      fieldTexture.fill(255);
    }
    for (let i = 0; i < particles.length; i++) {
      particles[i].run();
      particles[i].draw();
    }

  
    if (hideCounter > maxCount) {
      fieldTexture.fill(0, hideCounter - maxCount);
      fieldTexture.rect(0, 0, width, height);
    }
    
    if (hideCounter > maxCount + (255/4) + 20) {
      hideCounter = 0;
      transparency = 255;
      reset();
    }
  hideCounter++;
  }
}

function keyReleased() {
  if (keyCode === 34 || keyCode === RIGHT_ARROW) {
    phase += 1;
  } else if (keyCode === 33 || keyCode === LEFT_ARROW) {
    phase -= 1;
  }
  phaseSetup = true;
}