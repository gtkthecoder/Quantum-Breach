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

const HackerOverlay: React.FC<HackerOverlayProps> = ({
  gameState,
  onAcceptWarning,
  onSelectDifficulty,
  onCompleteTutorial,
  onRestart
}) => {
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
                {/* 🔧 FIX: JSX-safe arrows */}
                <span className="text-[#00ff41] opacity-40">{">>"}</span>
                <span>{line}</span>
              </div>
            ))}
            {bootText.length === 9 && (
              <div className="text-[#00ff41] animate-pulse font-black mt-2 underline italic">
                SYSTEM_READY_FOR_BREACH_INJECTION
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 mb-10 text-[#00ff41] border-t border-[#00ff41]/20 pt-8">
            <ShieldAlert className="w-16 h-16 animate-pulse" />
            <div>
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none italic">
                QUANTUM_BREACH <span className="text-white text-lg not-italic opacity-50">V1</span>
              </h1>
              <p className="text-[9px] opacity-70 mt-2 tracking-[0.5em] font-black uppercase text-white/50">
                ENGINEERED BY GTKTHECODER
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed mb-12 opacity-90 font-mono border-l-4 border-red-600/40 pl-8">
            <p className="text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4" /> COMPLIANCE_SECURITY_CHECK
            </p>
            <p className="text-gray-400 text-xs italic">
              This is a V1 STABLE release of the GTKTHECODER typing simulation. All "hacks" are virtual scripts within a secure sandbox.
              Attempting to match this logic to real systems is prohibited.
            </p>
          </div>

          <button
            onClick={onAcceptWarning}
            className="w-full py-6 bg-[#00ff41] text-black font-black text-3xl hover:bg-white transition-all uppercase tracking-widest shadow-[0_0_40px_rgba(0,255,65,0.4)] transform hover:scale-[1.01] active:scale-95"
          >
            LOAD_KERNEL_//_BREACH
          </button>

          <div className="mt-10 flex justify-between items-center text-[10px] opacity-40 font-bold uppercase tracking-widest">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00ff41] underline flex items-center gap-2 transition-colors"
            >
              <Github className="w-4 h-4" /> GTKTHECODER_CENTRAL
            </a>
            <span>STABILITY: STABLE_V1</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default HackerOverlay;
