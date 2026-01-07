import React, { useState, useEffect, useRef, useMemo } from "react"; 
import { 
  Menu, X, ChevronDown, Code, Database, Server, Layout, 
  Mail, Github, Linkedin, Twitter, Globe, MessageSquare, 
  Terminal, Shield, Zap, Smartphone, ExternalLink 
} from "lucide-react"; 
 
// Inline Button component 
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>( 
  ({ className = "", children, ...props }, ref) => { 
    return ( 
      <button 
        ref={ref} 
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 ${className}`} 
        {...props} 
      > 
        {children} 
      </button> 
    ); 
  } 
); 
Button.displayName = "Button"; 
 
// BlurText animation component 
interface BlurTextProps { 
  text: string; 
  delay?: number; 
  animateBy?: "words" | "letters"; 
  direction?: "top" | "bottom"; 
  className?: string; 
  style?: React.CSSProperties; 
} 
 
const BlurText: React.FC<BlurTextProps> = ({ 
  text, 
  delay = 50, 
  animateBy = "words", 
  direction = "top", 
  className = "", 
  style, 
}) => { 
  const [inView, setInView] = useState(false); 
  const ref = useRef<HTMLParagraphElement>(null); 
 
  useEffect(() => { 
    const observer = new IntersectionObserver( 
      ([entry]) => { 
        if (entry.isIntersecting) { 
          setInView(true); 
        } 
      }, 
      { threshold: 0.1 } 
    ); 
 
    if (ref.current) { 
      observer.observe(ref.current); 
    } 
 
    return () => { 
      if (ref.current) { 
        observer.unobserve(ref.current); 
      } 
    }; 
  }, []); 
 
  const segments = useMemo(() => { 
    return animateBy === "words" ? text.split(" ") : text.split(""); 
  }, [text, animateBy]); 
 
  return ( 
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}> 
      {segments.map((segment, i) => ( 
        <span 
          key={i} 
          style={{ 
            display: "inline-block", 
            filter: inView ? "blur(0px)" : "blur(10px)", 
            opacity: inView ? 1 : 0, 
            transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`, 
            transition: `all 0.5s ease-out ${i * delay}ms`, 
          }} 
        > 
          {segment} 
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""} 
        </span> 
      ))} 
    </p> 
  ); 
}; 

const SectionTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-3xl md:text-5xl font-bold mb-12 text-center tracking-tight ${className}`}>
    {children}
  </h2>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    {children}
  </div>
);
 
export default function App() { 
  const [isDark, setIsDark] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const menuRef = useRef<HTMLDivElement>(null); 
  const buttonRef = useRef<HTMLButtonElement>(null); 
 
  useEffect(() => { 
    document.documentElement.classList.add("dark"); 
  }, []); 
 
  useEffect(() => { 
    const handleClickOutside = (event: MouseEvent) => { 
      if ( 
        isMenuOpen && 
        menuRef.current && 
        buttonRef.current && 
        !menuRef.current.contains(event.target as Node) && 
        !buttonRef.current.contains(event.target as Node) 
      ) { 
        setIsMenuOpen(false); 
      } 
    }; 
 
    document.addEventListener("mousedown", handleClickOutside); 
    return () => document.removeEventListener("mousedown", handleClickOutside); 
  }, [isMenuOpen]); 
 
  const toggleTheme = () => { 
    const newTheme = !isDark; 
    setIsDark(newTheme); 
    if (newTheme) { 
      document.documentElement.classList.add("dark"); 
    } else { 
      document.documentElement.classList.remove("dark"); 
    } 
  }; 
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    setErrorMessage('');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      service: formData.get('service') as string,
      message: formData.get('message') as string
    };
    
    try {
      const response = await fetch('http://localhost:5000/api/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setFormStatus('success');
        e.currentTarget.reset();
        // Reset form status after 5 seconds
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setErrorMessage(result.error || 'Failed to send message');
      }
    } catch (error) {
      setFormStatus('error');
      setErrorMessage('Network error. Please check if the backend server is running.');
    }
  };

  const menuItems = [ 
    { label: "HOME", href: "#home", highlight: true }, 
    { label: "ABOUT", href: "#about" }, 
    { label: "PORTFOLIO", href: "#portfolio" }, 
    { label: "SERVICES", href: "#services" }, 
    { label: "TESTIMONIALS", href: "#testimonials" }, 
    { label: "CONTACT", href: "#contact" }, 
  ]; 
 
  return ( 
    <div  
      className="min-h-screen text-foreground transition-colors font-sans selection:bg-[#C3E41D] selection:text-black" 
      style={{ 
        backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)", 
        color: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)", 
      }} 
    > 
      {/* Header */} 
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 backdrop-blur-sm bg-opacity-80"> 
        <nav className="flex items-center justify-between max-w-screen-2xl mx-auto"> 
          {/* Menu Button */} 
          <div className="relative"> 
            <button 
              ref={buttonRef} 
              type="button" 
              className="p-2 transition-colors duration-300 z-50 text-neutral-500 hover:text-black dark:hover:text-white" 
              aria-label={isMenuOpen ? "Close menu" : "Open menu"} 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
            > 
              {isMenuOpen ? ( 
                <X className="w-8 h-8 transition-colors duration-300" strokeWidth={2} /> 
              ) : ( 
                <Menu className="w-8 h-8 transition-colors duration-300" strokeWidth={2} /> 
              )} 
            </button> 
 
            {isMenuOpen && ( 
              <div 
                ref={menuRef} 
                className="absolute top-full left-0 w-[200px] md:w-[240px] border-none shadow-2xl mt-2 ml-4 p-4 rounded-lg z-[100]" 
                style={{ 
                  backgroundColor: isDark ? "hsl(0 0% 0%)" : "hsl(0 0% 98%)", 
                }} 
              > 
                {menuItems.map((item) => ( 
                  <a 
                    key={item.label} 
                    href={item.href} 
                    className="block text-lg md:text-xl font-bold tracking-tight py-1.5 px-2 cursor-pointer transition-colors duration-300" 
                    style={{ 
                      color: item.highlight ? "#C3E41D" : isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)", 
                    }} 
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.color = "#C3E41D"; 
                    }} 
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.color = item.highlight ? "#C3E41D" : (isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)"); 
                    }} 
                    onClick={() => setIsMenuOpen(false)} 
                  > 
                    {item.label} 
                  </a> 
                ))} 
              </div> 
            )} 
          </div> 
 
          {/* Signature */} 
          <a href="#home" className="text-4xl" style={{ color: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)", fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive" }}> 
            A 
          </a> 
 
          {/* Theme Toggle */} 
          <div className="flex items-center gap-3">
            {/* Admin Login Button */}
            <a 
              href="http://localhost:5000/admin/login" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-500 hover:text-[#C3E41D] transition-colors duration-300"
              title="Admin Panel"
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </a>
            
            <button 
              type="button" 
              onClick={toggleTheme} 
              className="relative w-16 h-8 rounded-full hover:opacity-80 transition-opacity" 
              style={{ backgroundColor: isDark ? "hsl(0 0% 15%)" : "hsl(0 0% 90%)" }} 
              aria-label="Toggle theme" 
            > 
              <div 
                className="absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-300" 
                style={{ 
                  backgroundColor: isDark ? "hsl(0 0% 100%)" : "hsl(0 0% 10%)", 
                  transform: isDark ? "translateX(2rem)" : "translateX(0)", 
                }} 
              /> 
            </button>
          </div> 
        </nav> 
      </header> 
 
      {/* Main Content */}
      <main className="flex flex-col"> 
        {/* Hero Section */} 
        <section id="home" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"> 
          {/* Centered Main Name */} 
          <div className="relative text-center z-10"> 
            <div> 
              <BlurText 
                text="ARSHAD" 
                delay={100} 
                animateBy="letters" 
                direction="top" 
                className="font-bold text-[18vw] md:text-[200px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap" 
                style={{ color: "#C3E41D", fontFamily: "'Fira Code', monospace" }} 
              /> 
            </div> 
            <div> 
              <BlurText 
                text="ANWAR" 
                delay={100} 
                animateBy="letters" 
                direction="top" 
                className="font-bold text-[18vw] md:text-[200px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap" 
                style={{ color: "#C3E41D", fontFamily: "'Fira Code', monospace" }} 
              /> 
            </div> 
 
            {/* Profile Picture */} 
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"> 
              <div className="w-[100px] h-[160px] md:w-[130px] md:h-[220px] rounded-full overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-110 cursor-pointer border-4 border-neutral-100 dark:border-neutral-900"> 
                <img 
                  src="/profile-red-bg.jpeg" 
                  alt="Arshad Anwar - Founder of Legal Success India" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-[#C3E41D] to-[#a3c41a] flex items-center justify-center text-black font-bold text-2xl md:text-3xl" style={{display: 'none'}}>
                  AA
                </div>
              </div> 
            </div> 
          </div> 
 
          {/* Tagline */} 
          <div className="absolute bottom-24 md:bottom-32 left-0 right-0 px-6"> 
            <div className="flex justify-center"> 
              <BlurText 
                text="Founder & Full-Stack Developer at Legal Success India" 
                delay={150} 
                animateBy="words" 
                direction="top" 
                className="text-lg md:text-2xl text-center font-light text-neutral-600 dark:text-neutral-400" 
                style={{ fontFamily: "'Antic', sans-serif" }} 
              /> 
            </div> 
            {/* Tech Icons */}
            <div className="flex justify-center gap-6 mt-8 flex-wrap">
               <Code className="w-6 h-6 text-neutral-400" />
               <Layout className="w-6 h-6 text-neutral-400" />
               <Database className="w-6 h-6 text-neutral-400" />
               <Server className="w-6 h-6 text-neutral-400" />
               <Globe className="w-6 h-6 text-neutral-400" />
            </div>
          </div> 
 
          {/* Scroll Indicator */} 
          <a href="#about" className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"> 
            <ChevronDown className="w-8 h-8 text-neutral-500 hover:text-black dark:hover:text-white transition-colors duration-300" /> 
          </a> 
        </section> 

        {/* Technologies Section */}
        <section id="technologies" className="py-20 bg-neutral-100 dark:bg-neutral-900/50">
          <div className="max-w-7xl mx-auto px-6">
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {[
                  { icon: <Layout />, name: "React" },
                  { icon: <Zap />, name: "Next.js" },
                  { icon: <Code />, name: "JavaScript" },
                  { icon: <Terminal />, name: "TypeScript" },
                  { icon: <Globe />, name: "Python" },
                  { icon: <Server />, name: "Node.js" },
                ].map((tech, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 p-4 hover:scale-105 transition-transform duration-300">
                    <div className="p-4 rounded-full bg-white dark:bg-neutral-800 shadow-md text-[#C3E41D]">
                      {React.cloneElement(tech.icon as React.ReactElement, { size: 32 })}
                    </div>
                    <span className="font-semibold">{tech.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 md:py-32 max-w-7xl mx-auto px-6">
          <SectionTitle>ABOUT ME</SectionTitle>
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="relative">
                <div className="absolute inset-0 bg-[#C3E41D] rounded-2xl rotate-3 opacity-20"></div>
                <div className="relative rounded-2xl w-full max-w-md mx-auto shadow-2xl overflow-hidden">
                  <img 
                    src="/profile-striped-shirt.jpg.png" 
                    alt="Arshad Anwar" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-64 bg-gradient-to-br from-[#C3E41D] to-[#a3c41a] flex items-center justify-center text-black font-bold text-4xl" style={{display: 'none'}}>
                    ARSHAD ANWAR
                  </div>
                </div>
             </div>
             <div className="space-y-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                <p>
                  <strong className="text-black dark:text-white">Hi, I’m Arshad Anwar.</strong> Founder of Legal Success India and a passionate full-stack developer specializing in legal-tech solutions.
                </p>
                <p>
                  With a unique blend of legal expertise and advanced web development skills, I build products that streamline complex legal processes for businesses and individuals. I believe in creating scalable, high-performance websites that not only look good but solve real-world problems.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div>
                    <h4 className="font-bold text-black dark:text-white mb-2">Frontend</h4>
                    <p className="text-sm">React, Next.js, TypeScript, Tailwind CSS</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-black dark:text-white mb-2">Backend</h4>
                    <p className="text-sm">Python, Node.js, PostgreSQL, MongoDB</p>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-24 bg-neutral-100 dark:bg-neutral-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle>SELECTED WORKS</SectionTitle>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Project 1 */}
               <a href="https://legalsuccessindia.com/" target="_blank" rel="noopener noreferrer">
                 <Card className="group cursor-pointer hover:scale-105 transition-transform duration-300">
                    <div className="h-48 mb-6 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800 relative">
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="text-white" />
                       </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Legal Success India</h3>
                    <p className="text-neutral-500 text-sm mb-4">A comprehensive legal-tech platform simplifying legal aid access and connecting clients with legal professionals.</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-[#C3E41D]/20 text-[#C3E41D]">Next.js</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#C3E41D]/20 text-[#C3E41D]">React</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#C3E41D]/20 text-[#C3E41D]">Python</span>
                    </div>
                 </Card>
               </a>
               {/* Project 2 */}
               <a href="https://khurak-new-application.vercel.app/" target="_blank" rel="noopener noreferrer">
                 <Card className="group cursor-pointer hover:scale-105 transition-transform duration-300">
                    <div className="h-48 mb-6 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800 relative">
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="text-white" />
                       </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Khurak Application</h3>
                    <p className="text-neutral-500 text-sm mb-4">A modern food delivery and restaurant management application with real-time features.</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-[#C3E41D]/20 text-[#C3E41D]">React</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#C3E41D]/20 text-[#C3E41D]">Next.js</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#C3E41D]/20 text-[#C3E41D]">Vercel</span>
                    </div>
                 </Card>
               </a>
               {/* Project 3 */}
               <a href="https://legal-success-indiaa-new-work-azf3.vercel.app/" target="_blank" rel="noopener noreferrer">
                 <Card className="group cursor-pointer hover:scale-105 transition-transform duration-300">
                    <div className="h-48 mb-6 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800 relative">
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="text-white" />
                       </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Legal Success India v2</h3>
                    <p className="text-neutral-500 text-sm mb-4">Enhanced version of the legal platform with improved UI/UX and additional features for legal professionals.</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-[#C3E41D]/20 text-[#C3E41D]">Next.js</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#C3E41D]/20 text-[#C3E41D]">TypeScript</span>
                      <span className="px-2 py-1 text-xs rounded-full bg-[#C3E41D]/20 text-[#C3E41D]">Tailwind</span>
                    </div>
                 </Card>
               </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 max-w-7xl mx-auto px-6">
          <SectionTitle>SERVICES</SectionTitle>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:-translate-y-2">
               <Layout className="w-12 h-12 mx-auto mb-6 text-[#C3E41D]" />
               <h3 className="text-xl font-bold mb-4">Web Development</h3>
               <p className="text-neutral-500 text-sm">Custom, high-performance websites built with modern technologies like React and Next.js.</p>
            </Card>
            <Card className="text-center hover:-translate-y-2">
               <Shield className="w-12 h-12 mx-auto mb-6 text-[#C3E41D]" />
               <h3 className="text-xl font-bold mb-4">Legal-Tech Solutions</h3>
               <p className="text-neutral-500 text-sm">Specialized software for legal compliance, data protection, and automation.</p>
            </Card>
            <Card className="text-center hover:-translate-y-2">
               <Smartphone className="w-12 h-12 mx-auto mb-6 text-[#C3E41D]" />
               <h3 className="text-xl font-bold mb-4">Maintenance</h3>
               <p className="text-neutral-500 text-sm">Ongoing support, security updates, and performance optimization.</p>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-neutral-100 dark:bg-neutral-900/30">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <SectionTitle>CLIENT FEEDBACK</SectionTitle>
            <div className="relative p-8 md:p-12 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800">
               <MessageSquare className="w-10 h-10 text-[#C3E41D] mx-auto mb-6 opacity-50" />
               <p className="text-xl md:text-2xl font-light italic mb-8">
                 "Arshad Anwar's expertise in both legal processes and modern web development is exceptional. The legal-tech platform he developed for our firm has streamlined our case management and improved client satisfaction significantly. His attention to detail and understanding of compliance requirements is outstanding."
               </p>
               <div className="font-bold">Managing Partner</div>
               <div className="text-sm text-neutral-500">Delhi High Court Bar Association</div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 max-w-3xl mx-auto px-6">
          <SectionTitle>GET IN TOUCH</SectionTitle>
          <div className="grid gap-8">
             <div className="text-center space-y-4">
               <p className="text-lg text-neutral-600 dark:text-neutral-400">
                 Have a project in mind? Let's build something great together.
               </p>
               <div className="flex justify-center gap-6">
                 <a href="#" className="hover:text-[#C3E41D] transition-colors"><Linkedin className="w-6 h-6" /></a>
                 <a href="#" className="hover:text-[#C3E41D] transition-colors"><Github className="w-6 h-6" /></a>
                 <a href="#" className="hover:text-[#C3E41D] transition-colors"><Twitter className="w-6 h-6" /></a>
                 <a href="mailto:arshad@legalsuccessindia.com" className="hover:text-[#C3E41D] transition-colors"><Mail className="w-6 h-6" /></a>
               </div>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-6 mt-8">
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Name</label>
                   <input 
                     type="text" 
                     name="name"
                     required
                     className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-[#C3E41D] focus:ring-1 focus:ring-[#C3E41D] outline-none transition-all" 
                     placeholder="John Doe" 
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Email</label>
                   <input 
                     type="email" 
                     name="email"
                     required
                     className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-[#C3E41D] focus:ring-1 focus:ring-[#C3E41D] outline-none transition-all" 
                     placeholder="john@example.com" 
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Service</label>
                 <select 
                   name="service"
                   required
                   className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-[#C3E41D] focus:ring-1 focus:ring-[#C3E41D] outline-none transition-all text-neutral-500"
                 >
                    <option value="">Select a service</option>
                    <option value="Custom Website Development">Custom Website Development</option>
                    <option value="Legal-Tech Solutions">Legal-Tech Solutions</option>
                    <option value="Maintenance & Updates">Maintenance & Updates</option>
                    <option value="Other">Other</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">Message</label>
                 <textarea 
                   rows={4} 
                   name="message"
                   required
                   minLength={10}
                   className="w-full px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-transparent focus:border-[#C3E41D] focus:ring-1 focus:ring-[#C3E41D] outline-none transition-all" 
                   placeholder="Tell me about your project..."
                 ></textarea>
               </div>
               
               {/* Status Messages */}
               {formStatus === 'success' && (
                 <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                   <p className="text-green-300">✅ Message sent successfully! We'll get back to you soon.</p>
                 </div>
               )}
               
               {formStatus === 'error' && (
                 <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                   <p className="text-red-300">❌ {errorMessage}</p>
                 </div>
               )}
               
               <Button 
                 type="submit" 
                 disabled={formStatus === 'loading'}
                 className="w-full py-4 text-lg bg-[#C3E41D] text-black hover:bg-[#b2d11b] disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {formStatus === 'loading' ? (
                   <>
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     Sending...
                   </>
                 ) : (
                   'Send Message'
                 )}
               </Button>
             </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-neutral-500 border-t border-neutral-200 dark:border-neutral-800">
           <p>&copy; {new Date().getFullYear()} Arshad Anwar. All rights reserved.</p>
        </footer>
      </main> 
    </div> 
  ); 
}
