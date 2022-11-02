let wert;

let changeratezoom = 0.02









function make2DArray(cols,rows){
	let arr = new Array(cols);
	for(let i=0; i<arr.length; i++){
		arr[i] = new Array(rows);
	}
	return arr;
}

let grid;
let cols, rows;
let resolution = 5;
let xoff = 0;
let yoff = 0;
let zoff = 0;
let resoff = 0;

function setup() {
	createCanvas(400, 400); // get slow: , SVG	

  cols = width / resolution;
	rows = height / resolution;
	grid = make2DArray(cols, rows);

  wert = random(0.003,0.03)

}

function draw() {
	background(255);


// wert = noise(resoff)/20

console.log(wert)







	for (let i = 0; i< cols; i++){
    xoff = 0;
		for (let j = 0; j< rows; j++){
      grid[i][j] = noise(xoff,yoff,zoff) * 15;
      xoff = xoff+wert;        
		}
    yoff = yoff+wert;
	}

  // zwischen: 0.03 und 0.003
  // zwischen: 0.01 und 0.001

  yoff = 0;
  xoff = 0;
  // zoff = zoff +random(0.005,0.008)
  zoff = zoff +0.004

  resoff = resoff + changeratezoom 


  noStroke();
	for (let i = 0; i < cols; i++){
		for (let j = 0; j < rows; j++){
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] < 1){
        fill("#480ca8");
      } else if (grid[i][j] < 2){
        fill("#560bad");
      } else if (grid[i][j] < 3){
        fill("#7209b7");
      } else if (grid[i][j] < 4){
        fill("#b5179e");
      } else if (grid[i][j] < 5){
        fill("#f72585");
      } else if (grid[i][j] < 6){
        fill("#3a0ca3");
      } else if (grid[i][j] < 7){
        fill("#3f37c9");
      } else if (grid[i][j] < 8){
        fill("#4361ee");
      } else if (grid[i][j] < 9){
        fill("#4895ef");
      } else {
        fill("#4cc9f0");
      }
			rect(x, y, resolution, resolution);
		}
	}

  // if (mouseIsPressed) {
    let values = [];
    let k = 0;
    for (let i = 0; i < grid.length; i += 1) {
      for(let j = 0; j < grid[i].length; j += 1) {
        values.push(grid[j][i]);
        k += 1;
      }
    }
  
    const contours = d3.contours()
      // .thresholds([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])
      .size([cols, rows])
      .smooth(true)
      (values);
    
    noFill();
    stroke('white');
    for (let c = 0; c < contours.length; c += 1) {
      beginShape();
      for(let p = 0; p < contours[c].coordinates[0][0].length; p += 1) {
        vertex(
          contours[c].coordinates[0][0][p][0] * resolution,
          contours[c].coordinates[0][0][p][1] * resolution
        );
      }
      // holes
      for (let h = 1; h < contours[c].coordinates.length; h += 1) {
        beginContour();
        for(let p = 0; p < contours[c].coordinates[h][0].length; p += 1) {
          vertex(
            contours[c].coordinates[h][0][p][0] * resolution,
            contours[c].coordinates[h][0][p][1] * resolution
          );
        }
        endContour();
      }
      endShape();
    }
  
  //   noLoop();
  // } 

  // saveFrames('v7', 'png', 1, 25);
    
}