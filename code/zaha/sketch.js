let h;
let w;

let building;
let blockWidths;

let time = 0;
let animationTime = 100;
const waitTime = 300;
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
      h, h + 1
    ));
    let aniOffset = tr;
    if (tr >= Math.floor(building.lines.length/2)) {
      aniOffset = Math.abs(tr - (building.lines.length - 2));
    }
    aniOffset /= building.lines.length/2;
    building.ttLines.push(aniOffset * animationTime);
  }
}

function setup() {
  h = windowHeight;
  w = windowWidth;
  createCanvas(w, h, WEBGL);
  setAttributes('antialias', true);
  normalMaterial();
  bezierDetail(10);
  resetBlocks();
  frameRate(30);
}

let blockRotation = 0;
let blockIterations = 0;

function draw() {
  rotateY(Math.PI / 180 * blockRotation);
  rotateX(Math.PI / 180 * blockRotation);
  blockRotation += 0.03 * ((blockIterations%2 === 0) ? -1 : 1);

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

  time += 1;

  if (time > animationTime + waitTime) {
    resetBlocks();
    if (blockIterations > 5) {
      noLoop();
    }
  }
  console.log(frameRate());
}

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

function keyReleased() {
  resetBlocks();
}