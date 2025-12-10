import './App.css';
import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect, useRef, forwardRef } from 'react';
import { Model } from './Model';
import { OrbitControls } from '@react-three/drei';
import Stars from './Stars';
import ScrambleText from './ScrambleText';
import SolarSystemBackground from './SolarSystemBackground';

function Navbar({ activeSection, onNavClick, visible, isMobile, isMenuOpen, onMenuToggle }) {
  return (
    <nav className={`geist-navbar${visible ? '' : ' navbar-hidden'}${isMobile ? ' mobile' : ''}${isMenuOpen ? ' open' : ''}`}>
      {isMobile && (
        <button className="hamburger" aria-label="Open menu" onClick={onMenuToggle}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      )}
      <ul style={isMobile ? { display: isMenuOpen ? 'flex' : 'none' } : {}}>
        <li className={activeSection === 'home' ? 'active' : ''} onClick={() => { onNavClick('home'); if (isMobile) onMenuToggle(false); }}>Home</li>
        <li className={activeSection === 'about' ? 'active' : ''} onClick={() => { onNavClick('about'); if (isMobile) onMenuToggle(false); }}>About</li>
        <li className={activeSection === 'projects' ? 'active' : ''} onClick={() => { onNavClick('projects'); if (isMobile) onMenuToggle(false); }}>Project</li>
        <li className={activeSection === 'skills' ? 'active' : ''} onClick={() => { onNavClick('skills'); if (isMobile) onMenuToggle(false); }}>Skills</li>
        <li className={activeSection === 'contact' ? 'active' : ''} onClick={() => { onNavClick('contact'); if (isMobile) onMenuToggle(false); }}>Contact</li>
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
  const figmaUrl = "https://www.figma.com/design/bZCHa5Ht5RUwmdyvqPm1LV/My-work-compilation?node-id=0-1&t=rmUw8RNs4TNN7L5e-1";
  const titles = [
    "OP-XY Figma Recreation",
    "iPhone 16 Recreation",
    "Glass Morphism sample",
    "OP-XY Figma Recreation V2"
  ];
  const descriptions = [
    `In this project, I meticulously replicated Teenage Engineering's OP-XY model entirely in Figma. The image showcased in both the banner and poster is designed 100% using Figma, including the 2D perspective model recreation. Every detail has been crafted to reflect the original design as accurately as possible within a flat interface.\nExplore the full design by clicking the image`,
    `In this project, I precisely recreated a 2D model of the iPhone 16 Pro Max entirely within Figma. Every element from the camera layout to the device contours and subtle design details was carefully crafted to mirror the actual product as accurately as possible. The visuals featured in the banner and poster are fully designed in Figma, showcasing a faithful replication from a 2D perspective without relying on any external assets.`,
    `In this project, I practiced glassmorphism by recreating the pricing section from X in Figma.\nThe design features realistic glass effects using blur, transparency, and depth.\nI focused on achieving smooth border refraction and natural light behavior.\nReplicating these details required imagination and a strong eye for precision.\nIt was a great exercise in applying modern UI design principles.`,
    `A detailed vector-based forest scene created entirely in Figma, using layered silhouettes, structured frames, and reusable color styles to build depth and atmosphere. The buildings are crafted with precise boolean shapes and componentized window patterns, showcasing strong control over Figma's vector tools, constraints, and scalable design workflow.`
  ];
  // For each project card title
  const projectTitleRefs = [useScrambleTrigger(), useScrambleTrigger(), useScrambleTrigger(), useScrambleTrigger()];
  
  return (
    <section ref={ref} className="geist-projects" style={{position: 'relative', overflow: 'hidden'}}>
      <SolarSystemBackground />
      <h2 ref={mainTitleRef}><ScrambleText text={"my\nprojects"} trigger={mainScramble} speed={10} /></h2>
      <div className="project-list">
        {[...Array(4)].map((_, index) => (
          <div className="project-item" key={index}>
            <div className="project-thumbcol">
              <div className="project-title">
                <h3 ref={projectTitleRefs[index][0]}><ScrambleText text={titles[index]} trigger={projectTitleRefs[index][1]} speed={10} /></h3>
              </div>
              <div className="project-thumbnail">
                {(index === 0 || index === 3) ? (
                  <a href={figmaUrl} target="_blank" rel="noopener noreferrer">
                    <img src={`/thumb${index === 3 ? 4 : index + 1}.png`} alt={`Project thumbnail ${index + 1}`} />
                  </a>
                ) : (
                  <img src={`/thumb${index + 1}.png`} alt={`Project thumbnail ${index + 1}`} />
                )}
              </div>
            </div>
            <div className="project-content">
              <div className="project-banner">
                {(index === 0 || index === 3) ? (
                  <a href={figmaUrl} target="_blank" rel="noopener noreferrer">
                    <img src={`/banner${index === 3 ? 4 : index + 1}.png`} alt={`Project banner ${index + 1}`} />
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
      <div className="figma-button-container">
        <a href={figmaUrl} target="_blank" rel="noopener noreferrer" className="figma-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="figma-icon">
            <path d="M8.5 1C6.567 1 5 2.567 5 4.5C5 6.433 6.567 8 8.5 8H10V4.5C10 2.567 8.433 1 6.5 1H8.5Z" fill="#0ACF83"/>
            <path d="M5 12C5 10.067 6.567 8.5 8.5 8.5C10.433 8.5 12 10.067 12 12C12 13.933 10.433 15.5 8.5 15.5C6.567 15.5 5 13.933 5 12Z" fill="#A259FF"/>
            <path d="M5 19.5C5 17.567 6.567 16 8.5 16H10V19.5C10 21.433 8.433 23 6.5 23C4.567 23 3 21.433 3 19.5V16H5V19.5Z" fill="#F24E1E"/>
            <path d="M10 1H15.5C17.433 1 19 2.567 19 4.5C19 6.433 17.433 8 15.5 8H10V1Z" fill="#FF7262"/>
            <path d="M19 12C19 10.067 17.433 8.5 15.5 8.5C13.567 8.5 12 10.067 12 12C12 13.933 13.567 15.5 15.5 15.5C17.433 15.5 19 13.933 19 12Z" fill="#1ABCFE"/>
          </svg>
          <span>View my Figma</span>
        </a>
      </div>
    </section>
  );
});
Projects.displayName = "Projects";

const Skills = forwardRef((props, ref) => {
  const [titleRef, scramble] = useScrambleTrigger();
  
  const skillCategories = [
    {
      title: "Frontend Development",
      skills: ["React", "JavaScript", "TypeScript", "HTML/CSS", "Three.js", "WebGL"]
    },
    {
      title: "Design & UI/UX",
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping", "Wireframing"]
    },
    {
      title: "Backend & Tools",
      skills: ["Node.js", "Python", "Git", "Vite", "Webpack", "APIs"]
    }
  ];

  return (
    <section ref={ref} className="geist-skills" style={{position: 'relative', overflow: 'hidden'}}>
      <SolarSystemBackground />
      <h2 ref={titleRef}><ScrambleText text={"my\nskills"} trigger={scramble} speed={10} /></h2>
      <div className="skills-grid">
        {skillCategories.map((category, index) => (
          <div className="skill-category" key={index}>
            <h3>{category.title}</h3>
            <div className="skill-list">
              {category.skills.map((skill, skillIndex) => (
                <span className="skill-item" key={skillIndex}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});
Skills.displayName = "Skills";

const Contact = forwardRef((props, ref) => {
  const [titleRef, scramble] = useScrambleTrigger();
  
  const contactMethods = [
    {
      title: "Email",
      value: "aryank506@gmail.com",
      link: "mailto:aryank506@gmail.com",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "LinkedIn",
      value: "linkedin.com/in/aryan-kumar-029abb289",
      link: "https://www.linkedin.com/in/aryan-kumar-029abb289/",
      icon: (
        <svg width="20" height="20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <image href="https://img.icons8.com/ios/100/linkedin.png" width="100" height="100"/>
        </svg>
      )
    },
    {
      title: "GitHub",
      value: "github.com/arc-github01",
      link: "https://github.com/arc-github01",
      icon: (
        <svg width="20" height="20" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" fill="currentColor"/>
        </svg>
      )
    }
  ];

  return (
    <section ref={ref} className="geist-contact" style={{position: 'relative', overflow: 'hidden'}}>
      <SolarSystemBackground />
      <h2 ref={titleRef}><ScrambleText text={"get in\ntouch"} trigger={scramble} speed={10} /></h2>
      <div className="contact-content">
        <div className="contact-left">
          <p>
            I'm always interested in new opportunities, creative projects, and meaningful collaborations. 
            Whether you have a project in mind, want to discuss technology, or just say hello, 
            I'd love to hear from you!
          </p>
        </div>
        <div className="contact-right">
          <div className="contact-methods">
            {contactMethods.map((method, index) => (
              <div className="contact-method" key={index}>
                <div className="contact-method-header">
                  <div className="contact-icon">
                    {method.icon}
                  </div>
                  <h3>{method.title}</h3>
                </div>
                <a href={method.link} target="_blank" rel="noopener noreferrer">
                  {method.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
Contact.displayName = "Contact";

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showNavbar, setShowNavbar] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(window.scrollY);
  const ticking = useRef(false);

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

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
    } else if (section === 'skills') {
      skillsRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact') {
      contactRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    const skillsEl = skillsRef.current;
    const contactEl = contactRef.current;

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
    if (skillsEl) {
        skillsEl.id = 'skills';
        observer.observe(skillsEl);
    }
    if (contactEl) {
        contactEl.id = 'contact';
        observer.observe(contactEl);
    }

    return () => {
      if (heroEl) observer.unobserve(heroEl);
      if (aboutEl) observer.unobserve(aboutEl);
      if (projectsEl) observer.unobserve(projectsEl);
      if (skillsEl) observer.unobserve(skillsEl);
      if (contactEl) observer.unobserve(contactEl);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700);
      if (window.innerWidth > 700) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="geist-root">
      <Sidebar />
      <div className="geist-main">
        <Hero ref={heroRef} onScrollDown={handleScrollDown} />
        <About ref={aboutRef} onScrollDown={handleScrollToProjects} />
        <Projects ref={projectsRef} />
        <Skills ref={skillsRef} />
        <Contact ref={contactRef} />
      </div>
    </div>
  );
}

export default App;
