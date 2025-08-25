import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, User, Code, Briefcase, GraduationCap, Mail, Download, Github, Linkedin, Pocket as Docker, Server, Cloud, Terminal, Settings, GitBranch, Database, Shield, Cpu, Monitor, FileCode, Phone, MapPin, CheckCircle, Rocket, Wrench, Play, Eye, Loader2 } from 'lucide-react';
import heroImg from './assets/hero.jpg';
import collageImg from './assets/collage.jpg';
import emailjs from 'emailjs-com';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const heroRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Preloader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Particle animation
  useEffect(() => {
    if (!particlesRef.current) return;

    const canvas = particlesRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      type: 'star' | 'dot' | 'plus';
    }> = [];

    // Create particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        type: ['star', 'dot', 'plus'][Math.floor(Math.random() * 3)] as 'star' | 'dot' | 'plus'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Mouse interaction
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          particle.vx += dx * 0.00005;
          particle.vy += dy * 0.00005;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = distance < 100 ? '#00b4d8' : '#e0e0e0';

        if (particle.type === 'star') {
          drawStar(ctx, particle.x, particle.y, particle.size);
        } else if (particle.type === 'plus') {
          drawPlus(ctx, particle.x, particle.y, particle.size);
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Connect nearby particles
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = '#00b4d8';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mousePosition]);

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const x1 = x + Math.cos(angle) * size;
      const y1 = y + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawPlus = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.fillRect(x - size/2, y - size/4, size, size/2);
    ctx.fillRect(x - size/4, y - size/2, size/2, size);
  };

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects', 'education', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // Contact form handling
  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactStatus({ type: null, message: '' });

    try {
      // Initialize EmailJS with your credentials
      emailjs.init("VFJChot3zvBoEpCKl");

      const templateParams = {
        name: contactForm.name,
        email: contactForm.email,
        company: contactForm.company,
        subject: contactForm.subject,
        message: contactForm.message,
        timestamp: new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })
      };

      await emailjs.send(
        "service_4o21ql9",
        "template_pbnz3md",
        templateParams
      );

      setContactStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!'
      });

      // Reset form
      setContactForm({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      console.error('Email sending failed:', error);
      setContactStatus({
        type: 'error',
        message: 'Sorry, there was an error sending your message. Please try again or contact me directly at priyamsanodiya340@gmail.com'
      });
    } finally {
      setContactLoading(false);
    }
  };

  const projects = [
    {
      title: "CI/CD Pipeline with Jenkins & K8s",
      description: "Automated deployment pipeline using Jenkins for continuous integration and Kubernetes for orchestration.",
      tags: ["Jenkins", "Kubernetes", "Docker", "AWS"],
      github: "https://github.com/priyam930/Flask-App-Docker-Jenkins-1",
      features: ["Automated testing with PyTest", "Dockerized deployment pipeline", "Kubernetes cluster deployment"]
    },
    {
      title: "AWS Terraform Infrastructure",
      description: "Infrastructure as Code using Terraform to provision and manage AWS resources.",
      tags: ["Terraform", "AWS", "Infrastructure", "DevOps"],
      github: "https://github.com/priyam930/Terraform-Practice-Projets/tree/main/terraform_2025/Day4-project-vpc-wp-db",
      features: ["Multi-environment setup", "Auto-scaling configuration", "Security best practices"]
    },
    {
      title: "Flask Web App CI/CD",
      description: " The pipeline automates building Docker images, pushing them to Docker Hub, and deploying the app inside containers.",
      tags: ["Python", "Flask", "Docker", "Jenkins"],
      github: "https://github.com/priyam930/Docker-Jenkins-pipeline",
      blog: "https://medium.com/@priyamsanodiya340/building-a-docker-image-from-scratch-and-automating-deployment-using-jenkins-and-local-docker-0ac2c02f7f82",
      features: ["Automated Docker image build from source", "Seamless image push to Docker Hub", "Containerized deployment on the local Docker engine"]
    },
    {
      title: "Container Management Tool",
      description: "Bash-based CLI tool to automate 19+ Docker tasks for efficient container management.",
      tags: ["Bash", "Docker", "CLI", "Automation"],
      github: "https://github.com/priyam930/Container_Management",
      features: ["CLI tool for Docker services", "Real-time monitoring", "Lightweight automation"]
    },
    {
      title: "Real-time Cricket Tracker",
      description: "Dockerized Flask app with CI/CD pipeline for real-time cricket score tracking.",
      tags: ["Flask", "Docker", "Jenkins", "ArgoCD"],
      github: "https://github.com/priyam930/Flask_App_Cricbuzz_API",
      blog: "https://medium.com/@priyamsanodiya340/building-a-real-time-cricket-score-tracker-with-flask-and-deploying-it-to-kubernetes-with-0d450d3bb149",
      features: ["Real-time API integration", "Dockerized deployment", "Full CI/CD pipeline"]
    },
    {
      title: "Ansible + Docker on K8s",
      description: "Automated deployment using Ansible for configuration management and Kubernetes orchestration.",
      tags: ["Ansible", "Docker", "Kubernetes", "Automation"],
      github: "https://github.com/priyam930/Dockerized-Web-App-Using-Ansible-on-K8s",
      blog: "https://medium.com/@priyamsanodiya340/deploying-a-dockerized-web-app-using-ansible-on-a-manually-configured-kubernetes-cluster-6bd6ca94de03",
      features: ["Configuration management", "Automated deployments", "Scalable architecture"]
    }
  ];

  const skills = [
    { name: "Docker", icon: Docker, level: 90, color: "#0db7ed" },
    { name: "Kubernetes", icon: Server, level: 85, color: "#326ce5" },
    { name: "Git/GitHub", icon: GitBranch, level: 95, color: "#f05032" },
    { name: "Linux", icon: Terminal, level: 88, color: "#fcc624" },
    { name: "Jenkins", icon: Settings, level: 82, color: "#d33833" },
    { name: "AWS", icon: Cloud, level: 80, color: "#ff9900" },
    { name: "Terraform", icon: Database, level: 78, color: "#623ce4" },
    { name: "Python", icon: FileCode, level: 75, color: "#3776ab" },
    { name: "Bash", icon: Terminal, level: 85, color: "#4eaa25" },
    { name: "ArgoCD", icon: Cpu, level: 80, color: "#ef7b4d" },
    { name: "Monitoring", icon: Monitor, level: 82, color: "#e6522c" },
    { name: "Security", icon: Shield, level: 78, color: "#00d4aa" }
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  // Typing animation for hero subtitle
  const typingRoles = [
    'I am DevOps Engineer',
    'I am CI/CD Specialist',
    'I am Cloud Enthusiast'
  ];
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = typingRoles[typingIndex];
    let typeSpeed = isDeleting ? 40 : 80;
    if (!isDeleting && typingText === current) {
      typeSpeed = 1200;
      setTimeout(() => setIsDeleting(true), typeSpeed);
      return;
    }
    if (isDeleting && typingText === '') {
      setIsDeleting(false);
      setTypingIndex((prev) => (prev + 1) % typingRoles.length);
      return;
    }
    const timeout = setTimeout(() => {
      setTypingText((prev) =>
        isDeleting ? current.substring(0, prev.length - 1) : current.substring(0, prev.length + 1)
      );
    }, typeSpeed);
    return () => clearTimeout(timeout);
  }, [typingText, isDeleting, typingIndex, typingRoles]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-slate-700 border-t-[#00b4d8] rounded-full animate-spin mx-auto"></div>
            <Settings className="w-8 h-8 text-[#00b4d8] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="text-[#00b4d8] text-xl font-semibold mb-2">Loading DevOps Portfolio</div>
          <div className="text-slate-400">Initializing systems...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative overflow-x-hidden">
      {/* Animated Background */}
      <canvas
        ref={particlesRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%)' }}
      />

      {/* Mouse Follower */}
      <div
        className="fixed w-6 h-6 bg-[#00b4d8] rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${mousePosition.x > 0 ? 1 : 0})`
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-gradient-to-r from-[#0f172a] to-[#1e293b] backdrop-blur-md border-b border-cyan-400/20 shadow-lg transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#32cd32] rounded-full animate-ping"></div>
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] bg-clip-text text-transparent">
                  priyam.devops
                </div>
                <div className="text-xs text-slate-400">Available to work</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 hover:bg-slate-800 ${
                    activeSection === item.id 
                      ? 'bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] text-white shadow-lg shadow-[#00b4d8]/25' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
              <a
                href="https://drive.google.com/file/d/1js4zmtbTVbmK_JGNC2KY1_cwLoCxoxK_/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-[#00b4d8]/25 transition-all duration-300 animate-pulse flex items-center"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Resume
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 py-4 space-y-2 border-t border-slate-800">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="min-h-screen flex items-center justify-center relative pt-20 px-4 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f] overflow-hidden">
        {/* Animated background particles (optional: add tsParticles or SVG here) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Example: Floating DevOps SVG icons */}
          <svg className="absolute top-10 left-10 w-12 h-12 opacity-30 animate-float-slow" viewBox="0 0 24 24">
            {/* Replace with your DevOps SVG icon, e.g., Docker */}
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="#00b4d8" />
          </svg>
          <svg className="absolute bottom-20 right-20 w-16 h-16 opacity-20 animate-spin-slow" viewBox="0 0 24 24">
            {/* Replace with another DevOps SVG icon, e.g., Kubernetes */}
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="#6366f1" />
          </svg>
          {/* Add more icons as needed */}
        </div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 w-full max-w-6xl mx-auto">
            {/* Left: Text */}
            <div className="flex-1 flex flex-col items-start gap-6">
              <span className="text-cyan-400 text-lg font-semibold animate-pulse">👋 Hello, I'm</span>
              <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-pink-500 to-lime-400 bg-clip-text text-transparent drop-shadow-lg">
                Priyam <span className="text-white">Sanodiya</span>
              </h1>
              <div className="text-2xl md:text-3xl font-medium text-slate-200 min-h-[2.5rem]">
                <span className="transition-all duration-500">{typingText}<span className="border-r-2 border-cyan-400 ml-1 animate-pulse">&nbsp;</span></span>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center gap-2"
                >
                  <Play className="w-5 h-5 inline" />
                  View My Work
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-8 py-4 rounded-full border-2 border-cyan-400 text-cyan-400 font-bold hover:bg-cyan-400 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 flex items-center gap-2"
                >
                  <Mail className="w-5 h-5 inline" />
                  Get In Touch
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <a href="https://github.com/priyam930" className="p-4 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-full hover:bg-cyan-400 hover:border-cyan-400 transform hover:scale-110 transition-all duration-300 group" aria-label="GitHub">
                  <Github className="w-6 h-6 group-hover:text-white" />
                </a>
                <a href="https://www.linkedin.com/in/priyam-sanodiya/" className="p-4 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-full hover:bg-[#0077b5] hover:border-[#0077b5] transform hover:scale-110 transition-all duration-300 group" aria-label="LinkedIn">
                  <Linkedin className="w-6 h-6 group-hover:text-white" />
                </a>
                <a href="mailto:priyamsanodiya340@gmail.com" className="p-4 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-full hover:bg-pink-500 hover:border-pink-500 transform hover:scale-110 transition-all duration-300 group" aria-label="Mail">
                  <Mail className="w-6 h-6 group-hover:text-white" />
                </a>
              </div>
            </div>
            {/* Right: Profile Image with animated ring */}
            <div className="flex-1 flex justify-center items-center">
              <div className="relative w-80 h-80 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-pink-500 to-lime-400 opacity-60 blur-2xl animate-spin-slow"></div>
                <div className="group w-72 h-72 rounded-full border-4 border-cyan-400 shadow-2xl bg-slate-900 overflow-hidden flex items-center justify-center animate-float">
                  <img src={heroImg} alt="Priyam Sanodiya" className="w-full h-full object-cover rounded-full transform transition-transform duration-500 group-hover:scale-110" />
                </div>
                {/* Floating DevOps Tool Icons - left and right of hero image */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 p-2 bg-white/10 rounded-full shadow-lg animate-bounce">
                  <Docker className="w-8 h-8 text-[#00b4d8]" />
                </div>
                <div className="absolute top-1/4 -left-10 p-2 bg-white/10 rounded-full shadow-lg animate-float-slow">
                  <Server className="w-8 h-8 text-[#ff3c77]" />
                </div>
                <div className="absolute bottom-1/4 -right-10 p-2 bg-white/10 rounded-full shadow-lg animate-spin-slow">
                  <Cloud className="w-8 h-8 text-[#32cd32]" />
                </div>
                <div className="absolute bottom-0 left-1/4 p-2 bg-white/10 rounded-full shadow-lg animate-pulse">
                  <GitBranch className="w-8 h-8 text-[#6366f1]" />
                </div>
                <div className="absolute top-0 right-1/4 p-2 bg-white/10 rounded-full shadow-lg animate-bounce delay-500">
                  <Database className="w-8 h-8 text-[#f472b6]" />
                </div>
                <div className="absolute top-1/2 -right-12 p-2 bg-white/10 rounded-full shadow-lg animate-float-slow delay-700">
                  <Shield className="w-8 h-8 text-[#f87171]" />
                </div>
                <div className="absolute bottom-1/2 -left-12 p-2 bg-white/10 rounded-full shadow-lg animate-spin-slow delay-300">
                  <Cpu className="w-8 h-8 text-[#34d399]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f]">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-center text-xl text-[#00b4d8] mb-16">
              🚀 Fresher DevOps Engineer | Automation, Cloud & Infrastructure
            </p>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-slate-300 leading-relaxed">
                  I'm an aspiring DevOps Engineer with a solid foundation in tools like Docker, Kubernetes, Git, and CI/CD pipelines. 
                  I enjoy solving real-world challenges through automation, containerization, and building scalable infrastructure.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  I've actively participated in hands-on bootcamps and real-world projects, where I contributed to production-ready 
                  deployments and collaborated with other passionate learners.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  💡 I'm eager to join forward-thinking teams where I can grow, contribute to impactful projects, and help design 
                  automated, reliable DevOps pipelines that drive innovation.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-800/60 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-cyan-400/10 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] rounded-full">
                      <Wrench className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Hands-on Training</h3>
                      <p className="text-slate-400">Practical experience</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/60 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-cyan-400/10 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-[#ff3c77] to-[#32cd32] rounded-full">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Production Deployments</h3>
                      <p className="text-slate-400">Real-world projects</p>
                    </div>
                  </div>
                </div>
                {/* DevOps Tools Icons */}
                <div className="mt-10 flex flex-wrap gap-6 justify-end">
                  <div className="flex flex-wrap gap-4 items-center">
                    <Docker className="w-10 h-10 text-[#00b4d8] animate-bounce hover:scale-110 transition-transform duration-300" />
                    <Server className="w-10 h-10 text-[#ff3c77] animate-spin hover:scale-110 transition-transform duration-300" />
                    <Cloud className="w-10 h-10 text-[#32cd32] animate-pulse hover:scale-110 transition-transform duration-300" />
                    <GitBranch className="w-10 h-10 text-[#6366f1] animate-bounce hover:scale-110 transition-transform duration-300" />
                    <Database className="w-10 h-10 text-[#f472b6] animate-spin hover:scale-110 transition-transform duration-300" />
                    <Shield className="w-10 h-10 text-[#f87171] animate-pulse hover:scale-110 transition-transform duration-300" />
                    <Cpu className="w-10 h-10 text-[#34d399] animate-bounce hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f] relative">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
            <p className="text-center text-xl text-slate-300 mb-16">
              Modern tools crafted for efficient development and scalable deployment
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="group bg-slate-800/60 backdrop-blur-md border border-pink-500/30 rounded-2xl p-6 hover:shadow-lg hover:shadow-pink-500/10 hover:border-cyan-400 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="text-center space-y-4">
                    <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                      <div 
                        className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                        style={{ backgroundColor: skill.color }}
                      ></div>
                      <skill.icon 
                        className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300" 
                        style={{ color: skill.color }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#00b4d8] transition-colors duration-300">
                        {skill.name}
                      </h3>
                      <div className="mt-2 bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${skill.level}%`,
                            backgroundColor: skill.color
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">{skill.level}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f]">
        <div className="container mx-auto">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <p className="text-center text-xl text-slate-300 mb-16">
              Empowering teams with DevOps-driven, modern development strategies
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="group bg-slate-800/60 backdrop-blur-md border border-lime-400/30 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-400/20 hover:border-cyan-400 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-semibold text-white group-hover:text-[#00b4d8] transition-colors duration-300">
                        {project.title}
                      </h3>
                      <div className="flex space-x-2">
                        <a 
                          href={project.github}
                          className="p-2 bg-slate-700 rounded-lg hover:bg-[#00b4d8] transition-colors duration-300"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                        {project.blog && (
                          <a 
                            href={project.blog}
                            className="p-2 bg-slate-700 rounded-lg hover:bg-[#ff3c77] transition-colors duration-300"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-[#00b4d8]">Key Features:</h4>
                      <ul className="space-y-1">
                        {project.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-2 text-sm text-slate-400">
                            <CheckCircle className="w-3 h-3 text-[#32cd32] flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-medium hover:bg-[#00b4d8] hover:text-white transition-colors duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-6 bg-slate-800/30 relative">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] bg-clip-text text-transparent">
              Education & Journey
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={collageImg} 
                    alt="AKS University" 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 hover:shadow-lg hover:shadow-[#00b4d8]/10 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] rounded-full">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">AKS University, Satna</h3>
                      <p className="text-[#00b4d8]">B.Tech - AI & Data Science</p>
                    </div>
                  </div>
                  <p className="text-slate-400 mb-4">Oct 2021 – Jun 2025</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#00b4d8]">Key Projects:</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className="p-2 bg-[#ff3c77] rounded-lg">
                          <Database className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-slate-300 text-sm">Car Price Prediction Model</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className="p-2 bg-[#00b4d8] rounded-lg">
                          <Docker className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-slate-300 text-sm">Docker Management Tool</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                        <div className="p-2 bg-[#32cd32] rounded-lg">
                          <Code className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-slate-300 text-sm">Web Scraping Application</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a192f]">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] bg-clip-text text-transparent">
              Get In Touch
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Let's build something amazing together</h3>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    I'm always excited to discuss new opportunities, collaborate on interesting projects, 
                    or just chat about the latest in DevOps and cloud technologies.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl hover:border-[#00b4d8] transition-colors duration-300">
                    <div className="p-3 bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] rounded-full">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-white font-medium">priyamsanodiya340@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl hover:border-[#00b4d8] transition-colors duration-300">
                    <div className="p-3 bg-gradient-to-r from-[#32cd32] to-[#00b4d8] rounded-full">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Phone</p>
                      <p className="text-white font-medium">+91 9301423057</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl hover:border-[#00b4d8] transition-colors duration-300">
                    <div className="p-3 bg-gradient-to-r from-[#ff3c77] to-[#32cd32] rounded-full">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Location</p>
                      <p className="text-white font-medium">Seoni, MP, India</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl">
                    <div className="p-3 bg-gradient-to-r from-[#32cd32] to-[#00b4d8] rounded-full">
                      <div className="w-5 h-5 bg-[#32cd32] rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Status</p>
                      <p className="text-[#32cd32] font-medium">Open to Work</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/60 backdrop-blur-md border border-cyan-400/30 rounded-2xl shadow-xl p-8 relative overflow-hidden">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4">Send Me a Message</h3>
                  <p className="text-slate-300 text-lg">
                    Whether you have a job opportunity, project idea, or just want to connect, I'd love to hear from you!
                  </p>
                </div>
                
                {/* Status Message */}
                {contactStatus.type && (
                  <div className={`mb-6 p-4 rounded-xl ${
                    contactStatus.type === 'success' 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                      : 'bg-red-500/20 border border-red-500/30 text-red-300'
                  }`}>
                    {contactStatus.message}
                  </div>
                )}
                
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-200 font-medium mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactInputChange}
                        placeholder="John Doe"
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 transition-all duration-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-200 font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactInputChange}
                        placeholder="john@company.com"
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-slate-200 font-medium mb-2">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={contactForm.company}
                        onChange={handleContactInputChange}
                        placeholder="Your Company"
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-200 font-medium mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={handleContactInputChange}
                        placeholder="Job Opportunity / Project Discussion"
                        className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-slate-200 font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactInputChange}
                      rows={5}
                      placeholder="Tell me about the opportunity, project requirements, or what you'd like to discuss..."
                      className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/20 transition-all duration-300 resize-none"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full bg-gradient-to-r from-[#00b4d8] to-[#ff3c77] text-white py-4 px-8 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00b4d8]/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    aria-label="Send Message"
                  >
                    {contactLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-cyan-400/20 bg-gradient-to-r from-[#0f172a] to-[#1e293b] backdrop-blur-md">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start space-x-6 text-sm text-slate-400">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="hover:text-[#00b4d8] transition-colors duration-300"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                Made with ❤️ by Priyam Sanodiya © 2025. All rights reserved.
              </p>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-[#00b4d8] hover:text-[#ff3c77] transition-colors duration-300 text-sm font-medium mt-1"
              >
                Available to work
              </button>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}

export default App;
