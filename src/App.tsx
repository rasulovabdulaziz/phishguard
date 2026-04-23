/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Zap, 
  Cpu, 
  Lock, 
  MousePointer2,
  Github,
  Linkedin,
  Mail,
  User
} from 'lucide-react';

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

export default function App() {
  const [url, setUrl] = useState('');
  const [resultState, setResultState] = useState<ResultState>('idle');
  const [resultData, setResultData] = useState<ResultData | null>(null);

  const handleCheck = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;

    setResultState('analyzing');

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
      {/* Navbar */}
      <nav className="h-16 flex items-center justify-between px-6 md:px-12 border-b border-white/5 bg-brand-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-accent rounded-md" />
          <span className="text-xl font-bold tracking-tight text-white">PhishGuard</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-dim">
          <a href="#about" className="hover:text-white transition-colors">Platform</a>
          <a href="#features" className="hover:text-white transition-colors">Resources</a>
          <a href="#authors" className="hover:text-white transition-colors">Enterprise</a>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
        {/* Left Column: Hero + Content */}
        <div className="space-y-10">
          <section id="hero">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-[56px] font-extrabold leading-[1.1] mb-4 hero-gradient-text">
                Detect Phishing<br />Websites Instantly
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

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Fast Detection", desc: "Real-time analysis under 200ms." },
              { title: "ML Driven", desc: "Trained on 10M+ known threats." },
              { title: "Secure", desc: "Zero-log privacy infrastructure." },
              { title: "Easy to Use", desc: "Simple browser-based interface." }
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group cursor-default">
                <h4 className="text-[13px] font-bold text-white mb-1 group-hover:text-brand-accent transition-colors">{item.title}</h4>
                <p className="text-[11px] text-brand-dim leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Author Section */}
          <div id="authors" className="space-y-4 pt-6">
            <h4 className="text-[11px] uppercase tracking-[1px] font-bold text-brand-dim">Project Authors</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "Rasulov Abdulaziz", id: "U2110237" },
                { name: "Umurzaqov Bekhruz", id: "U2110278" }
              ].map((author, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-brand-dim" />
                  </div>
                  <div className="author-info">
                    <h5 className="text-sm font-semibold text-white">{author.name}</h5>
                    <p className="text-[12px] text-brand-dim">{author.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Result Panel */}
        <div className="lg:sticky lg:top-24">
          <div className="min-h-[420px] rounded-[24px] glass p-8 flex flex-col gap-6 relative overflow-hidden glow-cyan">
            {resultState === 'analyzing' && (
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent scanning-animation" />
            )}
            
            <div className="flex justify-between items-center">
              <span className={`status-badge px-3 py-1.5 rounded-full text-[12px] font-bold tracking-widest uppercase border ${
                resultState === 'idle' ? 'bg-white/10 text-brand-dim border-transparent' :
                resultState === 'analyzing' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' :
                resultState === 'safe' ? 'bg-brand-safe/10 text-brand-safe border-brand-safe/20' :
                'bg-brand-danger/10 text-brand-danger border-brand-danger/20'
              }`}>
                {resultState === 'idle' ? 'Awaiting Input' : 
                 resultState === 'analyzing' ? 'Analyzing...' : 
                 resultState === 'safe' ? 'Verified Safe' : 'Phishing Detected'}
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
                      {resultState === 'analyzing' ? 'Performing deep signature analysis...' : 'Enter a URL to begin real-time threat assessment.'}
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
                      {resultData?.message || (
                        resultState === 'safe'
                          ? 'No malicious fingerprints detected on this host. Proceed with standard caution.'
                          : 'This domain matches patterns used in recent credential harvesting campaigns.'
                      )}
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
                          <span className="font-semibold text-white">Found By:</span> {resultData.decisionSource === 'heuristic_override' ? 'Heuristic safety rules + ML' : 'Machine learning model'}
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

            {/* Confidence Bar */}
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
        <div>Student Project – Phishing Detection System</div>
        <div className="hidden sm:block">
          Rasulov Abdulaziz (U2110237) &bull; Umurzaqov Bekhruz (U2110278)
        </div>
      </footer>
    </div>
  );
}
