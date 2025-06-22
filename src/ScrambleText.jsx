import React, { useEffect, useRef, useState } from 'react';

const CHARS = '!<>-_\/[]{}—=+*^?#________';

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function ScrambleText({ text, speed = 30, className = '', trigger = true, ...props }) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const queue = useRef([]);
  const triggered = useRef(false);

  useEffect(() => {
    if (!trigger) {
      setDisplay(text);
      triggered.current = false;
      return;
    }
    if (triggered.current) return;
    triggered.current = true;
    let running = true;
    queue.current = text.split('').map((char, i) => ({
      from: char,
      to: char,
      start: Math.floor(Math.random() * 40),
      end: Math.floor(Math.random() * 40) + 20,
      char: ''
    }));
    frame.current = 0;

    function update() {
      let output = '';
      let complete = 0;
      for (let i = 0; i < queue.current.length; i++) {
        let { from, to, start, end, char } = queue.current[i];
        if (frame.current >= end) {
          output += to;
          complete++;
        } else if (frame.current >= start) {
          char = randomChar();
          output += `<span class="scramble">${char}</span>`;
        } else {
          output += from;
        }
      }
      setDisplay(output);
      if (complete === queue.current.length) return;
      frame.current++;
      if (running) setTimeout(update, speed);
    }
    update();
    return () => { running = false; };
  }, [text, speed, trigger]);

  return (
    <span className={className} {...props} dangerouslySetInnerHTML={{ __html: display }} />
  );
} 