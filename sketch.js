// Matter.js aliases
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

let engine;
let world;
let mConstraint;
let bubbles = [];
let boundaries = [];

let canvasWidth = 800;
let canvasHeight = 500;

// For color scale
let performMin, performMax;

function setup() {
  let canvas = createCanvas(min(windowWidth - 40, canvasWidth), canvasHeight);
  canvas.parent('p5-container');

  // Initialize Matter.js with gravity
  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.y = 1; // Gravity pulls bubbles down

  createBoundaries();
  createBubbles();

  // Mouse interaction
  let canvasMouse = Mouse.create(canvas.elt);
  canvasMouse.pixelRatio = pixelDensity();
  let options = {
    mouse: canvasMouse
  };
  mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);

  Engine.run(engine);
}

function draw() {
  background(30, 41, 59); // Dark Navy background

  // Draw all bubbles
  for (let b of bubbles) {
    b.show();
  }

  // Draw color scale legend at bottom right
  drawColorScale();
}

function drawColorScale() {
  let scaleX = width - 180;
  let scaleY = height - 60;
  let scaleWidth = 150;
  let scaleHeight = 20;

  // Draw gradient bar
  for (let i = 0; i < scaleWidth; i++) {
    let t = i / scaleWidth;
    let c = lerpColor(color('#22d3ee'), color('#1e3a8a'), t); // Cyan to Deep Blue
    stroke(c);
    strokeWeight(1);
    line(scaleX + i, scaleY, scaleX + i, scaleY + scaleHeight);
  }

  // Labels
  fill(255);
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  text(`${performMin.toFixed(2)}`, scaleX, scaleY + scaleHeight + 3);

  textAlign(RIGHT, TOP);
  text(`${performMax.toFixed(2)}`, scaleX + scaleWidth, scaleY + scaleHeight + 3);

  textAlign(CENTER, BOTTOM);
  textSize(12);
  text('Performance Index', scaleX + scaleWidth / 2, scaleY - 3);
}

function createBoundaries() {
  let thickness = 100;
  let options = {
    isStatic: true,
    restitution: 0.3
  };

  // Bottom wall
  boundaries.push(new Boundary(width / 2, height - thickness / 2, width, thickness, options));
  // Left wall
  boundaries.push(new Boundary(thickness / 2, height / 2, thickness, height, options));
  // Right wall
  boundaries.push(new Boundary(width - thickness / 2, height / 2, thickness, height, options));
  // Top wall
  boundaries.push(new Boundary(width / 2, thickness / 2, width, thickness, options));
}

function createBubbles() {
  // Use embedded `studentData` from data.js
  let costValues = studentData.map(d => d.HousingCosts);
  let performValues = studentData.filter(d => d.PerformIndex > 0).map(d => d.PerformIndex);

  let costMin = Math.min(...costValues);
  let costMax = Math.max(...costValues);

  performMin = Math.min(...performValues);
  performMax = Math.max(...performValues);

  for (let d of studentData) {
    // Radius based on HousingCosts
    let r = map(d.HousingCosts, costMin, costMax, 20, 55);

    // Color: Cyan to Deep Blue gradient based on Performance Index
    let col;
    if (d.PerformIndex === 0) {
      col = color(100, 100, 100); // Gray for missing data
    } else {
      let t = map(d.PerformIndex, performMin, performMax, 0, 1);
      // Cyan (low) to Deep Blue (high) - matches dark background
      col = lerpColor(color('#22d3ee'), color('#1e3a8a'), t);
    }

    // Spawn bubbles near top so they fall down
    let padding = r + 20;
    let x = random(padding, width - padding);
    let y = random(padding, height / 3); // Spawn in upper third

    bubbles.push(new Bubble(x, y, r, col, d.Country));
  }
}

function mousePressed() {
  for (let b of bubbles) {
    if (b.contains(mouseX, mouseY)) {
      if (window.updateRadarChart) {
        window.updateRadarChart(b.label);
      }
      break;
    }
  }
}

class Boundary {
  constructor(x, y, w, h, options) {
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.w = w;
    this.h = h;
    World.add(world, this.body);
  }
}

class Bubble {
  constructor(x, y, r, col, label) {
    let options = {
      restitution: 0.3,
      friction: 0.5,
      frictionAir: 0.01,
      density: 0.001
    };
    this.r = r;
    this.body = Bodies.circle(x, y, r, options);
    this.col = col;
    this.label = label;
    this.body.label = label;

    World.add(world, this.body);
  }

  contains(px, py) {
    let pos = this.body.position;
    let d = dist(px, py, pos.x, pos.y);
    return d < this.r;
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    translate(pos.x, pos.y);
    rotate(angle);

    // Draw bubble
    fill(this.col);
    stroke(255, 150);
    strokeWeight(2);
    circle(0, 0, this.r * 2);

    // Draw country label
    fill(0); // Black text for contrast
    noStroke();
    textAlign(CENTER, CENTER);

    // Dynamic text sizing
    let baseSize = this.r * 0.35;
    textSize(max(baseSize, 10));
    textStyle(BOLD);
    text(this.label, 0, 0);

    pop();
  }
}
