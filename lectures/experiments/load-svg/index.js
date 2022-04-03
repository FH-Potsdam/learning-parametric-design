const jscad = require('@jscad/modeling')
const io = require('@jscad/io')

const {line, arc, circle, ellipse, rectangle, cube, sphere, cylinder, cuboid, roundedCuboid, geodesicSphere, ellipsoid, roundedCylinder, cylinderElliptic, torus, polygon, polyhedron} = jscad.primitives;
const {extrudeRectangular, extrudeLinear, extrudeRotate} = jscad.extrusions;
const {colorize, colorNameToRgb} = jscad.colors;
const {union, subtract, intersect, scission} = jscad.booleans;
const {offset, expand} = jscad.expansions;
const {translate, rotate, scale, center, align} = jscad.transforms;

const main = () => {
  const objects = [];
  
  const obj = polyhedron({
    points: [
      [-50, -50, 0],
      [50, -50, 0],
      [50, 50, 0],
      [-50, 50, 0]
    ],
    faces: [
      [0,1,2],
      [0,3,2]
    ]
  });

  objects.push(obj);
  
  return objects;
};

module.exports = { main };