"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

const COLORS = [
  "rgba(139, 0, 0, ALPHA)",
  "rgba(74, 14, 78, ALPHA)",
  "rgba(107, 27, 112, ALPHA)",
  "rgba(212, 175, 55, ALPHA)",
];

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const PARTICLE_COUNT = 35;
    particles.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas)
    );

    function createParticle(c: HTMLCanvasElement): Particle {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x: Math.random() * c.width,
        y: c.height + Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.8 + 0.3),
        alpha: Math.random() * 0.4 + 0.05,
        size: Math.random() * 3 + 1,
        color,
      };
    }

    function drawParticle(particle: Particle) {
      const color = particle.color.replace("ALPHA", String(particle.alpha));
      ctx!.beginPath();
      ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx!.fillStyle = color;
      ctx!.fill();
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.0005;

        drawParticle(p);

        // Reset particle when it goes off screen or fades
        if (p.y < -20 || p.alpha <= 0) {
          particles.current[i] = createParticle(canvas!);
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
}
