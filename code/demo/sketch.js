const sketchWidth = 750;
const sketchHeight = 580;
let audio;

//let weight = 'Ñ@#W$9876543210?!abc;:+=-,._                    ';
//let weight = '                    _.,-=+:;cba!?0123456789$W#@Ñ';
//let weight = '       .:-i|=+%O#@';
//let weight = '@#O%+=|i-:.       ';
//let weight = '        .:░▒▓█';
let weight = '█▓▒░:.        ';

let video;
let asciiDiv;

//settings

//beams
//let thickness = 1.5; // >> slider
//let density = 0.4; //0.3, 2 >> slider
//let detail = 900; //200, 800, 1500 >> slider
let rimSize;
let rimFlutter = 5;
let ribbon = 1;
outerRibbon = 0;
//let mult = 480; //500: ribbon = 1 >> slider

//let effect = 90; //45, 90, 180, 360 >> radiobuttons?
let flip = 270; //90, 270 >> button

//let outerRim = 150;
let outerEffect = 360;

//stars
const sterne = [];
const maxSize = 4;
const growValue = 0.07;
let offsetX = 0;

//background
//let noiseSpeed = 0.015;

let multSlider;
let detailSlider;
let densitySlider;
let thickSlider;
let rimSlider;
let effectSlider;
let threshSlider;

let flipButton;

let pMultVal;
let pDetailVal;
let pDensityVal;
let pThickVal;
let pRimVal;
let pLevel;

let peakDetect;




function setup() {
  createCanvas(sketchWidth, sketchHeight);
  frameRate(40);

  getAudioContext().suspend();
  userStartAudio();

  audio = new p5.AudioIn();
  audio.start();
  let sources = audio.getSources();
  console.log(sources);
  //audio.setSource(1);

  fft = new p5.FFT();
  fft.setInput(audio);


  multSlider = createSlider(400, 500, 470, 10);
    multSlider.position(sketchWidth / 2 - 100, sketchHeight + 13);
    multSlider.style('width', '200px');
    multSlider.style('height', '5px');
    multSlider.style('background', 'red');

  detailSlider = createSlider(100, 1500, 1000, 50);
    detailSlider.position(sketchWidth / 2 - 100, sketchHeight + 53);
    detailSlider.style('width', '200px');
    detailSlider.style('height', '5px');

  densitySlider = createSlider(0.3, 5, 0.4, 0.1);
    densitySlider.position(sketchWidth / 2 - 100, sketchHeight + 93);
    densitySlider.style('width', '200px');
    densitySlider.style('height', '5px');

  thickSlider = createSlider(0.5, 5, 1.5, 0.5);
    thickSlider.position(sketchWidth / 2 - 100, sketchHeight + 133);
    thickSlider.style('width', '200px');
    thickSlider.style('height', '5px');

  rimSlider = createSlider(-400, 300, 130, 1);
    rimSlider.position(sketchWidth / 2 - 100, sketchHeight + 173);
    rimSlider.style('width', '200px');
    rimSlider.style('height', '5px');
  
  effectSlider = createSlider(1, 360, 90, 1);
    effectSlider.position(sketchWidth / 2 - 100, sketchHeight + 213);
    effectSlider.style('width', '200px');
    effectSlider.style('height', '5px');
  
  threshSlider = createSlider(0.1, 1, 0.6, 0.1);
    threshSlider.position(sketchWidth / 2 - 320, sketchHeight + 48);
    threshSlider.style('width', '75px');
    threshSlider.style('height', '5px');

  flipButton = createButton('FLIP');
    flipButton.position(sketchWidth / 2 - 320, sketchHeight + 8)
    flipButton.size(80);
    flipButton.mousePressed(flipVisuals);
    flipButton.style('background-color', 'rgba(160, 149, 230, 0.5)')

  weightButton = createButton('INVERT');
    weightButton.position(sketchWidth / 2 - 320, sketchHeight + 98)
    weightButton.size(80);
    weightButton.mousePressed(invertWeight);
    weightButton.style('background-color', 'rgba(160, 149, 230, 0.5)')

  camButton = createButton('//CAM');
    camButton.position(sketchWidth - 139, sketchHeight + 203)
    camButton.size(100);
    camButton.mousePressed(camera);
    camButton.style('background-color', 'rgba(160, 149, 230, 0.5)')

    function flipVisuals() {
      flip *= -1;
      //for(flip = 270; flip <= 90; flip ++) {}
    }

    function invertWeight() {
      if (weight === '█▓▒░:.        ') {
        weight = '        .:░▒▓█';
      } else if (weight === '        .:░▒▓█') {
        weight = '█▓▒░:.        ';
      } else if (weight === '       .:-i|=+%O#@') {
        weight = '@#O%+=|i-:.       ';
      } else if (weight === '@#O%+=|i-:.       ') {
        weight = '       .:-i|=+%O#@';
      } else if (weight === 'Ñ@#W$9876543210?!abc;:+=-,._                    ') {
        weight = '                    _.,-=+:;cba!?0123456789$W#@Ñ';
      } else if (weight === '                    _.,-=+:;cba!?0123456789$W#@Ñ') {
        weight = 'Ñ@#W$9876543210?!abc;:+=-,._                    ';
      }
    }


  let pTag = createP('jjung_vision_1.3.3');
    pTag.style('font-size', '10px');
    pTag.position(sketchWidth - 140, sketchHeight);
  
  let pData = createP('© JD - FHP (20341)');
    pData.style('font-size', '10px');
    pData.position(sketchWidth - 140, sketchHeight + 40);

  let pMult = createP('RIBBON');
    pMult.style('font-size', '10px');
    pMult.position(sketchWidth / 2 - 175, sketchHeight);  
  
  let pDetail = createP('DETAIL');
    pDetail.style('font-size', '10px');
    pDetail.position(sketchWidth / 2 - 175, sketchHeight + 40);  

  let pDensity = createP('DENSITY');
    pDensity.style('font-size', '10px');
    pDensity.position(sketchWidth / 2 - 175, sketchHeight + 80);  

  let pThick = createP('THICKNESS');
    pThick.style('font-size', '10px');
    pThick.position(sketchWidth / 2 - 175, sketchHeight + 120);  
  
  let pRim = createP('OUTER RIM');
    pRim.style('font-size', '10px');
    pRim.position(sketchWidth / 2 - 175, sketchHeight + 160);  
  
  let pEffect = createP('WINDING');
    pEffect.style('font-size', '10px');
    pEffect.position(sketchWidth / 2 - 175, sketchHeight + 200);  
  
  let pThresh = createP('= THR');
    pThresh.style('font-size', '8px');
    pThresh.position(sketchWidth / 2 - 272, sketchHeight + 62);  

  
  pMultVal = createP(multSlider.value());
    pMultVal.style('font-size', '12px');
    pMultVal.position(sketchWidth / 2 + 150, sketchHeight);  
 
  pDetailVal = createP(detailSlider.value());
    pDetailVal.style('font-size', '12px');
    pDetailVal.position(sketchWidth / 2 + 150, sketchHeight + 38);  
 
  pDensityVal = createP(densitySlider.value());
    pDensityVal.style('font-size', '12px');
    pDensityVal.position(sketchWidth / 2 + 150, sketchHeight + 78);  
 
  pThickVal = createP(thickSlider.value());
    pThickVal.style('font-size', '12px');
    pThickVal.position(sketchWidth / 2 + 150, sketchHeight + 118);  
  
  pRimVal = createP(rimSlider.value());
    pRimVal.style('font-size', '12px');
    pRimVal.position(sketchWidth / 2 + 150, sketchHeight + 158);  
  
  pEffectVal = createP(rimSlider.value());
    pEffectVal.style('font-size', '12px');
    pEffectVal.position(sketchWidth / 2 + 150, sketchHeight + 198);  
  
  pTreshVal = createP(threshSlider.value());
    pTreshVal.style('font-size', '9px');
    pTreshVal.position(sketchWidth / 2 - 318, sketchHeight + 59);  

  pLevel = createP();
    pLevel.style('font-size', '11px');
    pLevel.position(sketchWidth - 95, sketchHeight - 68);  



  video = createCapture(VIDEO);
  video.size(187, 77);
  video.position(sketchWidth - 183, sketchHeight + 93);
  //video.hide();
  asciiDiv = createDiv();
  asciiDiv.position(0,0);
  asciiDiv.size();

  peakDetect = new p5.PeakDetect(60, 100, threshSlider.value(), 5,);


  for (let sternCount = 0; sternCount < 150; sternCount += 1) {
    sterne.push({
      x: random(0, sketchWidth),
      y: random(0, sketchHeight),
      radius: random(1, maxSize),
      fade: random(0, 255),
      grow: Math.round(random(0,1))
    });
  }
}

let offset = 0;



function draw() {
  let level = audio.getLevel(); 
  let bloat = map(level, 0, 1, 20, 100);
  background(31, 26, 42);
  noFill();
  strokeWeight(2);
  stroke('rgba(178, 166, 255, 0.3)');
  ellipse(sketchWidth - 90, sketchHeight - 50, bloat * 2, 25);
  ellipse(sketchWidth - 90, sketchHeight - 50, bloat * 3, 25);
  ellipse(sketchWidth - 90, sketchHeight - 50, bloat * 4, 25);
  
  noStroke(); 
  /*
  //kosmos
    const size = 10;

    for (let nx = 0; nx < sketchWidth; nx += size) {
      for (let ny = 0; ny < sketchHeight; ny += size) {
      
        const colorValue = noise(
          nx / 200, ny / 200, offset);
          fill(30, 20, colorValue * 150);
        rect(nx, ny, size);
      }
    }
    offset += noiseSpeed;
  */        

  //sterne
  noStroke();
  //fill('grey');
  for (let s = 0; s < sterne.length; s += 1) {
    fill(255, 255, 255, sterne[s].radius / 0.5 * 15);
    circle(sterne[s].x + offsetX, sterne[s].y, sterne[s].radius);

    if (sterne[s].grow) {
      sterne[s].radius += growValue;
      if (sterne[s].radius > maxSize) {
        sterne[s].grow = false;
      }
    } else {
      sterne[s].radius -= growValue;
      if (sterne[s].radius < 0) {
        sterne[s].x = random(0, sketchWidth);
        sterne[s].y = random(0, sketchHeight);
        sterne[s].grow = true;
      }
    }

    sterne[s].x += random(-0.1, 0.1);
    sterne[s].y += random(-0.1, 0.1);
  }
  
  //webcam
  //function camera () { 
    video.loadPixels();
    let asciiImage = "";
    for (let j = 0; j < video.height; j++) {
      for (let i = 0; i < video.width; i++) {
        
        const pixelIndex = (i + j * video.width) * 4;
        const r = video.pixels[pixelIndex + 0];
        const g = video.pixels[pixelIndex + 1];
        const b = video.pixels[pixelIndex + 2];
        
        const avg = (r + g + b) / 3;
        const len = weight.length;
        const charIndex = floor(map(avg, 0, 255, 0, len));
        const c = weight.charAt(charIndex);
        
        if (c == " ") asciiImage += "&nbsp;";
        else asciiImage += c;
      }
      asciiImage += '<br/>';
    }
    asciiDiv.html(asciiImage);
  //}

  let mult = multSlider.value();
  let detail = detailSlider.value();
  let density = densitySlider.value();
  let thickness = thickSlider.value();
  let outerRim = rimSlider.value();
  let effect = effectSlider.value();
  let thresh = threshSlider.value();

  //beams
  strokeWeight(thickness);
  //stroke('rgba(160, 149, 230, 1)');
  stroke('rgba(178, 166, 255, 0.3)');
  
  let spectrum = fft.analyze();
  //console.log(spectrum);
  peakDetect.update(fft);
  
  if (peakDetect.isDetected) {
    stroke('#6C5880');
  } else {
    stroke('rgba(178, 166, 255, 0.3)');
  }
  
  //if (peakDetect.isDetected) {invertWeight}
  
  translate(sketchWidth / 2, (sketchHeight / 2) + 70);
  rotate(Math.PI / 180 * flip);
   //top half
   beginShape();
   for(let angle = 0; angle < 360; angle += density) {
    
    const radius = spectrum[Math.round(angle / 500 * detail)];
    //const iradius = random(sketchWidth / 2 - (rimSize-rimFlutter),sketchHeight / 2 - rimSize);
    const iradius = spectrum[Math.round(angle/mult*detail+ribbon)]

       const x = radius * cos(Math.PI / -effect * angle);
       const y = radius * sin(Math.PI / -effect * angle);

       const ix = iradius * cos(Math.PI / -effect * angle);
       const iy = iradius * sin(Math.PI / -effect * angle);

    
    line(x,y,ix,iy);

   }
   endShape(CLOSE);
  
   //bottom half
   beginShape();
   for(let angle = 0; angle < 360; angle += density) {
    
    const radius = spectrum[Math.round(angle / 500 * detail)];
    //const iradius = random(sketchWidth / 2 - (rimSize-rimFlutter),sketchHeight / 2 - rimSize);
    const iradius = spectrum[Math.round(angle/mult*detail+ribbon)]

       const x = radius * cos(Math.PI / -effect * -angle);
       const y = radius * sin(Math.PI / -effect * -angle);

       const ix = iradius * cos(Math.PI / -effect * -angle);
       const iy = iradius * sin(Math.PI / -effect * -angle);

    
    line(x, y, ix, iy);

   }
   endShape(CLOSE);

   //outer rim
   translate(20, 0);
   stroke('rgba(160, 149, 230, 0.04)');
    //outer top half
    beginShape();
    for(let angle = 0; angle < 360; angle += density) {
     
     const radius = outerRim + spectrum[Math.round(angle / 500 * 300)];
     //const iradius = 800
     const iradius = outerRim + spectrum[Math.round(angle/500*280+outerRibbon)]
 
        const x = radius * cos(Math.PI / -outerEffect * angle);
        const y = radius * sin(Math.PI / -outerEffect * angle);
 
        const ix = iradius * cos(Math.PI / -outerEffect * angle);
        const iy = iradius * sin(Math.PI / -outerEffect * angle);
 
     
     line(x,y,ix,iy);
 
    }
    endShape(CLOSE);
   
    //outer bottom half
    beginShape();
    for(let angle = 0; angle < 360; angle += density) {
     
     const radius = outerRim + spectrum[Math.round(angle / 500 * 300)];
     //const iradius = 800
     const iradius = outerRim + spectrum[Math.round(angle/500*280+outerRibbon)]
 
        const x = radius * cos(Math.PI / -outerEffect * -angle);
        const y = radius * sin(Math.PI / -outerEffect * -angle);
 
        const ix = iradius * cos(Math.PI / -outerEffect * -angle);
        const iy = iradius * sin(Math.PI / -outerEffect * -angle);
 
     
     line(x, y, ix, iy);
 
    }
    endShape(CLOSE);


    
  //slidervalues  
  pMultVal.html(multSlider.value()); 
  pDetailVal.html(detailSlider.value()); 
  pDensityVal.html(densitySlider.value()); 
  pThickVal.html(thickSlider.value()); 
  pRimVal.html(rimSlider.value()); 
  pEffectVal.html(effectSlider.value()); 
  pTreshVal.html(threshSlider.value()); 
  pLevel.html(ceil(level * 1000));
  
}

  
  //  let log = spectrum;
  //  fill()
  //  textSize(10);
  //  text(log, sketchWidth/sketchWidth, sketchHeight-(sketchHeight-10))
   
  

   