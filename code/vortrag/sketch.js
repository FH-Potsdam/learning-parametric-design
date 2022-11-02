let h;
let w;

function setup() {
  h = windowHeight;
  w = windowWidth;
  createCanvas(w, h, WEBGL);
  setAttributes('antialias', true);
  normalMaterial();
  bezierDetail(10);
}

let phase = -3;

let counter = 0;

let velocity = 1;
const maxVelocity = 3;

let phaseSetup = true;

let points = [];

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
    dy1: dy1/Math.abs(dx1),
    cx2:null,
    cy2:null,
    dx2: dx2/Math.abs(dx2),
    dy2: dy2/Math.abs(dx2),
    r: 10,
    v: velocity,
    opacity: 0,
    partner: null,
    partnerEnd: false,
    partnerTowards: 0,
    segments: []
  });
}

let lineLength = 0;
let lineFadeout = 0;

function polar(radius, angle) {
  const rad = Math.PI / 180 * angle;
  const x = radius * Math.cos(rad);
  const y = radius * Math.sin(rad);
  return {
    x, y
  };
}

function draw() {
  orbitControl();
  if (phase === -3) {
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
    stroke('black');

    // leftBar
    beginShape(TESS);
    for (let p = 0; p < 8; p += 1) {
      vertex(points[p].x, points[p].y, 0);
    }
    endShape();

    // leftBar
    beginShape(TESS);
    for (let p = 8; p < 16; p += 1) {
      vertex(points[p].x, points[p].y, 0);
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
    phase += 1;
  } else if (phase === -2 || phase === -1) {
    background(0);

    noFill();
    fill(255,100);
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
  
    fill(255);
    strokeWeight(1);

    points.forEach((p, pi) => {
      circle(p.x, p.y, 5);
      // if (p.cx1){
      //   let lp = pi - 1;
      //   if (pi === 16 || pi === 20 | pi === 24) {
      //     lp = pi + 3;
      //   }
      //   line(points[lp].x, points[lp].y, 0, p.cx1, p.cy1, 0);
      //   circle(p.cx1, p.cy1, 2);
      //   line(p.x, p.y, 0, p.cx2, p.cy2, 0);
      //   circle(p.cx2, p.cy2, 2);
      // }
    });

    if (phase === -1) {
      points.forEach(p => {
        p.x += p.dx * (velocity / Math.sqrt(p.dx * p.dx + p.dy * p.dy));
        p.y += p.dy * (velocity / Math.sqrt(p.dx * p.dx + p.dy * p.dy));
        if (Math.abs(p.x) > w/2) { p.dx *= -1; }
        if (Math.abs(p.y) > h/2) { p.dy *= -1; }
        if (p.cx1){
          p.cx1 += p.dx1 * (velocity / Math.sqrt(p.dx1 * p.dx1 + p.dy1 * p.dy1));
          p.cy1 += p.dy1 * (velocity / Math.sqrt(p.dx1 * p.dx1 + p.dy1 * p.dy1));
          if (Math.abs(p.cx1) > w/2) { p.dx1 *= -1; }
          if (Math.abs(p.cy1) > h/2) { p.dy1 *= -1; }

          p.cx2 += p.dx2 * (velocity / Math.sqrt(p.dx2 * p.dx2 + p.dy2 * p.dy2));
          p.cy2 += p.dy2 * (velocity / Math.sqrt(p.dx2 * p.dx2 + p.dy2 * p.dy2));
          if (Math.abs(p.cx2) > w/2) { p.dx2 *= -1; }
          if (Math.abs(p.cy2) > h/2) { p.dy2 *= -1; }
        }
      });
    } else {
      phase += 1;
    }
  } else if (phase === 0) {
      background(0);
      points.forEach(p => {
      fill(255,255,255, p.opacity);
      if (p.opacity < 255) {
        p.opacity += 1;
      }
      circle(p.x, p.y, 10);

      p.x += p.dx * (velocity / Math.sqrt(p.dx * p.dx + p.dy * p.dy));
      p.y += p.dy * (velocity / Math.sqrt(p.dx * p.dx + p.dy * p.dy));
      if (p.x < 0 || p.x > w) { p.dx *= -1; }
      if (p.y < 0 || p.y > h) { p.dy *= -1; }
    });

    if (velocity < maxVelocity) {
      velocity += 0.001;
    }

    counter += 1;
    if (counter > 100 && points.length < 20) {
      counter = 0;
      createPoint();
    }
  } else if (phase === 1 || phase === 2) {
    background(0);
    strokeWeight(2);
    velocity = maxVelocity;
    while (points.length < 20) {
      createPoint();
    }

    if (lineLength < 100) {
      lineLength += 0.2;
    }

    if (phase === 2 && lineFadeout < 255) {
      lineFadeout += 1;
    }

    points.forEach(p => {
      if (p.opacity < 255) {
        p.opacity = 255;
      }

      let lx = p.x;
      let ly = p.y;
      let ldx = p.dx;
      let ldy = p.dy;
      for (let l = 0; l < lineLength; l += 1) {
        const c = 255 - (255/lineLength*l) - lineFadeout;
        stroke(c,c,c);
        let tx = lx + ldx * (maxVelocity / Math.sqrt(ldx * ldx + ldy * ldy));
        let ty = ly + ldy * (maxVelocity / Math.sqrt(ldx * ldx + ldy * ldy));
        line(
          lx, ly,
          tx, ty
        );
        lx = tx;
        ly = ty;
        if (tx > w || tx < 0) {
          ldx *= -1;
        }
        if (ty > h || ty < 0) {
          ldy *= -1;
        }
      }
    });

    points.forEach(p => {
      noStroke();
      fill(255,255,255);
      circle(p.x, p.y, 10);

      p.x += p.dx * (velocity / Math.sqrt(p.dx * p.dx + p.dy * p.dy));
      p.y += p.dy * (velocity / Math.sqrt(p.dx * p.dx + p.dy * p.dy));
      if (p.x < 0 || p.x > w) { p.dx *= -1; }
      if (p.y < 0 || p.y > h) { p.dy *= -1; }
    });
  } else if (phase === 3 || phase === 4) {
    if (phaseSetup) {
      innerDist = 0;
      outerDist = 0;
      phaseSetup = false;
      while (points.length < 30) {
        createPoint();
      }
      points.forEach(p => {
        p.velocity = maxVelocity;
      });
    }
    background(0,10);
    
    if (innerDist < innerDistMax) {
      innerDist += 1;
    }
    if (outerDist < outerDistMax) {
      outerDist += 1;
    }

    points.forEach((p, pi) => {
      fill(255,255,255);
      let r = 10;

      // check if circle is near
      if (p.partner === null) {
        points.forEach((pp, ppi) => {
          if (p.partner === null && pp.partner === null && pi !== ppi) {
            if (dist(pp.x, pp.y, p.x, p.y) < outerDist) {
              p.partner = ppi;
              pp.partner = pi;
              p.partnerEnd = false;
              pp.partnerEnd = false;
              p.partnerTowards = 0;
              pp.partnerTowards = 0;
            }
            // r = 10 + (75 - dist(pp.x, pp.y, p.x, p.y))/2;
          }
        });
      }

      if (p.partner !== null) {
        const pp = points[p.partner];

        if (phase === 4) {
          stroke('white');
          line(p.x, p.y, pp.x, pp.y);
        }
        // p.segments.push([p.x, p.y, pp.x, pp.y]);
        // p.segments = p.segments.slice(0, 100);
        // console.log(p.segments.length);

        const d = dist(pp.x, pp.y, p.x, p.y);
        if (!p.partnerEnd) {
          if (d < outerDist) {
            if (p.velocity > 0.5) {
              p.velocity -= 0.01;
            }
          }
          if (d > innerDist) {
            const tcx = pp.x - p.x;
            const tcy = pp.y - p.y;
            const cx = tcx / Math.abs(tcx);
            const cy = tcy / Math.abs(tcx);

            p.dx = lerp(p.dx, cx, p.partnerTowards);
            p.dy = lerp(p.dy, cy, p.partnerTowards);

            if (p.partnerTowards < 1) {
              p.partnerTowards += 0.01;
            }

          } else {
            p.partnerEnd = true;
            points[p.partner].partnerEnd = true;
          }
        } else if (p.partnerEnd) {
          if (p.velocity < maxVelocity) {
            p.velocity += 0.01;
          }
          if (d > outerDist) {
            points[p.partner].partner = null;
            points[p.partner].partnerEnd = false;
            p.partner = null;
            p.partnerEnd = false;
          }
        }
      } else {
        if (p.velocity < maxVelocity) {
          p.velocity += 0.01;
        }
      }
    });

    points.forEach((p) => {
      // p.segments.forEach((s, si) => {
      //   stroke(255, 255/p.segments*si);
      //   line(s[0],s[1],s[2],s[3]);
      // });
      // fill(255,255,255,100);
      // if (p.partner !== null) {
      //   fill(0, 255, 255, 100);
      //   if (p.partnerEnd) {
      //     fill(255, 0, 255, 100);
      //   }
      // }
      noStroke();
      fill(255);
      circle(p.x, p.y, 5);

      // stroke(255, 10);
      // fill(255, 10);
      // circle(p.x, p.y, innerDist);
      // circle(p.x, p.y, outerDist);

      p.x += p.dx * (p.velocity / Math.sqrt(p.dx * p.dx + p.dy * p.dy));
      p.y += p.dy * (p.velocity / Math.sqrt(p.dx * p.dx + p.dy * p.dy));
      if (p.x < 0 || p.x > w) { p.dx *= -1; }
      if (p.y < 0 || p.y > h) { p.dy *= -1; }
    });
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