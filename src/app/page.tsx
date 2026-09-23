'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Zap,
  BarChart3,
  Brain,
  Globe2,
  Shield,
  TrendingUp,
  Shuffle,
  Activity,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  Menu,
  X
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Particle canvas — subtle ambient motion
───────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(Math.floor(window.innerWidth / 15), 90);
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.45 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34, 197, 94, ${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-75"
      style={{ zIndex: 0 }}
    />
  );
}

/* ─────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────── */
function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = Math.max(1, Math.ceil(target / 50));
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            setVal(target);
            clearInterval(timer);
          } else {
            setVal(start);
          }
        }, 20);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   India SVG silhouette
───────────────────────────────────────────── */
function IndiaSilhouette() {
  return (
    <svg
      viewBox="0 0 200 240"
      className="w-full h-full opacity-[0.08]"
      fill="#22c55e"
    >
      <path d="M95,5 L115,8 L130,15 L145,25 L155,40 L160,55 L158,70 L165,82 L170,95 
               L168,108 L160,118 L155,130 L158,145 L162,158 L160,170 L152,182 
               L145,190 L138,200 L130,210 L120,218 L112,225 L105,230 L100,235 
               L95,230 L88,225 L80,218 L72,210 L62,200 L55,190 L48,182 L40,170 
               L38,158 L42,145 L45,130 L40,118 L32,108 L30,95 L35,82 L42,70 
               L40,55 L45,40 L55,25 L70,15 L85,8 Z" />
      <path d="M105,230 L108,235 L100,240 L92,235 L95,230 Z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Main Landing Page Component
───────────────────────────────────────────── */
export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cardTilt, setCardTilt] = useState({ rotateX: 10, rotateY: -12 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Calculate 3D tilt angle based on window dimensions
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      setCardTilt({
        rotateX: 10 - dy * 6,
        rotateY: -12 + dx * 8,
      });
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }

        .landing-container {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #07080A;
          color: #FAFAFA;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
        }

        @keyframes aurora-bg {
          0%   { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
          50%  { transform: translate(-50%, -50%) rotate(180deg) scale(1.1); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
        }
        .aurora-effect {
          animation: aurora-bg 22s linear infinite;
        }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-10px) rotate(0.5deg); }
        }
        .float-gentle { animation: float-gentle 7s ease-in-out infinite; }

        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-1 { animation-delay: 0.15s; }
        .delay-2 { animation-delay: 0.30s; }
        .delay-3 { animation-delay: 0.45s; }

        @keyframes pulse-halo {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .pulse-halo-anim {
          animation: pulse-halo 2.4s ease-out infinite;
        }

        @keyframes text-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-green-text {
          background: linear-gradient(90deg, #22C55E 0%, #86EFAC 25%, #22C55E 50%, #4ADE80 75%, #22C55E 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: text-shimmer 4s linear infinite;
        }

        /* 3D Glass Surface Styles */
        .glass-dark-card {
          background: rgba(18, 18, 24, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-dark-card:hover {
          border-color: rgba(34, 197, 94, 0.3);
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px -5px rgba(34, 197, 94, 0.15);
        }

        .cta-primary-btn {
          background: linear-gradient(135deg, #15803D 0%, #22C55E 50%, #4ADE80 100%);
          box-shadow: 0 0 35px rgba(34, 197, 94, 0.4), 0 8px 24px rgba(0, 0, 0, 0.5);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cta-primary-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 0 50px rgba(34, 197, 94, 0.6), 0 12px 32px rgba(0, 0, 0, 0.6);
        }
        .cta-primary-btn:active {
          transform: translateY(0px) scale(0.98);
        }

        .slant-3d-frame {
          perspective: 1200px;
          transform-style: preserve-3d;
        }

        .slant-3d-card {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
          box-shadow: 0 30px 90px -20px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(34, 197, 94, 0.25), 0 0 40px rgba(34, 197, 94, 0.12);
        }

        .badge-pill-green {
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #86EFAC;
        }
      `}</style>

      <div className="landing-container relative">

        {/* Dynamic Cursor Spotlight Ambient Glow */}
        <div
          className="fixed pointer-events-none hidden md:block"
          style={{
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.07) 0%, transparent 65%)',
            left: mousePos.x - 350,
            top: mousePos.y - 350,
            transition: 'left 0.12s ease-out, top 0.12s ease-out',
            zIndex: 1,
          }}
        />

        {/* ════════════════════════════════════
            NAVIGATION HEADER
        ════════════════════════════════════ */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#07080A]/85 backdrop-blur-xl border-b border-white/10 transition-all duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
            
            {/* Reliance Brand Logo & Title */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#07080A] rounded-[10px] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-400" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <span className="text-white font-extrabold text-sm sm:text-base tracking-wide font-serif block leading-none">
                  Reliance
                </span>
                <span className="text-[10px] text-emerald-400 font-sans font-bold tracking-widest uppercase block mt-1">
                  Petchem Analytics
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-medium text-neutral-300">
              <a href="#features" className="hover:text-emerald-400 transition-colors">Platform Features</a>
              <a href="#monte-carlo" className="hover:text-emerald-400 transition-colors">Monte Carlo Engine</a>
              <a href="#green-energy" className="hover:text-emerald-400 transition-colors">Green Transition</a>
              <a href="#analytics" className="hover:text-emerald-400 transition-colors">Analytics</a>
            </nav>

            {/* Header Right Action Button */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                id="header-login-btn"
                className="cta-primary-btn inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-black rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all"
              >
                <span>Enter Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#0C0D12] border-b border-white/10 px-6 py-6 space-y-4 animate-fade-up">
              <nav className="flex flex-col space-y-3 text-sm font-medium text-neutral-200">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-neutral-800"
                >
                  Platform Features
                </a>
                <a
                  href="#monte-carlo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-neutral-800"
                >
                  Monte Carlo Engine
                </a>
                <a
                  href="#green-energy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-neutral-800"
                >
                  Green Transition
                </a>
                <a
                  href="#analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg hover:bg-neutral-800"
                >
                  Analytics & Modules
                </a>
              </nav>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full cta-primary-btn flex items-center justify-center gap-2 text-sm font-bold text-black rounded-full py-3"
                >
                  <span>Login to the World of Possibilities by Reliance</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* ════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
          <ParticleCanvas />

          {/* India Silhouettes */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 sm:w-96 h-80 sm:h-[450px] pointer-events-none opacity-40 right-[-3%]">
            <IndiaSilhouette />
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 sm:w-80 h-64 sm:h-[380px] pointer-events-none opacity-20 left-[-3%] scale-x-[-1]">
            <IndiaSilhouette />
          </div>

          {/* Aurora Radial Light Glow */}
          <div
            className="absolute aurora-effect pointer-events-none"
            style={{
              width: 'min(900px, 90vw)',
              height: 'min(900px, 90vw)',
              top: '50%',
              left: '50%',
              background: 'conic-gradient(from 0deg, rgba(34, 197, 94, 0.05) 0%, transparent 40%, rgba(34, 197, 94, 0.04) 70%, transparent 100%)',
              borderRadius: '50%',
              zIndex: 0,
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-6">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-pill-green text-xs font-semibold uppercase tracking-wider animate-fade-up">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reliance O2C Cracker Intelligence OS</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white animate-fade-up delay-1 max-w-4xl">
              Where Data Meets <br />
              <span className="shimmer-green-text">Petrochemical Strategy</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl leading-relaxed animate-fade-up delay-2">
              10,000-iteration Monte Carlo risk modeling, real-time feedstock pricing, 
              and AI copilot intelligence — purpose-built for Reliance Industries&apos; petrochemical cracker network.
            </p>

            {/* Hero CTA Button */}
            <div className="mt-4 animate-fade-up delay-3 w-full sm:w-auto">
              <Link
                href="/dashboard"
                id="main-hero-cta"
                className="cta-primary-btn flex items-center justify-center gap-3 text-black font-extrabold text-sm sm:text-base md:text-lg rounded-full px-6 sm:px-10 py-4 sm:py-5 shadow-2xl transition-all group"
              >
                <div className="relative shrink-0">
                  <div className="pulse-halo-anim absolute inset-0 rounded-full border border-black/30" />
                  <Zap className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <span className="text-center">Login to the world of possibilities by Reliance</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>

            {/* Platform highlights strip */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 text-xs text-neutral-400 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />
                <span>Live Commodity Feeds</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />
                <span>10,000 Monte Carlo Runs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#22c55e]" />
                <span>Grounded AI Engine</span>
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════
            STATS STRIP
        ════════════════════════════════════ */}
        <section id="analytics" className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-[#0C0D12]/70">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: 10000, suffix: '+', label: 'Monte Carlo Iterations', icon: Shuffle },
              { value: 18, suffix: '', label: 'Intelligence Modules', icon: BarChart3 },
              { value: 7500, suffix: ' KTPA', label: 'Feedstock Capacity', icon: Activity },
              { value: 5, suffix: ' Mega', label: 'RIL Cracker Complex', icon: Globe2 },
            ].map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div key={idx} className="glass-dark-card rounded-2xl p-4 sm:p-6 text-center group">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
                    <IconComp className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{stat.label}</span>
                  </div>
                  <div className="text-2xl sm:text-4xl font-black text-white font-tabular tracking-tight">
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ════════════════════════════════════
            MONTE CARLO FEATURE & REAL 3D SCREENSHOT
        ════════════════════════════════════ */}
        <section id="monte-carlo" className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex items-center gap-3 mb-10">
              <span className="badge-pill-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Flagship Stochastic Engine
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left Column: Technical Description */}
              <div className="lg:col-span-5 space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15]">
                  10,000-Run <br />
                  <span className="shimmer-green-text">Monte Carlo Engine</span>
                </h2>
                
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Replace fragile single-point estimates with full statistical probability distributions. 
                  Model commodity prices, crack spreads, FX rates, and operational delays using Gaussian Copula correlations.
                </p>

                {/* Feature Checkpoints */}
                <div className="space-y-3 pt-2">
                  {[
                    'Triangular, Normal & Discrete Parameter Sampling',
                    'Gaussian Copula Market Risk Correlation Matrix',
                    'P10 / P50 / P90 Probability Distributions (NPV & IRR)',
                    'Tornado Drivers — Rank Risk Sensitivity Factors',
                    'Bear, Base & Bull Macro Scenario Shifts',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href="/scenarios/monte-carlo"
                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors group"
                  >
                    <span>Launch Monte Carlo Simulation</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: 3D Slanted Pop-up Real Screenshot Showcase */}
              <div className="lg:col-span-7 slant-3d-frame">
                <div
                  className="slant-3d-card rounded-2xl overflow-hidden bg-neutral-900 border border-emerald-500/30 relative group"
                  style={{
                    transform: `perspective(1200px) rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg) scale(1.02)`,
                  }}
                >
                  {/* Top Bar Decoration */}
                  <div className="bg-[#121217] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-xs font-mono text-neutral-400">Monte Carlo Risk Simulator — Real Engine Output</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">10,000 SIMS</span>
                  </div>

                  {/* Real Monte Carlo Screenshot */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                    <Image
                      src="/images/real_monte_carlo_1.png"
                      alt="Actual Monte Carlo Simulation Screenshot from Platform"
                      fill
                      className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                      priority
                    />
                    
                    {/* Glass Overlay Glow Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Floating 3D Badge on Top Left */}
                  <div className="absolute top-16 left-6 glass-dark-card px-3.5 py-2 rounded-xl border border-emerald-500/40 shadow-xl hidden sm:flex items-center gap-2 animate-bounce-slow">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-white">NPV P50: ₹2,410 Cr</span>
                  </div>

                  {/* Floating 3D Badge on Bottom Right */}
                  <div className="absolute bottom-6 right-6 glass-dark-card px-4 py-2.5 rounded-xl border border-emerald-500/40 shadow-xl hidden sm:flex items-center gap-3">
                    <Shuffle className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-[10px] text-neutral-400 uppercase font-bold">Risk Sensitivity</div>
                      <div className="text-xs font-bold text-white">Ethane Feed Price (38.2%)</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ════════════════════════════════════
            BENTO GRID — PLATFORM MODULES
        ════════════════════════════════════ */}
        <section id="features" className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#090A0E]">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex items-center gap-3 mb-10">
              <span className="badge-pill-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Full Suite Capabilities
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Bento Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Bento Card 1: Market Intelligence */}
              <div className="glass-dark-card rounded-3xl p-6 flex flex-col justify-between group overflow-hidden relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase">Real-Time</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Market Intelligence</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Live tickers & historical trendlines for Ethane, Naphtha, Ethylene, Propylene, and USD/INR exchange rates.
                  </p>
                </div>
                
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">Yahoo Finance + ICIS feeds</span>
                  <Link href="/feedstock-tracker" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    <span>View Markets</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Bento Card 2: AI Copilot */}
              <div className="glass-dark-card rounded-3xl p-6 flex flex-col justify-between group overflow-hidden relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                      <Brain className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full uppercase">AI Native</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Copilot Studio</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Conversational strategic intelligence grounded in live market data, economic models, and technical citations.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">RIL Intelligence Engine</span>
                  <Link href="/ai" className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                    <span>Ask Copilot</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Bento Card 3: Risk Sentinel */}
              <div className="glass-dark-card rounded-3xl p-6 flex flex-col justify-between group overflow-hidden relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full uppercase">Shock Radar</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Macro Risk Sentinel</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Geopolitical shock matrix, Strait of Hormuz logistics threat tracking, and FX volatility alerts.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">Early Warning Radar</span>
                  <Link href="/risk-sentinel" className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                    <span>Explore Risks</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Bento Card 4: Feed-Mix Margin Calculator */}
              <div className="glass-dark-card rounded-3xl p-6 flex flex-col justify-between group overflow-hidden relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full uppercase">Margin Calculator</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Feed-Mix Margin Calculator</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Ethane/naphtha ratio tuning against live spot prices to see the EBITDA impact in real time.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">Live Feed Economics</span>
                  <Link href="/simulation" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    <span>Run Calculator</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Bento Card 5: Price Forecasts */}
              <div className="glass-dark-card rounded-3xl p-6 flex flex-col justify-between group overflow-hidden relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase">Predictive</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Price Forecast Engine</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Time-series forecasting combining AutoARIMA, LightGBM, and confidence interval error bounds.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">30D / 90D Horizons</span>
                  <Link href="/forecasts" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    <span>View Forecasts</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Bento Card 6: Competitive Benchmarking */}
              <div className="glass-dark-card rounded-3xl p-6 flex flex-col justify-between group overflow-hidden relative">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Globe2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase">Global Peers</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Peer Competitive Radar</h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    Benchmarking RIL O2C margins against global chemical majors: ExxonMobil, BASF, Dow, and SABIC.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">Global Margin Curve</span>
                  <Link href="/competitive-intelligence" className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    <span>Radar View</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ════════════════════════════════════
            INDIA & GREEN ENERGY TRANSITION
        ════════════════════════════════════ */}
        <section id="green-energy" className="relative z-10 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* India Card */}
            <div className="lg:col-span-4 glass-dark-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-64">
                  <IndiaSilhouette />
                </div>
              </div>

              <div>
                <span className="badge-pill-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  India Focus
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-4 mb-2">
                  Built for Bharat
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Tailored specifically for Indian petrochemical market dynamics — seamless INR ↔ USD conversion, domestic logistics, and regional pricing spreads.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <span className="text-xs text-emerald-400 font-bold">Reliance O2C Cracker Footprint</span>
              </div>
            </div>

            {/* Green Energy Ethane Advantage */}
            <div className="lg:col-span-8 glass-dark-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge-pill-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Green Transition Economics
                  </span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-4">
                  Ethane over Naphtha: <br />
                  <span className="shimmer-green-text">The Decarbonized Advantage</span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
                  Ethane cracking yields 79.5% ethylene vs 30% from naphtha while reducing total carbon footprint by ~30%, providing Reliance with a structural cost and ESG advantage.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">~30%</div>
                  <div className="text-xs font-bold text-white">Lower CO₂ Footprint</div>
                  <div className="text-[11px] text-neutral-400">vs traditional naphtha feed</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">79.5%</div>
                  <div className="text-xs font-bold text-white">Ethylene Product Yield</div>
                  <div className="text-[11px] text-neutral-400">high selectivity cracking</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">~10×</div>
                  <div className="text-xs font-bold text-white">Spread Advantage</div>
                  <div className="text-[11px] text-neutral-400">US ethane import pipeline</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════
            BIG BOTTOM CTA
        ════════════════════════════════════ */}
        <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 text-center border-t border-white/10 overflow-hidden bg-[#07080A]">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0%,transparent_70%)]" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <span className="badge-pill-green px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Ready to Explore
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
              A new era of <br />
              <span className="shimmer-green-text">petrochemical intelligence</span> <br />
              starts here.
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-xl mx-auto leading-relaxed">
              Step into the platform where simulations compute in milliseconds, market pricing refreshes live, and AI answers with evidence.
            </p>

            <div className="pt-4 flex justify-center">
              <Link
                href="/dashboard"
                id="bottom-login-cta"
                className="cta-primary-btn inline-flex items-center gap-3 text-black font-extrabold text-sm sm:text-base md:text-lg rounded-full px-8 sm:px-12 py-4 sm:py-5 shadow-2xl transition-all group"
              >
                <Zap className="w-5 h-5" strokeWidth={2.5} />
                <span>Login to the world of possibilities by Reliance</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════
            FOOTER
        ════════════════════════════════════ */}
        <footer className="relative z-10 py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#060709]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-black font-bold">
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-neutral-200 font-semibold">Reliance Intelligence Platform</span>
            </div>

            <p className="text-center sm:text-left text-neutral-400">
              Academic Project · Jio Institute PGP Management Finance · 2026
            </p>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#22c55e]" />
              <span className="text-emerald-400 font-medium">Production Live</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
