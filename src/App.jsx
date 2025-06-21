import './App.css';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useRef, forwardRef } from 'react';
import { Model } from './Model';
import { OrbitControls } from '@react-three/drei';
import Stars from './Stars';

function Navbar({ activeSection, onNavClick }) {
  return (
    <nav className="geist-navbar">
      <ul>
        <li className={activeSection === 'home' ? 'active' : ''} onClick={() => onNavClick('home')}>Home</li>
        <li className={activeSection === 'about' ? 'active' : ''} onClick={() => onNavClick('about')}>About</li>
        <li className={activeSection === 'projects' ? 'active' : ''} onClick={() => onNavClick('projects')}>Project</li>
        <li>Extra Curricular</li>
      </ul>
    </nav>
  );
}

function Sidebar() {
  return (
    <aside className="geist-sidebar">
      <div className="sidebar-content">
        <div className="sidebar-title">CS/UI/UX engineer</div>
        <div className="sidebar-line"></div>
        <div className="sidebar-year">2023</div>
      </div>
    </aside>
  );
}

const Hero = forwardRef(({ onScrollDown }, ref) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isCanvasHovered, setIsCanvasHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newOpacity = Math.max(0, 1 - scrollY / 200); // Fades out over 200px
      setOpacity(newOpacity);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMouse({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCanvasMouseEnter = () => setIsCanvasHovered(true);
  const handleCanvasMouseLeave = () => {
    setIsCanvasHovered(false);
    setIsDragging(false);
  };
  const handleCanvasMouseDown = () => setIsDragging(true);
  const handleCanvasMouseUp = () => setIsDragging(false);

  return (
    <section ref={ref} className="geist-hero">
      <div className="hero-left">
        <h1>hey<br />there!</h1>
        <p className="subtitle">- Its Aryan Kumar here</p>
        <button
          className="scroll-down"
          onClick={onScrollDown}
          style={{ opacity }}
        >
          Scroll down <span>↓</span>
        </button>
      </div>
      <div className="hero-right">
        <div
          className="hero-3d-canvas"
          onMouseEnter={handleCanvasMouseEnter}
          onMouseLeave={handleCanvasMouseLeave}
          onMouseDown={handleCanvasMouseDown}
          onMouseUp={handleCanvasMouseUp}
        >
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 10, 20], fov: 35 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 10, 7]} intensity={1.2} />
              <Model 
                mouse={mouse} 
                isCanvasHovered={isCanvasHovered}
                isDragging={isDragging}
              />
              <OrbitControls enablePan={false} />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </section>
  );
});
Hero.displayName = "Hero";

const About = forwardRef(({ onScrollDown }, ref) => {
  return (
    <section ref={ref} className="geist-about">
      <Stars />
      <div className="about-left">
        <p>
          Hi, I'm Aryan Kumar a 21 y/o Computer Science undergrad with a sharp eye for design and a
          deep interest in building tech that's both functional and beautiful.
          For the past three years, I've explored UI/UX, front-end development, and smart systems, blending aesthetics
          with engineering. Whether I'm crafting interfaces in React, designing hardware-based stroke detection
          systems, or experimenting with Three.js visuals, I focus on precision, creativity, and real-world impact.
        </p>
      </div>
      <div className="about-right">
        <h2>about<br />me</h2>
      </div>
      <button
        className="scroll-down-about"
        onClick={onScrollDown}
      >
        Scroll down <span>↓</span>
      </button>
    </section>
  );
});
About.displayName = "About";

const Projects = forwardRef((props, ref) => {
  return (
    <section ref={ref} className="geist-projects">
      <h2>My Projects</h2>
    </section>
  );
});
Projects.displayName = "Projects";

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);

  const handleScrollDown = () => {
    aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToProjects = () => {
    projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (section) => {
    if (section === 'home') {
      heroRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'about') {
      aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'projects') {
      projectsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const heroEl = heroRef.current;
    const aboutEl = aboutRef.current;
    const projectsEl = projectsRef.current;

    if (heroEl) {
        heroEl.id = 'home';
        observer.observe(heroEl);
    }
    if (aboutEl) {
        aboutEl.id = 'about';
        observer.observe(aboutEl);
    }
    if (projectsEl) {
        projectsEl.id = 'projects';
        observer.observe(projectsEl);
    }

    return () => {
      if (heroEl) observer.unobserve(heroEl);
      if (aboutEl) observer.unobserve(aboutEl);
      if (projectsEl) observer.unobserve(projectsEl);
    };
  }, []);

  return (
    <div className="geist-root">
      <Sidebar />
      <div className="geist-main">
        <Navbar activeSection={activeSection} onNavClick={handleNavClick} />
        <Hero ref={heroRef} onScrollDown={handleScrollDown} />
        <About ref={aboutRef} onScrollDown={handleScrollToProjects} />
        <Projects ref={projectsRef} />
      </div>
    </div>
  );
}

export default App;
