"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  Book,
  CalendarCheck,
  Check,
  Clock3,
  Gem,
  HeartHandshake,
  Home as HomeIcon,
  Instagram,
  Mail,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  WandSparkles,
  X
} from "lucide-react";

const navItems = ["Home", "About", "Services", "Gallery", "Packages", "Promotions", "Blog", "Contact"];

const services = [
  { title: "Manicure", copy: "Classic to luxury manicure treatments", icon: HeartHandshake },
  { title: "Pedicure", copy: "Relaxing pedicures for happy feet", icon: Sparkles },
  { title: "Gel Polish", copy: "Long-lasting shine and flawless finish", icon: WandSparkles },
  { title: "Nail Art", copy: "Custom nail art that expresses you", icon: Gem },
  { title: "Spa Treatment", copy: "Rejuvenating spa for hands and feet", icon: Award },
  { title: "Extensions", copy: "Strong, beautiful nail extensions", icon: Scissors }
];

const gallery = [
  "/nail-art-1.png",
  "/nail-art-2.png",
  "/nail-art-3.png",
  "/hero-manicure.png",
  "/nail-salon-interior.png",
  "/nail-art-1.png"
];

const packages = [
  {
    name: "Essential Care",
    price: "$45",
    copy: "Perfect for regular maintenance and everyday beauty.",
    items: ["Classic Manicure", "Classic Pedicure", "Nail Shape & Cuticle Care", "Regular Polish"]
  },
  {
    name: "Signature Luxe",
    price: "$75",
    copy: "Our most loved package for the ultimate pampering.",
    items: ["Luxury Manicure", "Luxury Pedicure", "Gel Polish Hands", "Paraffin Treatment"],
    popular: true
  },
  {
    name: "Premium Glam",
    price: "$110",
    copy: "Indulge in luxury with extended care and stunning results.",
    items: ["Luxury Manicure", "Luxury Pedicure", "Gel Polish Hands & Feet", "Nail Art", "Paraffin Treatment"]
  }
];

const experts = [
  { name: "Emily Nguyen", role: "Nail Artist", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85" },
  { name: "Sophia Tran", role: "Senior Nail Technician", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85" },
  { name: "Lily Pham", role: "Nail Specialist", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=85" }
];

const features = [
  { title: "Premium Quality", copy: "Top-tier products for beautiful, long-lasting nails.", icon: Award },
  { title: "Sanitized & Safe", copy: "Your safety is our priority with strict hygiene.", icon: ShieldCheck },
  { title: "Luxury Experience", copy: "Relax, unwind and enjoy a premium experience.", icon: Sparkles }
];

/* ── Scroll-reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useReveal();
  return (
    <section
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

function RevealDiv({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          io.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Logo() {
  return (
    <a className="logo" href="#home" aria-label="Aera Nail Lounge home">
      <Image src="/aera-mark.svg" alt="" width={58} height={58} priority />
      <span>Aera Nail lounge</span>
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <main id="home">
      {/* ── Header ── */}
      <header className="site-header">
        <button
          className="menu-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Logo />
        <nav aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item} className={item === "Home" ? "active" : ""} href={`#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>
        <a className="book-top" href="#contact">
          <CalendarCheck size={17} />
          Book Now
          <ArrowRight size={15} />
        </a>
      </header>

      {/* ── Mobile Drawer Menu (Left) ── */}
      <div className={`drawer-overlay ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
      <aside className={`drawer-menu ${menuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <Logo />
          <button className="drawer-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <nav className="drawer-nav">
          {navItems.map((item, i) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{ animationDelay: `${80 + i * 60}ms` }}
              className={menuOpen ? "slide-in" : ""}
            >
              {item}
            </a>
          ))}
        </nav>
        <a className="primary-btn drawer-book" href="#contact" onClick={() => setMenuOpen(false)}>
          <CalendarCheck size={17} />
          Book Now
          <ArrowRight size={15} />
        </a>
      </aside>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-copy animate-hero">
          <span className="eyebrow">Elevate Your Beauty</span>
          <h1>
            Luxury Nail Care,
            <em> Designed for You</em>
          </h1>
          <p>Experience premium nail care in a serene, elegant space where beauty meets relaxation.</p>
          <div className="hero-actions">
            <a className="primary-btn pulse-btn" href="#contact">
              Book Your Appointment
              <ArrowRight size={16} />
            </a>
            <a className="secondary-btn" href="#services">
              Explore Services
            </a>
          </div>
        </div>
        <div className="hero-image animate-hero-img">
          <Image
            src="/hero-manicure.png"
            alt="Elegant pink and gold manicure"
            fill
            sizes="(max-width: 900px) 100vw, 48vw"
            priority
          />
        </div>
        <span className="spark one float-sparkle">✦</span>
        <span className="spark two float-sparkle" style={{ animationDelay: "1.5s" }}>✦</span>
      </section>

      {/* ── Services ── */}
      <Reveal className="services" key="services">
        <div id="services">
          <h2>Our Signature Services</h2>
          <div className="service-grid">
            {services.map(({ title, copy, icon: Icon }, i) => (
              <RevealDiv className="service-card" key={title} delay={i * 100}>
                <Icon size={38} strokeWidth={1.3} />
                <h3>{title}</h3>
                <p>{copy}</p>
                <a href="#contact" aria-label={`Book ${title}`}>
                  <ArrowRight size={15} />
                </a>
              </RevealDiv>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── About ── */}
      <Reveal className="about" key="about">
        <div id="about" className="about-inner">
          <div className="about-media">
            <div className="salon-shot">
              <Image
                src="/nail-salon-interior.png"
                alt="Warm luxury nail lounge interior"
                fill
                sizes="(max-width: 900px) 100vw, 30vw"
              />
            </div>
            <div className="nail-shot">
              <Image
                src="/nail-art-2.png"
                alt="Glossy pink manicure with gold detail"
                fill
                sizes="(max-width: 900px) 100vw, 30vw"
              />
            </div>
            <div className="stat-card bounce-in">
              <small>Over</small>
              <strong>5,000+</strong>
              <span>Happy Clients</span>
            </div>
          </div>
          <div className="about-copy">
            <span className="section-kicker">About Aera Nail Lounge</span>
            <h2>Where Luxury Meets Care & Perfection</h2>
            <p>
              At Aera Nail Lounge, we believe self-care is essential. Our expert nail technicians, premium products,
              and hygienic practices ensure an exceptional experience every time you visit.
            </p>
            <div className="about-points">
              {[
                ["Premium Products", "We use high-quality, safe and cruelty-free products."],
                ["Hygiene First", "Strict sterilization and cleanliness you can trust."],
                ["Expert Technicians", "Skilled professionals passionate about nails."],
                ["Relaxing Ambience", "A calm, elegant space designed for you."]
              ].map(([title, copy]) => (
                <div key={title}>
                  <Sparkles size={20} />
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                </div>
              ))}
            </div>
            <a className="secondary-btn about-btn" href="#contact">
              Learn More About Us <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </Reveal>

      {/* ── Gallery ── */}
      <Reveal className="gallery" key="gallery">
        <div id="gallery">
          <div className="section-heading">
            <h2>Featured Nail Designs <span>✦</span></h2>
            <div className="filters" aria-label="Gallery filters">
              {["All", "Minimal", "Elegant", "Glitter", "Art"].map((filter) => (
                <button className={filter === "All" ? "selected" : ""} key={filter}>
                  {filter}
                </button>
              ))}
            </div>
            <a href="#contact">View All Gallery <ArrowRight size={14} /></a>
          </div>
          <div className="gallery-grid">
            {gallery.map((src, index) => (
              <RevealDiv className="gallery-item" key={`gallery-${index}`} delay={index * 80}>
                <Image src={src} alt={`Aera nail design ${index + 1}`} fill sizes="(max-width: 700px) 45vw, 15vw" />
              </RevealDiv>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Packages ── */}
      <Reveal className="packages" key="packages">
        <div id="packages" className="packages-list">
          <h2>Popular Packages <span>✦</span></h2>
          <div className="package-grid">
            {packages.map((pkg, i) => (
              <RevealDiv className={`package-card ${pkg.popular ? "popular" : ""}`} key={pkg.name} delay={i * 120}>
                {pkg.popular && <span className="badge">Most Popular</span>}
                <div className="price-row">
                  <h3>{pkg.name}</h3>
                  <strong>{pkg.price}</strong>
                </div>
                <p>{pkg.copy}</p>
                <ul>
                  {pkg.items.map((item) => (
                    <li key={item}>
                      <Check size={14} /> {item}
                    </li>
                  ))}
                </ul>
                <a className="primary-btn compact" href="#contact">Book Now</a>
              </RevealDiv>
            ))}
          </div>
        </div>
        <aside className="offer" id="promotions">
          <div>
            <span className="section-kicker">Special Offer ✦</span>
            <h2>10% OFF</h2>
            <p>On Your First Visit</p>
            <small>Treat yourself to luxury. Use code <b>WELCOME10</b></small>
            <a className="primary-btn compact" href="#contact">Book Now <ArrowRight size={14} /></a>
          </div>
          <div className="polish-bottle-img">
            <Image
              src="/nail-polish-bottle.png"
              alt="Luxury nail polish bottle"
              fill
              sizes="200px"
            />
          </div>
        </aside>
      </Reveal>

      {/* ── Social Proof ── */}
      <Reveal className="social-proof" key="social-proof">
        <div className="experts">
          <div className="mini-heading">
            <h2>Meet Our Experts <span>✦</span></h2>
            <a href="#contact">View All Team <ArrowRight size={14} /></a>
          </div>
          <div className="expert-grid">
            {experts.map((expert, i) => (
              <RevealDiv className="expert-card" key={expert.name} delay={i * 100}>
                <div>
                  <Image src={expert.img} alt={expert.name} fill sizes="160px" />
                </div>
                <h3>{expert.name}</h3>
                <p>{expert.role}</p>
                <span><Instagram size={14} /></span>
              </RevealDiv>
            ))}
          </div>
        </div>
        <div className="testimonial">
          <h2>What Our Clients Say <span>✦</span></h2>
          <div className="testimonial-card">
            <div className="quote">
              <div className="stars" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <p>The best nail salon experience! The staff is so friendly and talented. My nails have never looked better!</p>
              <strong>Jessica M.</strong>
            </div>
            <div className="quote-image">
              <Image
                src="/nail-art-3.png"
                alt="Client manicure"
                fill
                sizes="(max-width: 900px) 100vw, 24vw"
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Feature Strip ── */}
      <Reveal className="feature-strip" key="feature-strip">
        {features.map(({ title, copy, icon: Icon }) => (
          <div key={title}>
            <Icon size={32} />
            <span>
              <strong>{title}</strong>
              <small>{copy}</small>
            </span>
          </div>
        ))}
      </Reveal>

      {/* ── Contact ── */}
      <Reveal className="contact-band" key="contact">
        <div id="contact">
          <h2>Ready to Treat Yourself?</h2>
          <p>Book your appointment today and let us pamper you with exceptional care.</p>
          <a className="primary-btn pulse-btn" href="tel:+12354567890">Book Your Appointment <ArrowRight size={15} /></a>
        </div>
        <address>
          <span><Phone size={26} /><b>Phone</b> (123) 456-7890</span>
          <span><MapPin size={26} /><b>Location</b> 123 Beauty Blvd, Suite 100<br />Los Angeles, CA 90001</span>
          <span><Clock3 size={26} /><b>Hours</b> Mon - Sun: 10:00 AM - 8:00 PM</span>
        </address>
      </Reveal>

      {/* ── Footer ── */}
      <footer>
        <div className="footer-brand">
          <Logo />
          <p>Luxury nail care in an elegant lounge created for quiet beauty, expert detail and a little everyday glow.</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#packages">Packages</a>
          <a href="#gallery">Gallery</a>
        </div>
        <div>
          <h3>Services</h3>
          <a href="#services">Manicure</a>
          <a href="#services">Pedicure</a>
          <a href="#services">Gel Polish</a>
          <a href="#services">Nail Art</a>
        </div>
        <div>
          <h3>Contact</h3>
          <a href="tel:+12354567890"><Phone size={14} /> (123) 456-7890</a>
          <a href="mailto:info@aeranailounge.com"><Mail size={14} /> info@aeranailounge.com</a>
          <a href="#contact"><MapPin size={14} /> 123 Beauty Blvd</a>
        </div>
      </footer>

      {/* ── PC Right Sidebar (Shake icons) ── */}
      <div className="pc-sidebar">
        <a href="tel:+12354567890" className="sidebar-icon shake-icon" aria-label="Call us" style={{ animationDelay: "0s" }}>
          <Phone size={22} />
        </a>
        <a href="#contact" className="sidebar-icon shake-icon" aria-label="Book appointment" style={{ animationDelay: "0.3s" }}>
          <CalendarCheck size={22} />
        </a>
        <a href="https://wa.me/12354567890" target="_blank" rel="noopener noreferrer" className="sidebar-icon shake-icon whatsapp-icon" aria-label="WhatsApp" style={{ animationDelay: "0.6s" }}>
          <MessageCircle size={22} />
        </a>
        <a href="https://maps.google.com/?q=123+Beauty+Blvd+Los+Angeles" target="_blank" rel="noopener noreferrer" className="sidebar-icon shake-icon" aria-label="Find us on map" style={{ animationDelay: "0.9s" }}>
          <MapPin size={22} />
        </a>
      </div>

      {/* ── Mobile Footer Bar ── */}
      <nav className="mobile-footer-bar" aria-label="Mobile navigation">
        <a href="#home" className="mobile-bar-item">
          <HomeIcon size={22} />
          <span>Home</span>
        </a>
        <a href="#contact" className="mobile-bar-item">
          <Book size={22} />
          <span>Book</span>
        </a>
        <a href="https://wa.me/12354567890" target="_blank" rel="noopener noreferrer" className="mobile-bar-item whatsapp-mobile">
          <MessageCircle size={22} />
          <span>WhatsApp</span>
        </a>
        <a href="https://maps.google.com/?q=123+Beauty+Blvd+Los+Angeles" target="_blank" rel="noopener noreferrer" className="mobile-bar-item">
          <Map size={22} />
          <span>Map</span>
        </a>
      </nav>
    </main>
  );
}
