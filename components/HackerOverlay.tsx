import React, { useState, useEffect } from 'react';
import { GameState, DifficultyLevel } from '../types';
import { ShieldAlert, AlertTriangle, RefreshCw, Cpu, Zap, Globe, Github, Info, ArrowRight, Skull, Terminal as TerminalIcon, CheckCircle } from 'lucide-react';

interface HackerOverlayProps {
  gameState: GameState;
  onAcceptWarning: () => void;
  onSelectDifficulty: (level: DifficultyLevel) => void;
  onCompleteTutorial: () => void;
  onRestart: () => void;
}

const GITHUB_URL = "https://github.com/gtkthecoder";

const HackerOverlay: React.FC<HackerOverlayProps> = ({ gameState, onAcceptWarning, onSelectDifficulty, onCompleteTutorial, onRestart }) => {
  const [bootText, setBootText] = useState<string[]>([]);
  
  useEffect(() => {
    if (!gameState.isWarningAccepted) {
      const messages = [
        "QUANTUM_BREACH CORE V1 // STABLE",
        "Copyright (C) 2024 GTKTHECODER_CORE_ENGINES",
        "CPU: 1024-bit Quantum-Cell Architecture... DETECTED",
        "Bypassing Global Encryption Matrix... DONE",
        "Establishing P2P Darknet Tunnel... SECURED",
        "Kernel Hijack Status: NOMINAL",
        "WARNING: ACCESSING CLASS-4 NETWORK DATA",
        "SYSTEM_ID: " + Math.random().toString(16).toUpperCase().substring(2, 10),
        "AUTHORIZATION_PENDING_//_REBOOT_ADVISED"
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < messages.length) {
          setBootText(prev => [...prev, messages[i]]);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [gameState.isWarningAccepted]);

  if (!gameState.isWarningAccepted) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-8 backdrop-blur-md">
        <div className="max-w-3xl w-full border-4 border-[#00ff41] p-12 bg-[#020202] shadow-[0_0_120px_rgba(0,255,65,0.4)] relative">
          <div className="flex flex-col gap-1 font-mono text-[10px] text-gray-600 mb-10 h-48 overflow-hidden bg-black/40 p-4 border border-[#00ff41]/20">
            {bootText.map((line, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-[#00ff41] opacity-40">>></span>
                <span>{line}</span>
              </div>
            ))}
            {bootText.length === 9 && <div className="text-[#00ff41] animate-pulse font-black mt-2 underline italic">SYSTEM_READY_FOR_BREACH_INJECTION</div>}
          </div>
          
          <div className="flex items-center gap-6 mb-10 text-[#00ff41] border-t border-[#00ff41]/20 pt-8">
            <ShieldAlert className="w-16 h-16 animate-pulse" />
            <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none italic">QUANTUM_BREACH <span className="text-white text-lg not-italic opacity-50">V1</span></h1>
              <p className="text-[9px] opacity-70 mt-2 tracking-[0.5em] font-black uppercase text-white/50">ENGINEERED BY GTKTHECODER</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm leading-relaxed mb-12 opacity-90 font-mono border-l-4 border-red-600/40 pl-8">
            <p className="text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4" /> COMPLIANCE_SECURITY_CHECK
            </p>
            <p className="text-gray-400 text-xs italic">This is a V1 STABLE release of the GTKTHECODER typing simulation. All "hacks" are virtual scripts within a secure sandbox. Attempting to match this logic to real systems is prohibited.</p>
          </div>

          <button 
            onClick={onAcceptWarning}
            className="w-full py-6 bg-[#00ff41] text-black font-black text-3xl hover:bg-white transition-all uppercase tracking-widest shadow-[0_0_40px_rgba(0,255,65,0.4)] transform hover:scale-[1.01] active:scale-95"
          >
            LOAD_KERNEL_//_BREACH
          </button>
          
          <div className="mt-10 flex justify-between items-center text-[10px] opacity-40 font-bold uppercase tracking-widest">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-[#00ff41] underline flex items-center gap-2 transition-colors">
              <Github className="w-4 h-4" /> GTKTHECODER_CENTRAL
            </a>
            <span>STABILITY: STABLE_V1</span>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState.difficulty) {
    const difficulties: {level: DifficultyLevel, color: string, bg: string, desc: string, icon: React.ReactNode, sup: string}[] = [
      { level: 'EASY', color: 'text-green-500', bg: 'border-green-500/30 hover:bg-green-500/10', desc: 'Short 5-10 char commands. Trace: 1.0x', icon: <Info className="w-6 h-6" />, sup: "Max 1 Suppression Unit" },
      { level: 'MEDIUM', color: 'text-blue-500', bg: 'border-blue-500/30 hover:bg-blue-500/10', desc: 'Shell commands 20-30 chars. Trace: 2.0x', icon: <Zap className="w-6 h-6" />, sup: "Max 2 Suppression Units" },
      { level: 'HARD', color: 'text-red-600', bg: 'border-red-600/30 hover:bg-red-600/10', desc: 'Logic loops 45-60 chars. Trace: 5.0x', icon: <AlertTriangle className="w-6 h-6" />, sup: "Max 3 Suppression Units" },
      { level: 'NIGHTMARE', color: 'text-purple-600', bg: 'border-purple-600/30 hover:bg-purple-600/10', desc: '100+ Char obfuscated PRO strings. NO SUPPRESSION.', icon: <Skull className="w-6 h-6" />, sup: "SUPPRESSION_UNIT: OFFLINE" },
    ];

    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-8 backdrop-blur-2xl">
        <div className="max-w-5xl w-full border-2 border-[#00ff41]/20 p-16 bg-[#050505] shadow-[0_0_150px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 p-4 opacity-5 font-black text-[120px] pointer-events-none select-none">V1</div>
          <h2 className="text-5xl font-black text-center mb-6 uppercase tracking-tighter italic text-[#00ff41]">SELECT_OPERATIONAL_LOAD</h2>
          <p className="text-center text-xs opacity-40 mb-16 font-mono uppercase tracking-[0.4em]">Establish terminal difficulty strength for gtkthecoder</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {difficulties.map((d) => (
              <button
                key={d.level}
                onClick={() => onSelectDifficulty(d.level)}
                className={`flex flex-col p-8 border-4 transition-all hover:translate-y-[-8px] group text-left ${d.bg} ${d.color} bg-black/60 relative`}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="text-3xl font-black uppercase tracking-widest">{d.level}</span>
                  {d.icon}
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed font-black h-12 uppercase mb-4 tracking-tighter">{d.desc}</p>
                <div className="text-[9px] font-black underline uppercase opacity-60 group-hover:opacity-100 mb-6 border-t border-current pt-2">{d.sup}</div>
                <div className="mt-auto flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                   <ArrowRight className="w-5 h-5" />
                   <span className="text-xs font-black tracking-widest italic uppercase underline">INIT_V1_SEQUENCE</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-xs opacity-40 hover:opacity-100 transition-opacity underline font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Github className="w-4 h-4" /> DEVELOPED_BY_GTKTHECODER_V1
             </a>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState.isTutorialCompleted) {
    const tutorials = [
      { title: "NODES_GRID", icon: <Globe className="w-10 h-10" />, body: "Global targets scaled by difficulty. Rank ranges from EASY to PRO. PRO nodes require extreme typing precision." },
      { title: "BREACH_SYNC", icon: <TerminalIcon className="w-10 h-10" />, body: "Payload appears ABOVE. Your decrypt MUST match BELOW. Any typo wastes critical milliseconds." },
      { title: "REBOOT_KERNEL", icon: <Zap className="w-10 h-10" />, body: "Trace levels climb fast. If TRACE hits 100%, you're compromised. REBOOT KERNEL (Compromise Nodes) to restore balance." },
      { title: "SUPPRESSION", icon: <ShieldAlert className="w-10 h-10" />, body: "Once hacked, nodes provide SUPPRESSION. They eat trace progress but slots are limited. Deploy wisely." }
    ];

    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-8 backdrop-blur-3xl">
        <div className="max-w-6xl w-full border-4 border-[#00ff41]/50 p-16 bg-[#020202] shadow-[0_0_120px_rgba(0,255,65,0.2)]">
          <div className="flex justify-between items-center mb-16 border-b-2 border-[#00ff41]/20 pb-10">
            <h2 className="text-6xl font-black uppercase tracking-tighter text-[#00ff41] italic">DEPLOYMENT_GUIDE <span className="text-white opacity-20 not-italic">V1</span></h2>
            <div className="text-[10px] opacity-50 font-black text-right uppercase tracking-[0.5em] flex items-center gap-6">
               <span className="leading-tight">CORE_V1<br/>BY_GTKTHECODER</span>
               <Github className="w-10 h-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {tutorials.map((t, i) => (
              <div key={i} className="flex flex-col gap-6 p-8 border-2 border-[#00ff41]/10 bg-black/80 hover:border-[#00ff41]/40 transition-all group">
                <div className="text-[#00ff41] group-hover:scale-125 transition-transform duration-500">{t.icon}</div>
                <h3 className="text-xl font-black border-b-2 border-[#00ff41]/30 pb-4 uppercase tracking-tighter italic">{t.title}</h3>
                <p className="text-[12px] leading-relaxed opacity-70 font-mono font-black uppercase tracking-tighter">{t.body}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={onCompleteTutorial}
            className="w-full py-8 border-4 border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all font-black text-4xl uppercase tracking-[1em] hover:shadow-[0_0_60px_rgba(0,255,65,0.5)]"
          >
            CONFIRM_AND_BREACH
          </button>
        </div>
      </div>
    );
  }

  if (gameState.isGameOver) {
    const isSuccess = gameState.hackedCount === gameState.totalServers;
    
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-8 backdrop-blur-2xl">
        {/* Victory Matrix Animation Overlay */}
        {isSuccess && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 flex gap-4 justify-around">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2 animate-bounce" style={{ animationDuration: `${Math.random() * 3 + 2}s`, animationDelay: `${Math.random()}s` }}>
                {Array.from({ length: 20 }).map((_, j) => (
                  <span key={j} className="text-[#00ff41] font-black text-2xl">{Math.floor(Math.random() * 2)}</span>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className={`max-w-4xl w-full border-8 p-20 text-center shadow-2xl relative ${isSuccess ? 'border-[#00ff41] shadow-[#00ff41]/20 bg-[#050505]/90' : 'border-red-600 shadow-red-600/40 bg-black/90 animate-pulse'}`}>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black px-10 py-3 border-2 border-inherit text-sm uppercase font-black tracking-[0.8em] z-10 text-white shadow-2xl">SESSION_TERMINATED</div>

          {isSuccess ? (
            <>
              <div className="flex justify-center mb-10">
                <CheckCircle className="w-32 h-32 text-[#00ff41] animate-pulse" />
              </div>
              <h2 className="text-8xl font-black mb-8 uppercase text-[#00ff41] tracking-tighter italic leading-none drop-shadow-[0_0_15px_rgba(0,255,65,0.5)]">GRID_DOMINATED</h2>
              <p className="mb-16 font-mono text-lg opacity-80 uppercase tracking-[0.4em] font-black underline underline-offset-8">V1_BREACH_COMPLETE // GTKTHECODER_ROOT_ESTABLISHED</p>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-10">
                <AlertTriangle className="w-32 h-32 text-red-600 animate-ping" />
              </div>
              <h2 className="text-8xl font-black mb-8 uppercase text-red-600 tracking-tighter italic leading-none glitch">TRACE_FATAL</h2>
              <p className="mb-6 font-mono text-red-400 font-black uppercase tracking-[0.6em] text-2xl">CORE_COMPROMISED</p>
              <p className="mb-16 font-mono text-xs opacity-50 uppercase tracking-widest font-black leading-relaxed">Network authorities have pinpointed your physical origin. Overwrite protocols failed. Terminal locked by central host.</p>
            </>
          )}

          <div className="grid grid-cols-2 gap-12 mb-16">
            <div className="border-4 border-[#00ff41]/20 p-10 bg-black/80 shadow-[inset_0_0_20px_rgba(0,255,65,0.05)]">
              <div className="text-[12px] opacity-40 uppercase mb-4 tracking-[0.5em] font-black text-white">Nodes_Hacked</div>
              <div className="text-7xl font-black text-[#00ff41]">{gameState.hackedCount}</div>
            </div>
            <div className="border-4 border-[#00ff41]/20 p-10 bg-black/80 shadow-[inset_0_0_20px_rgba(0,255,65,0.05)]">
              <div className="text-[12px] opacity-40 uppercase mb-4 tracking-[0.5em] font-black text-white">Loadout_V1</div>
              <div className={`text-3xl font-black uppercase tracking-widest ${
                gameState.difficulty === 'NIGHTMARE' ? 'text-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]' :
                gameState.difficulty === 'HARD' ? 'text-red-600' : 'text-[#00ff41]'
              }`}>{gameState.difficulty}</div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <button 
              onClick={onRestart}
              className="flex items-center justify-center gap-8 w-full py-8 bg-white text-black font-black text-4xl hover:bg-[#00ff41] transition-all uppercase tracking-[0.4em] shadow-2xl hover:translate-y-[-5px]"
            >
              <RefreshCw className="w-10 h-10" /> REBOOT_V1_CORE
            </button>
            <div className="flex justify-between px-2 text-[10px] opacity-40 uppercase font-black tracking-widest mt-4 italic">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white underline flex items-center gap-2">
                <Github className="w-4 h-4" /> GTKTHECODER_GITHUB
              </a>
              <span>STABILITY_VER: V1_FINAL</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default HackerOverlay;
