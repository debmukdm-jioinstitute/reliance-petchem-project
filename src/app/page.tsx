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
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Particle canvas — matte-black atmosphere
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

    const count = 120;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      opacity: Math.random() * 0.5 + 0.15,
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
        ctx.fillStyle = `rgba(34,197,94,${p.opacity})`;
        ctx.fill();
      });
      // Draw faint connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34,197,94,${0.04 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
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
      className="absolute inset-0 pointer-events-none"
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
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setVal(target); clearInterval(timer); }
          else setVal(Math.floor(start));
        }, 16);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   India SVG silhouette (simplified path)
───────────────────────────────────────────── */
function IndiaSilhouette() {
  return (
    <svg
      viewBox="0 0 200 240"
      className="w-full h-full opacity-[0.07]"
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
   Main Landing Page
───────────────────────────────────────────── */
export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }

        .landing-root {
          font-family: 'Outfit', sans-serif;
          background: #07080A;
          color: #fff;
          min-height: 100vh;
          overflow-x: hidden;
        }

        @keyframes aurora {
          0%   { transform: translate(-50%,-50%) rotate(0deg) scale(1); }
          50%  { transform: translate(-50%,-50%) rotate(180deg) scale(1.15); }
          100% { transform: translate(-50%,-50%) rotate(360deg) scale(1); }
        }
        .aurora {
          animation: aurora 18s linear infinite;
        }

        @keyframes float-slow {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-12px) rotate(1deg); }
        }
        .float-slow { animation: float-slow 6s ease-in-out infinite; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up-0 { animation: fadeSlideUp 0.8s ease forwards; }
        .fade-up-1 { animation: fadeSlideUp 0.8s 0.15s ease both; }
        .fade-up-2 { animation: fadeSlideUp 0.8s 0.3s ease both; }
        .fade-up-3 { animation: fadeSlideUp 0.8s 0.45s ease both; }
        .fade-up-4 { animation: fadeSlideUp 0.8s 0.6s ease both; }

        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .pulse-ring {
          animation: pulse-ring 2.2s ease-out infinite;
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #22c55e 0%, #86efac 30%, #22c55e 60%, #4ade80 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3.5s linear infinite;
        }

        .glass-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .glass-card-green {
          background: rgba(34,197,94,0.06);
          border: 1px solid rgba(34,197,94,0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .card-3d {
          transform-style: preserve-3d;
          transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s;
        }
        .card-3d:hover {
          transform: perspective(800px) rotateX(-3deg) rotateY(3deg) translateY(-4px);
          box-shadow: 0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,197,94,0.12);
        }

        .cta-btn {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%);
          box-shadow: 0 0 40px rgba(34,197,94,0.35), 0 8px 32px rgba(0,0,0,0.4);
          transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
          position: relative;
          overflow: hidden;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }
        .cta-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 0 60px rgba(34,197,94,0.5), 0 16px 48px rgba(0,0,0,0.5);
        }
        .cta-btn:active { transform: translateY(0) scale(0.99); }

        .stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 20px 24px;
          transition: border-color 0.3s, background 0.3s;
        }
        .stat-card:hover {
          background: rgba(34,197,94,0.05);
          border-color: rgba(34,197,94,0.2);
        }

        .screenshot-glow {
          box-shadow: 0 0 0 1px rgba(34,197,94,0.1), 0 24px 80px rgba(0,0,0,0.6), 0 0 80px rgba(34,197,94,0.06);
        }

        .tag-pill {
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          color: #86efac;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          padding: 3px 10px;
          border-radius: 100px;
          text-transform: uppercase;
        }

        .nav-link {
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-weight: 500;
          transition: color 0.2s;
          letter-spacing: 0.02em;
        }
        .nav-link:hover { color: #fff; }

        .scroll-indicator {
          animation: float-slow 2.5s ease-in-out infinite;
        }

        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-blink { animation: blink 1.1s step-end infinite; }

        .india-glow {
          filter: drop-shadow(0 0 40px rgba(34,197,94,0.15));
        }
      `}</style>

      <div className="landing-root">

        {/* ── Ambient spotlight following cursor ── */}
        <div
          className="fixed pointer-events-none"
          style={{
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
            left: mousePos.x - 300,
            top: mousePos.y - 300,
            transition: 'left 0.15s ease, top 0.15s ease',
            zIndex: 1,
          }}
        />

        {/* ════════════════════════════════════
            NAVBAR
        ════════════════════════════════════ */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10"
          style={{
            height: 64,
            background: 'rgba(7,8,10,0.8)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}
            >
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">
              Reliance Intelligence
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="nav-link">Features</a>
            <a href="#simulation" className="nav-link">Simulation</a>
            <a href="#analytics" className="nav-link">Analytics</a>
            <a href="#platform" className="nav-link">Platform</a>
          </div>

          {/* CTA */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-black rounded-full px-5 py-2 cta-btn"
            style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}
          >
            Enter Platform
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </nav>

        {/* ════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════ */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-16"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.07) 0%, transparent 65%)' }}
        >
          <ParticleCanvas />

          {/* India silhouette watermark */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 india-glow"
            style={{ width: 380, height: 460, opacity: 0.6, right: '-4%' }}
          >
            <IndiaSilhouette />
          </div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 india-glow scale-x-[-1]"
            style={{ width: 280, height: 340, opacity: 0.3, left: '-3%' }}
          >
            <IndiaSilhouette />
          </div>

          {/* Aurora background blob */}
          <div
            className="absolute aurora"
            style={{
              width: 900,
              height: 900,
              top: '50%',
              left: '50%',
              background: 'conic-gradient(from 0deg, rgba(34,197,94,0.04) 0%, transparent 40%, rgba(34,197,94,0.03) 70%, transparent 100%)',
              borderRadius: '50%',
              zIndex: 0,
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-4xl mx-auto">

            {/* Badge */}
            <div className="tag-pill fade-up-0">
              ✦ &nbsp;Intelligence Operating System &nbsp;✦
            </div>

            {/* Headline */}
            <h1
              className="fade-up-1 font-black leading-none tracking-tight"
              style={{ fontSize: 'clamp(42px, 8vw, 92px)', lineHeight: 1.0 }}
            >
              <span className="text-white">Where Data Meets </span>
              <br />
              <span className="shimmer-text">Petrochemical Strategy</span>
            </h1>

            {/* Sub */}
            <p
              className="fade-up-2 text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}
            >
              10,000-run Monte Carlo simulations. Real-time market intelligence.
              AI-powered answers. Built for India&apos;s O2C cracker business.
            </p>

            {/* CTA */}
            <div className="fade-up-3 flex flex-col sm:flex-row items-center gap-4 mt-2">
              <Link
                href="/dashboard"
                id="hero-cta-btn"
                className="cta-btn flex items-center gap-3 text-black font-bold text-base rounded-full px-8 py-4"
              >
                <div className="relative">
                  <div className="pulse-ring absolute inset-0 rounded-full border border-black/20" />
                  <Zap className="w-4 h-4" strokeWidth={2.5} />
                </div>
                Login to the World of Possibilities by Reliance
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust strip */}
            <div
              className="fade-up-4 flex items-center gap-6 mt-4 text-xs font-medium"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Live Market Data
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                10K Monte Carlo Runs
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                AI Grounded Answers
              </span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator flex flex-col items-center gap-1.5 z-10"
            style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: '0.1em' }}
          >
            <span>EXPLORE</span>
            <div
              className="w-px h-10"
              style={{ background: 'linear-gradient(to bottom, rgba(34,197,94,0.4), transparent)' }}
            />
          </div>
        </section>

        {/* ════════════════════════════════════
            STAT STRIP
        ════════════════════════════════════ */}
        <section
          id="analytics"
          className="relative z-10 py-12 px-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 10000, suffix: '+', label: 'Monte Carlo Runs', icon: <Shuffle className="w-4 h-4" /> },
              { value: 18, suffix: '', label: 'Analytics Modules', icon: <BarChart3 className="w-4 h-4" /> },
              { value: 7500, suffix: 'K', label: 'KTPA Feed Capacity', icon: <Activity className="w-4 h-4" /> },
              { value: 5, suffix: '', label: 'Cracker Assets', icon: <Globe2 className="w-4 h-4" /> },
            ].map((s, i) => (
              <div key={i} className="stat-card text-center">
                <div
                  className="flex items-center justify-center gap-1.5 mb-2"
                  style={{ color: '#22c55e' }}
                >
                  {s.icon}
                  <span className="text-xs font-medium">{s.label}</span>
                </div>
                <div
                  className="font-black"
                  style={{ fontSize: 32, lineHeight: 1, color: '#fff', letterSpacing: '-0.02em' }}
                >
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════
            MONTE CARLO FEATURE — HERO CARD
        ════════════════════════════════════ */}
        <section
          id="simulation"
          className="relative z-10 py-24 px-6"
        >
          <div className="max-w-6xl mx-auto">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="tag-pill">Flagship Engine</div>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left — copy */}
              <div className="space-y-6">
                <h2 className="font-black text-white leading-tight" style={{ fontSize: 'clamp(32px,5vw,56px)' }}>
                  10,000-Run
                  <br />
                  <span className="shimmer-text">Monte Carlo</span>
                  <br />
                  Simulation Engine
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 420 }}>
                  Replace single-point estimates with full probability distributions.
                  Every commodity price, currency swing, and project delay is modelled
                  as a statistical distribution — linked by a Gaussian copula so correlated
                  risks move together.
                </p>

                {/* Feature bullets */}
                <div className="space-y-3">
                  {[
                    'Triangular, Normal & Discrete distributions',
                    'Gaussian Copula market correlation',
                    'P10 / P50 / P90 NPV, IRR, Payback',
                    'Tornado chart — top risk drivers ranked',
                    'Bear / Base / Bull scenario presets',
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/scenarios/monte-carlo"
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: '#22c55e' }}
                >
                  Run a simulation
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Right — screenshot */}
              <div className="card-3d float-slow">
                <div
                  className="rounded-2xl overflow-hidden screenshot-glow"
                  style={{ border: '1px solid rgba(34,197,94,0.12)' }}
                >
                  <Image
                    src="/images/screenshot-montecarlo.jpg"
                    alt="Monte Carlo Simulation Engine Screenshot"
                    width={800}
                    height={450}
                    className="w-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            BENTO FEATURE GRID
        ════════════════════════════════════ */}
        <section id="features" className="relative z-10 py-8 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <div className="tag-pill">All Modules</div>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* LARGE — Market Intelligence */}
              <div
                className="md:col-span-7 rounded-3xl p-0 overflow-hidden card-3d glass-card"
                style={{ minHeight: 360 }}
              >
                <div className="relative h-full">
                  <Image
                    src="/images/screenshot-market.jpg"
                    alt="Market Intelligence Dashboard"
                    width={900}
                    height={500}
                    className="w-full h-full object-cover opacity-80"
                    style={{ maxHeight: 360 }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(7,8,10,0.95) 0%, rgba(7,8,10,0.4) 50%, transparent 100%)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="tag-pill mb-2" style={{ display: 'inline-block' }}>Live Feed</div>
                    <h3 className="text-white font-bold text-xl mt-1">Market Intelligence</h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>
                      Brent · Naphtha · Ethane · Ethylene · USD/INR in real time
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT stack */}
              <div className="md:col-span-5 flex flex-col gap-4">

                {/* AI Copilot */}
                <div
                  className="rounded-3xl p-0 overflow-hidden card-3d glass-card flex-1"
                  style={{ minHeight: 170 }}
                >
                  <div className="relative h-full">
                    <Image
                      src="/images/screenshot-ai.jpg"
                      alt="AI Copilot Studio"
                      width={600}
                      height={340}
                      className="w-full h-full object-cover opacity-75"
                      style={{ maxHeight: 170 }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(7,8,10,0.92) 0%, rgba(7,8,10,0.35) 60%, transparent 100%)' }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="tag-pill mb-1.5" style={{ display: 'inline-block' }}>AI Native</div>
                      <h3 className="text-white font-bold text-base">AI Copilot Studio</h3>
                    </div>
                  </div>
                </div>

                {/* Small cards row */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Shield className="w-5 h-5" />, title: 'Risk Sentinel', desc: 'Macro threat matrix' },
                    { icon: <TrendingUp className="w-5 h-5" />, title: 'Price Forecasts', desc: 'AutoARIMA + LightGBM' },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-4 glass-card-green card-3d flex flex-col gap-3"
                    >
                      <div style={{ color: '#22c55e' }}>{c.icon}</div>
                      <div>
                        <div className="text-white font-semibold text-sm">{c.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom row of 3 */}
              {[
                {
                  icon: <Activity className="w-6 h-6" />,
                  title: 'SCADA Digital Twin',
                  desc: 'Real-time cracker furnace simulation with yield modelling',
                  col: 4,
                  tag: 'Simulation',
                },
                {
                  icon: <Brain className="w-6 h-6" />,
                  title: 'LP Feedstock Optimizer',
                  desc: 'Linear programming feedstock allocation for max margin',
                  col: 4,
                  tag: 'Optimization',
                },
                {
                  icon: <Globe2 className="w-6 h-6" />,
                  title: 'Competitive Intelligence',
                  desc: 'Global peer benchmarking across ExxonMobil, BASF, Dow, SABIC',
                  col: 4,
                  tag: 'Benchmarks',
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className={`md:col-span-${c.col} rounded-3xl p-6 glass-card card-3d flex flex-col gap-4`}
                  style={{ minHeight: 180 }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}
                    >
                      {c.icon}
                    </div>
                    <div className="tag-pill">{c.tag}</div>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-white font-bold text-base">{c.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{c.desc}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            INDIA + GREEN ENERGY BAND
        ════════════════════════════════════ */}
        <section
          id="platform"
          className="relative z-10 py-24 px-6 overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* India card */}
            <div
              className="lg:col-span-1 rounded-3xl p-8 glass-card-green card-3d flex flex-col items-center justify-center relative overflow-hidden"
              style={{ minHeight: 280 }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div style={{ width: 200, height: 240 }}>
                  <IndiaSilhouette />
                </div>
              </div>
              <div className="relative z-10 text-center space-y-3">
                <div className="tag-pill">India First</div>
                <h3 className="text-white font-black text-2xl">Built for<br />Bharat</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.6 }}>
                  INR ↔ USD dual currency. India-specific feedstock economics. Powered by RIL&apos;s O2C asset network.
                </p>
              </div>
            </div>

            {/* Green energy card */}
            <div
              className="lg:col-span-2 rounded-3xl p-8 glass-card card-3d relative overflow-hidden"
              style={{ minHeight: 280 }}
            >
              {/* Decorative gradient orb */}
              <div
                className="absolute -right-20 -top-20 rounded-full"
                style={{
                  width: 300,
                  height: 300,
                  background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)',
                }}
              />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="tag-pill mb-4" style={{ display: 'inline-block' }}>Green Energy Transition</div>
                  <h3 className="text-white font-black text-3xl leading-tight">
                    Ethane over Naphtha.
                    <br />
                    <span className="shimmer-text">The Future of O2C.</span>
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[
                    { label: 'Lower CO₂', value: '~30%', sub: 'vs naphtha cracking' },
                    { label: 'Ethylene Yield', value: '79.5%', sub: 'from ethane feed' },
                    { label: 'Cost Advantage', value: '~10×', sub: 'ethane vs naphtha/t' },
                  ].map((m, i) => (
                    <div key={i} className="space-y-1">
                      <div
                        className="font-black"
                        style={{ fontSize: 28, color: '#22c55e', letterSpacing: '-0.02em' }}
                      >
                        {m.value}
                      </div>
                      <div className="text-white font-semibold text-xs">{m.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            BIG CTA SECTION
        ════════════════════════════════════ */}
        <section
          className="relative z-10 py-32 px-6 text-center overflow-hidden"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          {/* Background radial */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(34,197,94,0.08) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="tag-pill" style={{ display: 'inline-block' }}>
              Ready to Begin
            </div>

            <h2
              className="font-black text-white leading-none"
              style={{ fontSize: 'clamp(36px,7vw,80px)', letterSpacing: '-0.03em' }}
            >
              A new era of
              <br />
              <span className="shimmer-text">petrochemical intelligence</span>
              <br />
              starts here.
            </h2>

            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 17, lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
              Step into the platform where simulations run in milliseconds, markets
              refresh in real time, and AI answers with evidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Link
                href="/dashboard"
                id="bottom-cta-btn"
                className="cta-btn flex items-center gap-3 text-black font-black text-lg rounded-full px-10 py-5"
              >
                <Zap className="w-5 h-5" strokeWidth={2.5} />
                Login to the World of Possibilities by Reliance
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Features quick list */}
            <div
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4"
              style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}
            >
              {['18 Modules', 'Monte Carlo Engine', 'Live Market Data', 'AI Copilot', 'SCADA Simulator', 'Knowledge Graph'].map((f) => (
                <span key={f} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-green-500 opacity-60" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            FOOTER
        ════════════════════════════════════ */}
        <footer
          className="relative z-10 py-8 px-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}
            >
              <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              Reliance Intelligence Platform
            </span>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
            Academic project · Jio Institute PGP Management Finance · 2026
          </p>

          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #22c55e' }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Live on Vercel</span>
          </div>
        </footer>

      </div>
    </>
  );
}
