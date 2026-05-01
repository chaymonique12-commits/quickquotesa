import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, FileCheck, Percent, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = { current: null };
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

const valueProps = [
  {
    icon: MessageCircle,
    title: 'WhatsApp Ready',
    desc: 'Send quotes where your customers are.',
  },
  {
    icon: FileCheck,
    title: 'Digital Signatures',
    desc: 'Legally binding approvals without the paperwork.',
  },
  {
    icon: Percent,
    title: 'VAT & Multi-Currency',
    desc: 'Built-in compliance for local and global trade.',
  },
  {
    icon: Wifi,
    title: 'Offline First',
    desc: 'Keep working during load-shedding or poor signal.',
  },
];

const placeholderLogos = [
  'TradeMaster SA', 'PlumbPro', 'ElectroFix', 'CleanCo', 'BuildRight', 'ServicePro',
];

export function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc]">
      {/* Sticky Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0f172a]/90 backdrop-blur border-b border-[#334155]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#fbbf24] flex items-center justify-center">
            <span className="text-[#0f172a] font-bold text-sm">QQ</span>
          </div>
          <span className="font-bold text-lg">QuickQuote SA</span>
        </div>
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-xl bg-[#fbbf24] text-[#0f172a] font-semibold text-sm hover:bg-[#d97706] transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#fbbf24] opacity-5 blur-[120px]" />
        </div>
        {mounted && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Stop Chasing Payments.{' '}
              <span className="text-[#fbbf24]">Start Closing Deals.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#94a3b8] mb-10 max-w-xl mx-auto">
              The all-in-one quoting tool built for South African businesses. Professional quotes,
              WhatsApp sharing, and digital signatures — all in 60 seconds.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#fbbf24] text-[#0f172a] font-bold text-lg hover:bg-[#d97706] transition-all hover:scale-105"
            >
              Get Started for Free →
            </Link>
            <p className="mt-4 text-sm text-[#64748b]">No credit card required. Works offline.</p>
          </motion.div>
        )}
      </section>

      {/* Product Mockup */}
      <section className="relative px-6 py-24 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-16">
              Everything you need to close deals fast
            </h2>
          </FadeIn>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Phone mockup */}
            <FadeIn delay={0.1}>
              <div className="w-52 md:w-64 rounded-[2rem] bg-[#1e293b] border border-[#334155] p-3 shadow-2xl">
                <div className="rounded-[1.5rem] bg-[#0f172a] overflow-hidden">
                  <div className="h-6 bg-[#1e293b] flex items-center justify-center">
                    <div className="w-16 h-4 rounded-full bg-[#334155]" />
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-16 rounded-lg bg-[#1e293b] border border-[#334155]" />
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="h-12 rounded-lg bg-[#1e293b] border border-[#334155]" />
                      ))}
                    </div>
                    <div className="h-8 rounded-lg bg-[#fbbf24]/20" />
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Tablet mockup */}
            <FadeIn delay={0.2}>
              <div className="w-72 md:w-80 rounded-[1.5rem] bg-[#1e293b] border border-[#334155] p-3 shadow-2xl">
                <div className="rounded-[1rem] bg-[#0f172a] overflow-hidden">
                  <div className="h-8 bg-[#1e293b] flex items-center justify-center">
                    <div className="w-24 h-3 rounded-full bg-[#334155]" />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#fbbf24]/20" />
                      <div>
                        <div className="h-3 w-32 rounded bg-[#334155]" />
                        <div className="h-2 w-24 rounded bg-[#334155] mt-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="h-10 rounded-lg bg-[#1e293b] border border-[#334155]" />
                      ))}
                    </div>
                    <div className="h-12 rounded-xl bg-[#fbbf24]" />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Built for how South Africans actually work
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {valueProps.map(({ icon: Icon, title, desc }, i) => (
              <FadeIn key={title} delay={i * 0.1}>
                <div className="flex items-start gap-4 p-6 rounded-xl bg-[#1e293b] border border-[#334155] hover:border-[#fbbf24]/40 transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center">
                    <Icon size={24} className="text-[#fbbf24]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{title}</h3>
                    <p className="text-sm text-[#94a3b8]">{desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-16 border-t border-[#334155]">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <p className="text-sm text-[#64748b] uppercase tracking-wider mb-8">
              Trusted by local entrepreneurs in Cape Town & beyond
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {placeholderLogos.map((name) => (
                <div
                  key={name}
                  className="h-8 px-4 rounded-md bg-[#1e293b] border border-[#334155] flex items-center justify-center"
                >
                  <span className="text-xs text-[#64748b] font-medium">{name}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#334155] text-center text-sm text-[#64748b]">
        <p>© {new Date().getFullYear()} QuickQuote SA. Built for SA tradies.</p>
      </footer>
    </div>
  );
}
