import './App.css';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useRef, forwardRef } from 'react';
import { Model } from './Model';
import { OrbitControls } from '@react-three/drei';
import Stars from './Stars';
import ScrambleText from './ScrambleText';
import SolarSystemBackground from './SolarSystemBackground';

function Navbar({ activeSection, onNavClick, visible }) {
  return (
    <nav className={`geist-navbar${visible ? '' : ' navbar-hidden'}`}>
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

function useScrambleTrigger() {
  const ref = useRef(null);
  const [trigger, setTrigger] = useState(false);
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setTrigger(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);
  return [ref, trigger];
}

const Hero = forwardRef(({ onScrollDown }, ref) => {
  const [titleRef, scramble] = useScrambleTrigger();
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
        <h1 ref={titleRef}><ScrambleText text={"hey\nthere!"} trigger={scramble} speed={10} /></h1>
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
            <Canvas camera={{ position: [0, 30, 35], fov: 35 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 10, 7]} intensity={1.2} />
              <Model 
                mouse={mouse} 
                isCanvasHovered={isCanvasHovered}
                isDragging={isDragging}
              />
              <OrbitControls enablePan={false} enableZoom={false} />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </section>
  );
});
Hero.displayName = "Hero";

const About = forwardRef(({ onScrollDown }, ref) => {
  const [titleRef, scramble] = useScrambleTrigger();
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
        <h2 ref={titleRef}><ScrambleText text={"about\nme"} trigger={scramble} speed={10} /></h2>
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
  const [mainTitleRef, mainScramble] = useScrambleTrigger();
  const figmaUrl = "https://www.figma.com/design/BUlg2UJBiw6W5DxYngRTbA/Keyboard?node-id=0-1&p=f&t=jAdIdzilod0JEAVL-0";
  const titles = [
    "OP-XY Figma Recreation",
    "iPhone 16 Recreation",
    "Glass Morphism sample"
  ];
  const descriptions = [
    `In this project, I meticulously replicated Teenage Engineering's OP-XY model entirely in Figma. The image showcased in both the banner and poster is designed 100% using Figma, including the 2D perspective model recreation. Every detail has been crafted to reflect the original design as accurately as possible within a flat interface.\nExplore the full design by clicking the image`,
    `In this project, I precisely recreated a 2D model of the iPhone 16 Pro Max entirely within Figma. Every element from the camera layout to the device contours and subtle design details was carefully crafted to mirror the actual product as accurately as possible. The visuals featured in the banner and poster are fully designed in Figma, showcasing a faithful replication from a 2D perspective without relying on any external assets.`,
    `In this project, I practiced glassmorphism by recreating the pricing section from X in Figma.\nThe design features realistic glass effects using blur, transparency, and depth.\nI focused on achieving smooth border refraction and natural light behavior.\nReplicating these details required imagination and a strong eye for precision.\nIt was a great exercise in applying modern UI design principles.`
  ];
  // For each project card title
  const projectTitleRefs = [useScrambleTrigger(), useScrambleTrigger(), useScrambleTrigger()];
  
  return (
    <section ref={ref} className="geist-projects" style={{position: 'relative', overflow: 'hidden'}}>
      <SolarSystemBackground />
      <h2 ref={mainTitleRef}><ScrambleText text={"my\nprojects"} trigger={mainScramble} speed={10} /></h2>
      <div className="project-list">
        {[...Array(3)].map((_, index) => (
          <div className="project-item" key={index}>
            <div className="project-thumbcol">
              <div className="project-title">
                <h3 ref={projectTitleRefs[index][0]}><ScrambleText text={titles[index]} trigger={projectTitleRefs[index][1]} speed={10} /></h3>
              </div>
              <div className="project-thumbnail">
                {index === 0 ? (
                  <a href={figmaUrl} target="_blank" rel="noopener noreferrer">
                    <img src={`/thumb${index + 1}.png`} alt={`Project thumbnail ${index + 1}`} />
                  </a>
                ) : (
                  <img src={`/thumb${index + 1}.png`} alt={`Project thumbnail ${index + 1}`} />
                )}
              </div>
            </div>
            <div className="project-content">
              <div className="project-banner">
                {index === 0 ? (
                  <a href={figmaUrl} target="_blank" rel="noopener noreferrer">
                    <img src={`/banner${index + 1}.png`} alt={`Project banner ${index + 1}`} />
                  </a>
                ) : (
                  <img src={`/banner${index + 1}.png`} alt={`Project banner ${index + 1}`} />
                )}
              </div>
              <div className="project-description">
                <p>{descriptions[index]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
Projects.displayName = "Projects";

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(window.scrollY);
  const ticking = useRef(false);

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
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY < 10) {
            setShowNavbar(true);
          } else if (currentScrollY < lastScrollY.current) {
            setShowNavbar(true);
          } else if (currentScrollY > lastScrollY.current) {
            setShowNavbar(false);
          }
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    const handleMouseMove = (e) => {
      if (e.clientY < 60) {
        setShowNavbar(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
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
        <Navbar activeSection={activeSection} onNavClick={handleNavClick} visible={showNavbar} />
        <Hero ref={heroRef} onScrollDown={handleScrollDown} />
        <About ref={aboutRef} onScrollDown={handleScrollToProjects} />
        <Projects ref={projectsRef} />
      </div>
    </div>
  );
}

export default App;
