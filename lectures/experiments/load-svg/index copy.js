const jscad = require('@jscad/modeling')
const io = require('@jscad/io')

const {line, arc, circle, ellipse, rectangle, cube, sphere, cylinder, cuboid, roundedCuboid, geodesicSphere, ellipsoid, roundedCylinder, cylinderElliptic, torus, polygon, polyhedron} = jscad.primitives;
const {extrudeRectangular, extrudeLinear, extrudeRotate} = jscad.extrusions;
const {colorize, colorNameToRgb} = jscad.colors;
const {union, subtract, intersect, scission} = jscad.booleans;
const {offset, expand} = jscad.expansions;
const {translate, rotate, scale, center, align} = jscad.transforms;

const { svg, stl } = io.deserializers;

const loadFile = (path) => {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", path, false);
  oReq.send();
  return oReq.responseText;
};

const main = () => {
  const shapes = svg({
		output: 'geometry',
		target: 'path',
		segments: 32
	}, loadFile("http://127.0.0.1:5555/code/first-3d-example/test.svg"));

  const stlObj = stl({
    output: 'geometry'
  }, loadFile("http://127.0.0.1:5555/code/first-3d-example/cube.stl"));

  const poly = extrudeLinear({ height: 20 }, union(polygon({ points: shapes[0].points.reverse() })));

  return [
    poly,
    translate([100, 0, 0], stlObj)
  ];
};

module.exports = { main };