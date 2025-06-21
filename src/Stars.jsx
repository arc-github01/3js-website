import React, { useRef, useEffect } from 'react';
import './Stars.css';

const Stars = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let stars = [];
    const starCount = 150;
    const mouse = {
      x: undefined,
      y: undefined,
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const createStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * (canvas.width || 0);
        const y = Math.random() * (canvas.height || 0);
        stars.push({
          x,
          y,
          originalX: x,
          originalY: y,
          radius: Math.random() * 1.2 + 0.5,
          originalAlpha: Math.random() * 0.5 + 0.1,
          alpha: Math.random() * 0.5 + 0.1,
          depth: Math.random() * 0.8 + 0.2, // for parallax
        });
      }
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const canvasRect = canvas.getBoundingClientRect();
      const isMouseSet = mouse.x !== undefined;

      const mouseXOnCanvas = isMouseSet ? mouse.x - canvasRect.left : canvas.width / 2;
      const mouseYOnCanvas = isMouseSet ? mouse.y - canvasRect.top : canvas.height / 2;

      stars.forEach(star => {
        let targetX = star.originalX;
        let targetY = star.originalY;

        if (isMouseSet) {
          const displacementX = (mouseXOnCanvas - canvas.width / 2) * star.depth * 0.08;
          const displacementY = (mouseYOnCanvas - canvas.height / 2) * star.depth * 0.08;
          targetX = star.originalX - displacementX;
          targetY = star.originalY - displacementY;
        }

        star.x += (targetX - star.x) * 0.1;
        star.y += (targetY - star.y) * 0.1;

        const dist = Math.sqrt(
          Math.pow(star.x - mouseXOnCanvas, 2) +
          Math.pow(star.y - mouseYOnCanvas, 2)
        );

        if (dist < 100 && isMouseSet) {
          star.alpha += (1 - star.alpha) * 0.05;
        } else {
          star.alpha -= (star.alpha - star.originalAlpha) * 0.05;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });
    };

    const animate = () => {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    const init = () => {
      resizeCanvas();
      createStars();
      // Only start animating if we have a canvas size
      if (canvas.width > 0 && canvas.height > 0) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animate();
      }
    };

    init();

    window.addEventListener('mousemove', handleMouseMove);
    const resizeObserver = new ResizeObserver(init);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="stars-canvas" />;
};

export default Stars; 