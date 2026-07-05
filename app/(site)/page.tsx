"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  Check,
  Clock3,
  Gem,
  HeartHandshake,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  WandSparkles
} from "lucide-react";
import { business, gallery as galleryItems, packages as packageItems, services as serviceItems, technicians } from "@/lib/data";

const serviceIconMap = [HeartHandshake, Sparkles, WandSparkles, Gem, Award, Scissors];
const services = serviceItems.slice(0, 6).map((service, index) => ({
  title: service.name.replace("Classic ", "").replace("Luxury ", ""),
  copy: service.description,
  href: `/services/${service.slug}`,
  icon: serviceIconMap[index] ?? Sparkles
}));

const gallery = galleryItems.slice(0, 6).map((item) => item.image);
const packages = packageItems.map((pkg) => ({
  name: pkg.name,
  price: `$${pkg.price}`,
  copy: pkg.description,
  items: pkg.serviceIds.map((id) => serviceItems.find((service) => service.id === id)?.name ?? id),
  popular: pkg.featured
}));

const experts = technicians.slice(0, 3).map((tech) => ({ name: tech.name, role: tech.role, img: tech.avatar }));

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

export default function Home() {
  return (
    <main id="home">
      {/* ── Header ── */}


      {/* ── Mobile Drawer Menu (Left) ── */}


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
            {services.map(({ title, copy, href, icon: Icon }, i) => (
              <RevealDiv className="service-card" key={title} delay={i * 100}>
                <Icon size={38} strokeWidth={1.3} />
                <h3>{title}</h3>
                <p>{copy}</p>
                <a href={href} aria-label={`View ${title}`}>
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
          <a className="primary-btn pulse-btn" href="/booking">Book Your Appointment <ArrowRight size={15} /></a>
        </div>
        <address>
          <span><Phone size={26} /><b>Phone</b> {business.phone}</span>
          <span><MapPin size={26} /><b>Location</b> {business.address}</span>
          <span><Clock3 size={26} /><b>Hours</b> {business.hours}</span>
        </address>
      </Reveal>

      {/* ── Footer ── */}


      {/* ── PC Right Sidebar (Shake icons) ── */}
      <div className="pc-sidebar">
        <a href={`tel:+${business.rawPhone}`} className="sidebar-icon shake-icon" aria-label="Call us" style={{ animationDelay: "0s" }}>
          <Phone size={22} />
        </a>
        <a href="#contact" className="sidebar-icon shake-icon" aria-label="Book appointment" style={{ animationDelay: "0.3s" }}>
          <CalendarCheck size={22} />
        </a>
        <a href={`https://wa.me/${business.rawPhone}`} target="_blank" rel="noopener noreferrer" className="sidebar-icon shake-icon whatsapp-icon" aria-label="WhatsApp" style={{ animationDelay: "0.6s" }}>
          <MessageCircle size={22} />
        </a>
        <a href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`} target="_blank" rel="noopener noreferrer" className="sidebar-icon shake-icon" aria-label="Find us on map" style={{ animationDelay: "0.9s" }}>
          <MapPin size={22} />
        </a>
      </div>

      {/* ── Mobile Footer Bar ── */}

    </main>
  );
}
