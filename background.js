// background.js - Student Network Constellation
const backgroundSketch = (p) => {
    let particles = [];
    const numParticles = 80;

    p.setup = () => {
        // Create canvas that covers full window
        let c = p.createCanvas(p.windowWidth, p.windowHeight);
        c.position(0, 0);
        c.style('z-index', '-10'); // Behind everything
        c.style('position', 'fixed');
        c.style('pointer-events', 'none'); // Let clicks pass through!

        // Init Particles
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle(p));
        }
    };

    p.draw = () => {
        p.clear(); // Transparent background

        // Update & Draw Particles
        for (let part of particles) {
            part.update();
            part.show();
            part.edges();
            part.interact(); // Mouse interaction
        }

        // Draw Lines between close particles
        p.stroke(255, 30); // Very faint
        p.strokeWeight(1);
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let d = p.dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
                if (d < 120) {
                    p.line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
                }
            }
        }

    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };

    class Particle {
        constructor(p) {
            this.p = p;
            this.pos = p.createVector(p.random(p.width), p.random(p.height));
            this.vel = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
            this.size = p.random(2, 4);
            this.baseColor = p.color(255, 100);
        }

        update() {
            this.pos.add(this.vel);
        }

        show() {
            this.p.noStroke();
            this.p.fill(this.baseColor);
            this.p.ellipse(this.pos.x, this.pos.y, this.size);
        }

        edges() {
            if (this.pos.x < 0) this.pos.x = this.p.width;
            if (this.pos.x > this.p.width) this.pos.x = 0;
            if (this.pos.y < 0) this.pos.y = this.p.height;
            if (this.pos.y > this.p.height) this.pos.y = 0;
        }

        interact() {
            // Mouse Repulsion
            let mouse = this.p.createVector(this.p.mouseX, this.p.mouseY);
            let d = this.p.dist(this.pos.x, this.pos.y, mouse.x, mouse.y);
            if (d < 150) {
                let force = p5.Vector.sub(this.pos, mouse);
                force.setMag(2); // Push strength
                this.pos.add(force);
            }
        }
    }
};

new p5(backgroundSketch);
