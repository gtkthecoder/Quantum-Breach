import React, { useState, useEffect, useRef } from 'react';
import { ServerNode, DifficultyLevel } from '../types';
import { generatePayload } from '../services/geminiService';
import { Loader2, ChevronRight, CheckCircle2, ShieldX, Terminal as TerminalIcon, ArrowLeft, Zap, Github } from 'lucide-react';

interface TerminalProps {
  server: ServerNode;
  gameDifficulty: DifficultyLevel;
  suppressionPower: number;
  onSuccess: () => void;
  onFail: () => void;
  onCancel: () => void;
}

const Terminal: React.FC<TerminalProps> = ({
  server,
  gameDifficulty,
  suppressionPower,
  onSuccess,
  onFail,
  onCancel
}) => {
  const [stages, setStages] = useState<string[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [showBonus, setShowBonus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCommands = async () => {
      setLoading(true);
      const payload = await generatePayload(server.difficulty, server.name);
      setStages(payload.slice(0, 3));

      let baseTime = 15;
      if (server.difficulty === 'MEDIUM') baseTime = 25;
      if (server.difficulty === 'HARD') baseTime = 40;
      if (server.difficulty === 'PRO') baseTime = 60;

      if (gameDifficulty === 'MEDIUM') baseTime *= 0.8;
      if (gameDifficulty === 'HARD') baseTime *= 0.6;
      if (gameDifficulty === 'NIGHTMARE') baseTime *= 0.4;

      const bonusTime = suppressionPower * 6;
      const totalTime = Math.max(8, Math.ceil(baseTime + bonusTime));

      setTimeLeft(totalTime);
      setMaxTime(totalTime);
      setLoading(false);
    };

    fetchCommands();
  }, [server, gameDifficulty, suppressionPower]);

  useEffect(() => {
    if (loading || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onFail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, timeLeft, onFail]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, currentStage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserInput(val);

    if (val === stages[currentStage]) {
      if (currentStage === stages.length - 1) {
        onSuccess();
      } else {
        const bonusAmount =
          gameDifficulty === 'EASY'
            ? 12
            : gameDifficulty === 'MEDIUM'
            ? 8
            : gameDifficulty === 'HARD'
            ? 5
            : 2;

        setTimeLeft(prev => prev + bonusAmount);
        setShowBonus(true);
        setTimeout(() => setShowBonus(false), 1000);

        setCurrentStage(prev => prev + 1);
        setUserInput('');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-24 border-8 border-[#00ff41] bg-black shadow-[0_0_120px_rgba(0,255,65,0.4)] relative">
        <div className="absolute top-4 left-4 text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">
          GTK_V1_INITIATING...
        </div>
        <Loader2 className="w-24 h-24 animate-spin mb-10 text-[#00ff41]" />
        <h2 className="text-4xl font-black tracking-[0.6em] animate-pulse uppercase italic">
          FORGING_EXPLOIT
        </h2>
        <p className="text-xs opacity-50 mt-6 font-mono font-black uppercase text-white/60">
          NODE: {server.ip} // RANK: {server.difficulty} // CORE_V1
        </p>
      </div>
    );
  }

  const target = stages[currentStage];

  return (
    <div className="w-full max-w-6xl bg-[#020202] border-8 border-[#00ff41] p-16 shadow-[0_0_150px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col gap-10">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="flex justify-between items-center border-b-4 border-[#00ff41]/40 pb-10 relative z-10">
        <div className="flex items-center gap-6">
          <button
            onClick={onCancel}
            className="p-4 border-2 border-red-600/50 hover:bg-red-600 hover:text-white transition-all group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            ABORT_SESSION
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TerminalIcon className="w-8 h-8 text-[#00ff41]" />
              <h3 className="text-3xl font-black tracking-widest uppercase italic leading-none">
                V1_BREACH: {server.name}
              </h3>
            </div>
            <p className="text-[12px] opacity-60 uppercase font-mono tracking-widest font-black">
              USER_ID:{' '}
              <span className="text-white underline">root@gtkthecoder</span> //
              LINK_STRENGTH:{' '}
              <span className="text-[#00ff41]">98.2%</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end relative">
          {showBonus && (
            <div className="absolute -top-12 right-0 text-blue-400 font-black animate-bounce flex items-center gap-2 text-xl tracking-tighter">
              <Zap className="w-6 h-6" /> TIME_RESTORED_V1
            </div>
          )}
          <div
            className={`text-8xl font-mono font-black italic tracking-tighter leading-none ${
              timeLeft < 10
                ? 'text-red-600 animate-pulse'
                : 'text-[#00ff41]'
            }`}
          >
            {timeLeft}s
          </div>
          <div className="text-[11px] font-black opacity-40 uppercase tracking-[0.5em] mt-3 italic text-white/50">
            BREACH_STABILITY_V1
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-10 relative z-10">
        {stages.map((_, i) => (
          <div key={i} className="flex items-center gap-6">
            <div
              className={`w-16 h-16 flex items-center justify-center border-4 transition-all duration-700 shadow-xl ${
                i < currentStage
                  ? 'bg-[#00ff41] border-[#00ff41] text-black shadow-[#00ff41]/20'
                  : i === currentStage
                  ? 'bg-black border-[#00ff41] text-[#00ff41] animate-pulse shadow-[#00ff41]/10 scale-110'
                  : 'bg-black border-gray-800 text-gray-800 opacity-30'
              }`}
            >
              {i < currentStage ? (
                <CheckCircle2 className="w-10 h-10" />
              ) : (
                <span className="text-2xl font-black italic">{i + 1}</span>
              )}
            </div>
            {i < stages.length - 1 && (
              <ChevronRight
                className={`w-8 h-8 ${
                  i < currentStage ? 'text-[#00ff41]' : 'text-gray-900'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-12 relative z-10">
        <div className="bg-black border-4 border-[#00ff41]/30 p-14 rounded-xl min-h-[220px] flex items-center justify-center text-center relative overflow-hidden group shadow-2xl">
          <div className="absolute top-3 left-6 text-[11px] text-[#00ff41]/50 uppercase tracking-[0.6em] font-black underline italic">
            {">>>_CORE_V1_PAYLOAD_HANDSHAKE"}
          </div>

          <div className="text-3xl font-mono tracking-[0.1em] leading-relaxed select-none break-all p-6 font-bold bg-[#00ff41]/5 border border-[#00ff41]/10 rounded shadow-inner">
            {target.split('').map((char, i) => {
              let color = 'text-gray-700';
              if (i < userInput.length) {
                color =
                  userInput[i] === char
                    ? 'text-[#00ff41] font-black drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]'
                    : 'text-red-600 bg-red-600/10 font-black animate-pulse';
              }
              return (
                <span
                  key={i}
                  className={`${color} transition-all duration-100`}
                >
                  {char}
                </span>
              );
            })}
            <span className="w-4 h-10 bg-[#00ff41] inline-block animate-pulse ml-3 align-middle shadow-[0_0_10px_rgba(0,255,65,1)]" />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[#00ff41] font-mono text-3xl animate-pulse font-black italic">
            ROOT@V1:~$
          </div>
          <input
            ref={inputRef}
            type="text"
            spellCheck={false}
            value={userInput}
            onChange={handleInputChange}
            placeholder="EXECUTE_DECRYPTION_INJECTION..."
            className="w-full bg-black border-4 border-[#00ff41]/50 p-10 pl-48 text-4xl font-mono focus:outline-none focus:border-[#00ff41] text-[#00ff41] placeholder:text-[#00ff41]/10 rounded-lg shadow-[inset_0_0_50px_rgba(0,255,65,0.05)] transition-all uppercase italic font-black"
            autoComplete="off"
          />
          <div className="absolute -bottom-6 right-2 text-[9px] font-black opacity-30 tracking-widest uppercase italic">
            BY_GTKTHECODER_ENGINES_V1
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-t-4 border-[#00ff41]/30 pt-12 mt-4 relative z-10 uppercase italic font-black">
        <div className="flex flex-col">
          <span className="text-[10px] opacity-40 uppercase tracking-[0.4em] mb-2 font-black">
            BREACH_INTEGRITY_V1
          </span>
          <div className="flex items-center gap-3 text-sm text-blue-400 font-black shadow-blue-500/10">
            <ShieldX className="w-6 h-6" />
            BYPASS_THRESHOLD:{' '}
            <span className="text-white font-black underline decoration-blue-500 underline-offset-4">
              {((currentStage + 1) / stages.length * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <a
          href="https://github.com/gtkthecoder"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-end group"
        >
          <span className="text-[11px] opacity-40 group-hover:opacity-100 transition-all flex items-center gap-3 underline uppercase font-black tracking-widest text-[#00ff41]">
            GTKTHECODER_GITHUB_CENTRAL
            <Github className="w-4 h-4" />
          </span>
          <span className="text-[9px] opacity-20 uppercase font-mono mt-2 tracking-widest">
            STABLE_V1_RELEASE_FINAL
          </span>
        </a>
      </div>
    </div>
  );
};

export default Terminal;
