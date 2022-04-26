function preload(){
  // preload assets
}

function setup() {
  createCanvas(400, 400, SVG);
  
}

function draw() {
  background('white');
  noLoop();
  strokeWeight(1);
  
  noFill();

  //black half of circle
  stroke ('black');

  circle(200, 200, 350);

  //white half of circle
  stroke (255);

  arc (
    200,
    200,
    350,
    350,
    Math.PI / 180 * -90,
    Math.PI / 180 * 90,
  );


  //gray rect
  stroke('gray');

  rect (
    50.5, 109,
    299, 182
  );

  //triangle white
  stroke ('white');

  triangle (
    200, 25,
    200, 291,
    50.5, 291,
  );

  //triangle black
  stroke ('black');

  triangle (
    200, 25,
    200, 291,
    349.5, 291,
  );

  //frame (with lignes)
  strokeWeight (10);
  strokeCap(SQUARE);

  //black strokes
  stroke ('black');

  //left
  line (
    0, 200,
    0, 400,
  );

  //top
  line (
    0, 0,
    400, 0,
  );
  
  //right
  line (
    400, 0,
    400, 400,
  );

  //bottom
  line (
    0, 400,
    400, 400,
  );

  



  //gray strokes
  stroke('gray')

  //left
  line (
    0, 0,
    0, 200,
  );

  //top
  line (
    200, 0,
    400, 0,
  );

  //right
  line (
    400, 200,
    400, 400,
  );

  //bottomn
  line (
    0, 400,
    200, 400,
  );

  save('test.svg');
   
}

 








  



 




