/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  ChevronRight,
  Cpu,
  Github,
  Search,
  ShieldAlert,
  X,
  User,
  Zap,
} from 'lucide-react';
import rasulovAbdulazizPhoto from './rasulov abdulaziz.jpg';
import bekhruzPhoto from './bekhruz .jpg';

type ResultState = 'idle' | 'analyzing' | 'safe' | 'phishing';

interface ResultData {
  status: 'SAFE' | 'PHISHING';
  confidence: number;
  url: string;
  normalizedUrl: string;
  message: string;
  summary: string;
  phishingType: string;
  findings: string[];
  matchedKeywords: string[];
  matchedBrands: string[];
  decisionSource: string;
}

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const resourceItems: ResourceItem[] = [
  {
    id: 'attacks',
    title: 'Phishing Attacks',
    description:
      'Shows common attack styles like fake logins, bank scams, IP-based links, @ tricks, and fake HTTPS wording in domains.',
    icon: ShieldAlert,
  },
  {
    id: 'models',
    title: 'Machine Learning Models',
    description:
      'Highlights the three models tested in this project: Logistic Regression, Decision Tree, and Random Forest.',
    icon: Cpu,
  },
  {
    id: 'features',
    title: 'Detection Features',
    description:
      'Explains which URL parts are counted, such as dots, hyphens, keywords, IP addresses, HTTPS, and subdomains.',
    icon: Search,
  },
  {
    id: 'logic',
    title: 'Detection Logic',
    description:
      'Combines machine learning prediction with rule-based checks so obvious phishing patterns are easier to catch.',
    icon: Zap,
  },
  {
    id: 'links',
    title: 'Project Links',
    description:
      'Shows how the user pastes a URL, clicks Analyze, and gets the result through the deployed app and repository links.',
    icon: Github,
  },
];

const authorItems = [
  {
    name: 'Rasulov Abdulaziz',
    id: 'U2110237',
    role: 'Backend, ML, and system integration',
    photo: rasulovAbdulazizPhoto,
    bio: 'Focused on the Flask backend, phishing detection logic, model integration, and final system behavior.',
  },
  {
    name: 'Umurzaqov Bekhruz',
    id: 'U2110278',
    role: 'Frontend support and project collaboration',
    photo: bekhruzPhoto,
    bio: 'Worked on project collaboration, interface support, testing flow, and presentation-ready structure.',
  },
] as const;

function DemoShell({ children }: { children: ReactNode }) {
  return (
    <div className="resource-demo-frame overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_16px_40px_rgba(0,242,255,0.08)]">
      {children}
    </div>
  );
}

function ModelDemo() {
  const modelStates = [
    {
      name: 'Logistic Regression',
      summary: 'Best for simple linear separation',
      result: 'Safe',
      accent: 'emerald',
    },
    {
      name: 'Decision Tree',
      summary: 'Rule-based branch prediction',
      result: 'Phishing',
      accent: 'amber',
    },
    {
      name: 'Random Forest',
      summary: 'Ensemble voting for stronger stability',
      result: 'Phishing',
      accent: 'cyan',
    },
  ] as const;

  const [activeModel, setActiveModel] = useState<(typeof modelStates)[number]>(modelStates[2]);

  return (
    <DemoShell>
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-2 text-center text-[11px] text-white/80">
        {['URL', 'Features', 'Model', 'Result'].map((label, index) => (
          <div key={label} className="contents">
            <motion.div
              animate={{ y: [0, -3, 0], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 1.8, delay: index * 0.2, repeat: Infinity }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-4 font-medium text-white"
            >
              {label}
            </motion.div>
            {index < 3 && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3], x: [0, 4, 0] }}
                transition={{ duration: 1.4, delay: index * 0.15, repeat: Infinity }}
                className="text-cyan-300"
              >
                →
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <motion.div
        key={activeModel.name}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="mt-3 rounded-2xl border border-white/8 bg-black/20 px-3 py-3 text-center"
      >
        <p className="text-[10px] uppercase tracking-[1px] text-brand-dim">Selected Model</p>
        <p className="mt-1 text-sm font-semibold text-white">{activeModel.name}</p>
        <p className="mt-1 text-[11px] text-brand-dim">{activeModel.summary}</p>
        <p className={`mt-2 text-[11px] font-medium ${
          activeModel.accent === 'emerald'
            ? 'text-emerald-300'
            : activeModel.accent === 'amber'
              ? 'text-amber-300'
              : 'text-cyan-200'
        }`}>
          Result Preview: {activeModel.result}
        </p>
      </motion.div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[10px] text-brand-dim">
        {modelStates.map((model) => {
          const isActive = activeModel.name === model.name;
          const activeClasses =
            model.accent === 'emerald'
              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
              : model.accent === 'amber'
                ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200';

          return (
            <motion.button
              key={model.name}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveModel(model)}
              className={`rounded-full border px-3 py-1.5 transition-all ${
                isActive ? activeClasses : 'border-white/10 bg-white/[0.04] text-brand-dim hover:border-white/20 hover:text-white'
              }`}
            >
              {model.name}
            </motion.button>
          );
        })}
      </div>
    </DemoShell>
  );
}

function ResourceDemo({ id }: { id: string }) {
  if (id === 'attacks') {
    return (
      <DemoShell>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/8 px-3 py-2">
            <div>
              <p className="text-[10px] uppercase tracking-[1px] text-emerald-200/70">Real Site</p>
              <p className="text-sm font-semibold text-white">https://www.paypal.com</p>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[10px] font-semibold text-emerald-300">Safe</span>
          </div>
          <motion.div
            initial={{ opacity: 0.65 }}
            animate={{ opacity: [0.65, 1, 0.65], y: [0, -2, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-2xl border border-cyan-400/20 bg-cyan-400/8 px-3 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[1px] text-cyan-100/70">Fake Site</p>
                <p className="text-sm font-semibold text-white">paypal-login-secure.com</p>
              </div>
              <motion.span
                animate={{ boxShadow: ['0 0 0 rgba(34,211,238,0)', '0 0 18px rgba(34,211,238,0.45)', '0 0 0 rgba(34,211,238,0)'] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-semibold text-cyan-200"
              >
                Suspicious URL
              </motion.span>
            </div>
            <div className="mt-3 rounded-xl border border-white/8 bg-black/20 p-3">
              <div className="mb-2 h-2.5 w-20 rounded-full bg-white/10" />
              <div className="mb-4 h-9 rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-[11px] text-white/80">
                Password: ********
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -4] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-[11px] text-red-200"
              >
                Warning: possible phishing page detected
              </motion.div>
            </div>
          </motion.div>
        </div>
      </DemoShell>
    );
  }

  if (id === 'models') {
    return <ModelDemo />;
  }

  if (id === 'features') {
    return (
      <DemoShell>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-3 font-mono text-[12px] text-white/85 break-all">
          http://login-secure-update.192.168.1.10.verify.com/account
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { label: 'Dots', value: 5 },
            { label: 'Hyphens', value: 2 },
            { label: 'Keywords', value: 3 },
            { label: 'IP Found', value: 1 },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.02, 1] }}
              transition={{ duration: 1.6, delay: index * 0.18, repeat: Infinity }}
              className="rounded-2xl border border-cyan-400/15 bg-cyan-400/8 px-3 py-3"
            >
              <p className="text-[10px] uppercase tracking-[1px] text-cyan-100/70">{item.label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </DemoShell>
    );
  }

  if (id === 'logic') {
    return (
      <DemoShell>
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
          >
            <p className="text-[10px] uppercase tracking-[1px] text-brand-dim">ML Prediction</p>
            <p className="mt-2 text-sm font-semibold text-white">Phishing</p>
            <p className="mt-1 text-[11px] text-brand-dim">Confidence: 72.6%</p>
          </motion.div>
          <motion.div
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 1.8, delay: 0.35, repeat: Infinity }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
          >
            <p className="text-[10px] uppercase tracking-[1px] text-brand-dim">Rule Check</p>
            <p className="mt-2 text-sm font-semibold text-white">Brand + login + fake https</p>
            <p className="mt-1 text-[11px] text-brand-dim">Heuristic override</p>
          </motion.div>
        </div>
        <motion.div
          animate={{ y: [8, 0, 0], opacity: [0, 1, 1] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center"
        >
          <p className="text-[10px] uppercase tracking-[1px] text-cyan-100/70">Final Decision</p>
          <p className="mt-1 text-base font-semibold text-white">Potential Phishing</p>
        </motion.div>
      </DemoShell>
    );
  }

  return (
    <DemoShell>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
        <p className="mb-2 text-[10px] uppercase tracking-[1px] text-brand-dim">Live Demo Flow</p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white">
          phishguard-gamma-olive.vercel.app
        </div>
        <div className="mt-3 flex items-center gap-2">
          <motion.div
            animate={{ x: [0, 12, 12, 0], opacity: [1, 1, 0.4, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.9)]"
          />
          <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] text-white/80">
            Paste URL → Analyze → View result
          </div>
        </div>
        <motion.div
          animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, -6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-[11px] text-emerald-200"
        >
          Result appears instantly with confidence and explanation
        </motion.div>
      </div>
    </DemoShell>
  );
}

export default function App() {
  const [url, setUrl] = useState('');
  const [resultState, setResultState] = useState<ResultState>('idle');
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [openResourceId, setOpenResourceId] = useState<string>('attacks');
  const [activeAuthorId, setActiveAuthorId] = useState<string | null>(null);
  const resultPanelRef = useRef<HTMLDivElement | null>(null);

  const activeAuthor = authorItems.find((author) => author.id === activeAuthorId) ?? null;

  const scrollToResultOnMobile = () => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 1024) return;

    window.setTimeout(() => {
      resultPanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 180);
  };

  const handleCheck = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;

    setResultState('analyzing');
    scrollToResultOnMobile();

    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error('Prediction error:', data.error);
        setResultData(null);
        setResultState('idle');
        return;
      }

      const status = data.prediction === 'Phishing' ? 'PHISHING' : 'SAFE';
      setResultData({
        status,
        confidence: data.confidence,
        url,
        normalizedUrl: data.normalized_url ?? url,
        message: data.message ?? '',
        summary: data.summary ?? '',
        phishingType: data.phishing_type ?? '',
        findings: Array.isArray(data.findings) ? data.findings : [],
        matchedKeywords: Array.isArray(data.matched_keywords) ? data.matched_keywords : [],
        matchedBrands: Array.isArray(data.matched_brands) ? data.matched_brands : [],
        decisionSource: data.decision_source ?? 'machine_learning',
      });
      setResultState(status === 'PHISHING' ? 'phishing' : 'safe');
    } catch (error) {
      console.error('Error checking URL:', error);
      setResultData(null);
      setResultState('idle');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col selection:bg-brand-accent/30 selection:text-brand-accent">
      <nav className="h-16 flex items-center justify-between px-6 md:px-12 border-b border-white/5 bg-brand-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-accent rounded-md shadow-[0_0_20px_rgba(0,242,255,0.35)]" />
          <span className="text-xl font-bold tracking-tight text-white">PhishGuard</span>
        </div>
        <a
          href="#resources"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-brand-accent/40 hover:text-brand-accent"
        >
          Resources
        </a>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
        <div className="space-y-10">
          <section id="hero">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-[56px] font-extrabold leading-[1.1] mb-4 hero-gradient-text">
                Detect Phishing
                <br />
                Websites Instantly
              </h1>
              <p className="text-brand-dim text-lg leading-relaxed max-w-[500px] mb-10">
                Our advanced neural network analyzes site metadata and behavioral patterns to keep your data safe from credential harvesting and malicious redirects.
              </p>

              <div className="relative w-full max-w-[540px]">
                <form onSubmit={handleCheck} className="relative">
                  <input
                    type="text"
                    placeholder="https://suspect-site.com/login"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 px-6 py-[18px] rounded-[14px] text-white outline-none focus:border-brand-accent focus:bg-white/[0.08] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={resultState === 'analyzing'}
                    className="absolute right-2 top-2 bottom-2 px-6 rounded-[10px] btn-gradient text-white font-semibold text-sm disabled:opacity-50"
                  >
                    {resultState === 'analyzing' ? 'Analyzing...' : 'Check URL'}
                  </button>
                </form>
              </div>
            </motion.div>
          </section>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Fast Detection', desc: 'Real-time analysis under 200ms.' },
              { title: 'ML Driven', desc: 'Three models compared and tested.' },
              { title: 'Secure', desc: 'Focused on suspicious URL patterns.' },
              { title: 'Easy to Use', desc: 'Simple browser-based interface.' },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group cursor-default">
                <h4 className="text-[13px] font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">{item.title}</h4>
                <p className="text-[11px] text-brand-dim leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <section id="resources" className="scroll-mt-24">
            <div className="mx-auto max-w-[680px]">
              <div className="mb-5">
                <p className="mb-2 text-[11px] uppercase tracking-[1.2px] text-cyan-200/70">Knowledge Base</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Project Resources</h2>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-3 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                <div className="space-y-3">
                  {resourceItems.map((item) => {
                    const isOpen = openResourceId === item.id;
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        className={`rounded-[20px] border transition-all duration-300 ${
                          isOpen
                            ? 'border-cyan-300/20 bg-cyan-300/[0.08] shadow-[0_0_30px_rgba(34,211,238,0.12)]'
                            : 'border-white/8 bg-white/[0.02]'
                        }`}
                        whileHover={{ y: -2 }}
                      >
                        <motion.button
                          type="button"
                          onClick={() => setOpenResourceId(isOpen ? '' : item.id)}
                          whileTap={{ scale: 0.97 }}
                          className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                        >
                          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                            isOpen ? 'border-cyan-300/20 bg-cyan-300/10 text-cyan-200' : 'border-white/8 bg-white/[0.04] text-white/80'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-semibold text-white">{item.title}</p>
                          </div>
                          <motion.div
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              isOpen ? 'bg-cyan-300/10 text-cyan-200' : 'bg-white/[0.03] text-white/60'
                            }`}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </motion.div>
                        </motion.button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.25 }}
                                className="border-t border-white/6 px-4 pb-4 pt-3 sm:px-5"
                              >
                                <p className="mb-4 max-w-[52ch] text-sm leading-6 text-[#aaaaaa]">{item.description}</p>
                                <ResourceDemo id={item.id} />
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <div id="authors" className="space-y-4 pt-2">
            <div className="mb-2">
              <p className="mb-2 text-[11px] uppercase tracking-[1.2px] text-cyan-200/70">Project Authors</p>
              <h3 className="text-2xl md:text-[30px] font-semibold tracking-tight text-white">Built by the student team behind PhishGuard</h3>
            </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {authorItems.map((author, index) => (
                <motion.button
                  type="button"
                  key={index}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setActiveAuthorId(author.id)}
                  className="overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03] p-3 text-left shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-colors hover:border-cyan-300/20 hover:shadow-[0_18px_54px_rgba(0,242,255,0.12)]"
                >
                  <div className="rounded-[20px] border border-white/8 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-[18px] border border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.24)]">
                          <img
                            src={author.photo}
                            alt={author.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h5 className="text-base font-semibold tracking-tight text-white">{author.name}</h5>
                          <p className="mt-1 text-[12px] font-medium text-cyan-200/85">{author.id}</p>
                        </div>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/20 px-3 py-3">
                      <p className="text-[10px] uppercase tracking-[1px] text-brand-dim">Role</p>
                      <p className="mt-1 text-sm leading-6 text-white/90">{author.role}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div ref={resultPanelRef} className="lg:sticky lg:top-24">
          <div className="min-h-[420px] rounded-[24px] glass p-8 flex flex-col gap-6 relative overflow-hidden glow-cyan">
            {resultState === 'analyzing' && (
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent scanning-animation" />
            )}

            <div className="flex justify-between items-center">
              <span
                className={`status-badge px-3 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase border ${
                  resultState === 'idle'
                    ? 'bg-white/10 text-brand-dim border-transparent'
                    : resultState === 'analyzing'
                      ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20'
                      : resultState === 'safe'
                        ? 'bg-brand-safe/10 text-brand-safe border-brand-safe/20'
                        : 'bg-brand-danger/10 text-brand-danger border-brand-danger/20'
                }`}
              >
                {resultState === 'idle'
                  ? 'Awaiting Input'
                  : resultState === 'analyzing'
                    ? 'Analyzing...'
                    : resultState === 'safe'
                      ? 'Verified Safe'
                      : 'Phishing Detected'}
              </span>
              <span className="text-[12px] text-brand-dim font-mono">ID: 8821-X</span>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center gap-6">
              <AnimatePresence mode="wait">
                {resultState === 'idle' || resultState === 'analyzing' ? (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="text-5xl opacity-20">🔍</div>
                    <p className="text-brand-dim text-sm max-w-[200px]">
                      {resultState === 'analyzing'
                        ? 'Performing deep signature analysis...'
                        : 'Enter a URL to begin real-time threat assessment.'}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="text-6xl">{resultState === 'safe' ? '🛡️' : '⚠️'}</div>
                    <h3 className="text-2xl font-bold">{resultState === 'safe' ? 'Clear for Access' : 'Potential Threat'}</h3>
                    <p className="text-brand-dim text-sm">
                      {resultData?.message ||
                        (resultState === 'safe'
                          ? 'No malicious fingerprints detected on this host. Proceed with standard caution.'
                          : 'This domain matches patterns used in recent credential harvesting campaigns.')}
                    </p>
                    {resultData && (
                      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                        <p className="mb-2 text-[11px] uppercase tracking-[1px] text-brand-dim">Analysis Summary</p>
                        <p className="mb-3 text-sm text-white">{resultData.summary}</p>
                        <p className="mb-2 text-sm text-brand-dim">
                          <span className="font-semibold text-white">Type:</span> {resultData.phishingType}
                        </p>
                        <p className="mb-2 break-all text-sm text-brand-dim">
                          <span className="font-semibold text-white">Checked As:</span> {resultData.normalizedUrl}
                        </p>
                        {resultData.matchedKeywords.length > 0 && (
                          <p className="mb-2 text-sm text-brand-dim">
                            <span className="font-semibold text-white">Keywords:</span> {resultData.matchedKeywords.join(', ')}
                          </p>
                        )}
                        {resultData.matchedBrands.length > 0 && (
                          <p className="mb-2 text-sm text-brand-dim">
                            <span className="font-semibold text-white">Brands:</span> {resultData.matchedBrands.join(', ')}
                          </p>
                        )}
                        <p className="mb-2 text-sm text-brand-dim">
                          <span className="font-semibold text-white">Found By:</span>{' '}
                          {resultData.decisionSource === 'heuristic_override' ? 'Heuristic safety rules + ML' : 'Machine learning model'}
                        </p>
                        <div className="space-y-2">
                          {resultData.findings.map((finding, index) => (
                            <p key={index} className="text-sm text-brand-dim">
                              - {finding}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-white/5 pt-5">
              <div className="flex justify-between text-[12px] font-bold mb-2">
                <span className="text-brand-dim">Confidence Score</span>
                <span className="text-white">{resultData?.confidence || 0}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${resultData?.confidence || 0}%` }}
                  className={`h-full transition-colors duration-500 rounded-full ${
                    resultData?.status === 'PHISHING' ? 'bg-brand-danger' : 'bg-brand-accent'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-[60px] px-6 md:px-12 flex items-center justify-between border-t border-white/5 text-[12px] text-brand-dim">
        <div>Student Project - Phishing Detection System</div>
        <div className="hidden sm:block">Rasulov Abdulaziz (U2110237) &bull; Umurzaqov Bekhruz (U2110278)</div>
      </footer>

      <AnimatePresence>
        {activeAuthor && (
          <>
            <motion.button
              type="button"
              aria-label="Close author sheet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveAuthorId(null)}
              className="fixed inset-0 z-[70] bg-black/55 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.9 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-[80] mx-auto w-full max-w-[760px] px-3 pb-3"
            >
              <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0a0d]/95 shadow-[0_-24px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
                <div className="mx-auto mt-3 h-1.5 w-14 rounded-full bg-white/12" />
                <div className="relative px-5 pb-6 pt-5 sm:px-6">
                  <button
                    type="button"
                    onClick={() => setActiveAuthorId(null)}
                    className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-cyan-300/20 hover:text-cyan-200"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                    <motion.div
                      initial={{ scale: 0.88, y: 14, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      transition={{ duration: 0.32, delay: 0.06 }}
                      className="relative h-32 w-32 overflow-hidden rounded-[28px] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:h-40 sm:w-40"
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,242,255,0.18),transparent_55%)]" />
                      <img src={activeAuthor.photo} alt={activeAuthor.name} className="h-full w-full object-cover" />
                    </motion.div>

                    <motion.div
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.28, delay: 0.12 }}
                      className="mt-5 w-full"
                    >
                      <p className="mb-2 text-[11px] uppercase tracking-[1.2px] text-cyan-200/70">Project Author</p>
                      <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-[30px]">{activeAuthor.name}</h3>
                      <p className="mt-1 text-sm font-medium text-cyan-200/85">{activeAuthor.id}</p>
                    </motion.div>

                    <motion.div
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.28, delay: 0.18 }}
                      className="mt-5 grid w-full gap-3 sm:grid-cols-[1.1fr_0.9fr]"
                    >
                      <div className="rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
                        <p className="text-[10px] uppercase tracking-[1px] text-brand-dim">Role</p>
                        <p className="mt-2 text-base font-medium text-white">{activeAuthor.role}</p>
                      </div>
                      <div className="rounded-[22px] border border-cyan-300/12 bg-cyan-300/[0.06] p-4">
                        <p className="text-[10px] uppercase tracking-[1px] text-cyan-100/70">Contribution</p>
                        <p className="mt-2 text-sm leading-6 text-white/88">{activeAuthor.bio}</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
