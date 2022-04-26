let params = {
  num: 4500, // 1000,
  noiseScale: 550, // 500,
  noiseStrength: 2.6, // 5,
  transparency: 255, // 100,
  maxLength: 45, // 100,
  maxWidth: 1, // 5,
  numColors: 5,
  color1: 'rgb(255,255,255)', // '#58A69E',
  color2: 'rgb(200,200,200)', // '#F2F2F2',
  color3: 'rgb(155,155,155)', // '#D92B04',
  color4: 'rgb(100,100,100)', // '#8C2016',
  color5: 'rgb(55,55,55)'  // '#590202'
};

let gui;
let resetButton;
let processCount = 0;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  gui = QuickSettings.create(width - 220, 20, 'Config', document.querySelector('body'));
  gui.bindRange('num', 1, 10000, params.num, 1, params);
  gui.bindRange('noiseScale', 1, 2000, params.noiseScale, 1, params);
  gui.bindRange('noiseStrength', 0, 10, params.noiseStrength, 0.1, params);
  gui.bindRange('transparency', 0, 255, params.transparency, 1, params);
  gui.bindRange('maxLength', 1, 2000, params.maxLength, 1, params);
  gui.bindRange('maxWidth', 1, 50, params.maxWidth, 0.1, params);
  gui.bindRange('numColors', 1, 5, params.numColors, 1, params);
  gui.bindColor('color1', params.color1, params);
  gui.bindColor('color2', params.color2, params);
  gui.bindColor('color3', params.color3, params);
  gui.bindColor('color4', params.color4, params);
  gui.bindColor('color5', params.color5, params);
  gui.addButton('Restart', reset);

  reset();
}

function reset() {
  particles = [];
  processCount = 0;
  for (let i = 0; i < params.num; i++) {
    var loc = createVector(random(width), random(height));
    var angle = random(0, Math.PI * 2);
    var dir = createVector(cos(angle), sin(angle));
    var speed = random(0.5, 2);
    particles.push(new Particle(loc, dir, speed, i));
  }
  loop();
}

function draw() {
  clear();
  background(0);
  if (processCount >= params.maxLength) {
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw();
    }
    noLoop();
  } else {
    // run the processing in batches, so high number of particles do not kill browser
    for (let l = 0; l < 10; l += 1) {
      if (processCount < params.maxLength) {
        for (let i = 0; i < particles.length; i++) {
          particles[i].run();
        }
        processCount++;
      }
    }
    fill(255);
    textSize(20);
    textFont('Arial');
    text(params.maxLength + ' / ' + processCount, 20, 30);
  }
}

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
      // reset line if it leaves canvas
      // this.positions = [];
      // this.loc.x = random(width * 1.2);
      // this.loc.y = random(height);

      // stop the line if it leaves canvas
      this.dead = true;
    }
  }
  draw(){
    noFill();
    stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], params.transparency);
    strokeWeight(this.stroke);
    beginShape();
    for (let i = 0; i < this.positions.length; i += 1) {
      curveVertex(this.positions[i].x, this.positions[i].y);
    }    
    endShape();
  }
}

function keyReleased() {
  if (keyCode === ENTER) {
    save('flowfield.png');
  }
}