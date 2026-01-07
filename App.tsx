import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ServerNode, ServerStatus, GameState, DifficultyLevel, ServerDifficulty } from './types';
import Terminal from './components/Terminal';
import HackerOverlay from './components/HackerOverlay';
import { 
  Terminal as TerminalIcon, 
  ShieldAlert, 
  Cpu, 
  Globe, 
  ExternalLink, 
  Github, 
  Wifi, 
  Lock, 
  Zap,
  Activity,
  AlertCircle,
  Database,
  Search,
  RefreshCw
} from 'lucide-react';

const GITHUB_URL = "https://github.com/gtkthecoder";

const ALL_POTENTIAL_SERVERS: ServerNode[] = [
  { id: '1', name: 'Onyx_Relay_Alpha', ip: '194.25.0.12', location: 'EU_WEST', difficulty: 'EASY', status: ServerStatus.ONLINE, x: 0, y: 0, isSuppressed: false },
  { id: '2', name: 'Cortex_Mainframe', ip: '104.18.2.1', location: 'US_EAST', difficulty: 'MEDIUM', status: ServerStatus.ONLINE, x: 0, y: 0, isSuppressed: false },
  { id: '3', name: 'Neon_Spire_Grid', ip: '210.140.0.8', location: 'ASIA_NORTH', difficulty: 'HARD', status: ServerStatus.ONLINE, x: 0, y: 0, isSuppressed: false },
  { id: '4', name: 'Aether_Vault_04', ip: '185.12.0.44', location: 'EU_CENTRAL', difficulty: 'MEDIUM', status: ServerStatus.ONLINE, x: 0, y: 0, isSuppressed: false },
  { id: '5', name: 'Vortex_Core_Zero', ip: '5.200.0.1', location: 'ARCTIC_ZONE', difficulty: 'PRO', status: ServerStatus.ONLINE, x: 0, y: 0, isSuppressed: false },
  { id: '6', name: 'Nebula_Cloud_Net', ip: '54.239.0.1', location: 'LATAM_SOUTH', difficulty: 'HARD', status: ServerStatus.ONLINE, x: 0, y: 0, isSuppressed: false },
  { id: '7', name: 'Coral_Link_Hub', ip: '1.1.1.1', location: 'OCEANIA_EAST', difficulty: 'MEDIUM', status: ServerStatus.ONLINE, x: 0, y: 0, isSuppressed: false },
  { id: '8', name: 'Savanna_Relay_01', ip: '196.25.1.1', location: 'AFRICA_SOUTH', difficulty: 'EASY', status: ServerStatus.ONLINE, x: 0, y: 0, isSuppressed: false },
  { id: '9', name: 'Titan_Heavy_Storage', ip: '45.12.33.1', location: 'US_WEST', difficulty: 'PRO', status: ServerStatus.ONLINE, x: 0, y: 0, isSuppressed: false },
  { id: '10', name: 'Ghost_Protocol_7', ip: '99.99.99.9', location: 'HIDDEN', difficulty: 'PRO', status: ServerStatus.ONLINE, x: 0, y: 0, isSuppressed: false },
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    difficulty: null,
    detectionLevel: 0,
    hackedCount: 0,
    totalServers: 0,
    isGameOver: false,
    isWarningAccepted: false,
    isTutorialCompleted: false
  });

  const [servers, setServers] = useState<ServerNode[]>([]);
  const [activeServer, setActiveServer] = useState<ServerNode | null>(null);
  const [log, setLog] = useState<string[]>(["SYSTEM_READY", "HANDSHAKE_COMPLETE", "CORE_V1_STABLE_LOADED"]);
  const detectionRef = useRef(0);

  useEffect(() => {
    if (!gameState.difficulty) return;

    let filtered: ServerNode[] = [];
    if (gameState.difficulty === 'EASY') {
      filtered = ALL_POTENTIAL_SERVERS.filter(s => s.difficulty === 'EASY' || s.difficulty === 'MEDIUM');
    } else if (gameState.difficulty === 'MEDIUM') {
      filtered = ALL_POTENTIAL_SERVERS.filter(s => s.difficulty !== 'PRO');
    } else if (gameState.difficulty === 'HARD') {
      filtered = ALL_POTENTIAL_SERVERS.filter(s => s.difficulty !== 'EASY');
    } else {
      filtered = ALL_POTENTIAL_SERVERS.filter(s => s.difficulty === 'HARD' || s.difficulty === 'PRO');
    }

    setServers(filtered);
    setGameState(prev => ({ ...prev, totalServers: filtered.length }));
  }, [gameState.difficulty]);

  useEffect(() => {
    if (!gameState.isWarningAccepted || !gameState.difficulty || !gameState.isTutorialCompleted || gameState.isGameOver) return;

    const interval = setInterval(() => {
      let baseIncrease = 0.05;
      if (gameState.difficulty === 'MEDIUM') baseIncrease = 0.15;
      if (gameState.difficulty === 'HARD') baseIncrease = 0.45;
      if (gameState.difficulty === 'NIGHTMARE') baseIncrease = 1.0;
      
      const suppressionBonus = servers.filter(s => s.isSuppressed).length * 0.08;
      const finalIncrease = Math.max(0.01, baseIncrease - suppressionBonus);

      detectionRef.current = Math.min(100, detectionRef.current + finalIncrease);
      setGameState(prev => ({ ...prev, detectionLevel: detectionRef.current }));

      if (detectionRef.current >= 100) {
        setGameState(prev => ({ ...prev, isGameOver: true }));
        clearInterval(interval);
      }

      // Random fake logs
      if (Math.random() > 0.95) {
        const fakeMsgs = ["TRACE_ATTEMPT_BLOCKED", "ENCRYPTING_NODE_DATA", "BYPASSING_WATCHDOG", "UPLOADING_SHELLCODE_V1", "BYPASSING_HANDSHAKE"];
        setLog(prev => [fakeMsgs[Math.floor(Math.random()*fakeMsgs.length)], ...prev].slice(0, 15));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isWarningAccepted, gameState.difficulty, gameState.isTutorialCompleted, gameState.isGameOver, servers]);

  const maxSuppression = useMemo(() => {
    if (gameState.difficulty === 'EASY') return 1;
    if (gameState.difficulty === 'MEDIUM') return 2;
    if (gameState.difficulty === 'HARD') return 3;
    return 0;
  }, [gameState.difficulty]);

  const toggleSuppression = (serverId: string) => {
    setServers(prev => {
      const target = prev.find(s => s.id === serverId);
      if (!target || target.status !== ServerStatus.COMPROMISED) return prev;
      const currentCount = prev.filter(s => s.isSuppressed).length;
      if (!target.isSuppressed && currentCount >= maxSuppression) return prev;
      return prev.map(s => s.id === serverId ? { ...s, isSuppressed: !s.isSuppressed } : s);
    });
  };

  const onHackSuccess = (serverId: string) => {
    setServers(prev => prev.map(s => s.id === serverId ? { ...s, status: ServerStatus.COMPROMISED } : s));
    setGameState(prev => {
      const newHackedCount = prev.hackedCount + 1;
      const total = prev.totalServers;
      // Trigger game over if all servers are hacked
      return { 
        ...prev, 
        hackedCount: newHackedCount,
        isGameOver: newHackedCount === total ? true : prev.isGameOver
      };
    });
    setLog(prev => ["BREACH_SUCCESSFUL_//_NODE_TAKEN", ...prev]);
    setActiveServer(null);
  };

  const onHackFail = () => {
    let penalty = 15;
    if (gameState.difficulty === 'HARD') penalty = 30;
    if (gameState.difficulty === 'NIGHTMARE') penalty = 50;
    detectionRef.current = Math.min(100, detectionRef.current + penalty);
    setGameState(prev => ({ ...prev, detectionLevel: detectionRef.current }));
    setLog(prev => ["BREACH_FAILED_//_TRACE_DUMP_DETECTION", ...prev]);
    setActiveServer(null);
  };

  const handleServerClick = (server: ServerNode) => {
    if (server.status === ServerStatus.ONLINE && !gameState.isGameOver) {
      setActiveServer(server);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#020202] text-[#00ff41] font-mono flex flex-col p-6 select-none overflow-hidden">
      <HackerOverlay 
        gameState={gameState} 
        onAcceptWarning={() => setGameState(prev => ({...prev, isWarningAccepted: true}))} 
        onSelectDifficulty={(level) => setGameState(prev => ({ ...prev, difficulty: level }))}
        onCompleteTutorial={() => setGameState(prev => ({ ...prev, isTutorialCompleted: true }))}
        onRestart={() => window.location.reload()}
      />

      {/* V1 UI Header */}
      <header className="flex justify-between items-end border-b-4 border-[#00ff41] pb-6 mb-8 relative">
        <div className="flex items-center gap-8">
          <div className="p-5 bg-[#00ff41]/5 border-2 border-[#00ff41] shadow-[0_0_25px_rgba(0,255,65,0.3)] animate-pulse">
            <TerminalIcon className="w-14 h-14" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none glitch">QUANTUM_BREACH <span className="not-italic text-white opacity-20">V1</span></h1>
            <div className="flex gap-6 text-[11px] mt-3 font-black uppercase tracking-widest">
              <span className="text-white/40 italic">CORE_V1_STABLE</span>
              <span className="bg-[#00ff41] text-black px-3 py-1 shadow-[0_0_10px_rgba(0,255,65,0.4)]">DIFFICULTY: {gameState.difficulty || '...'}</span>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-white flex items-center gap-2 text-[#00ff41]/60">
                <Github className="w-3 h-3" /> GTKTHECODER
              </a>
            </div>
          </div>
        </div>

        <div className="flex gap-12 items-end">
          <div className="text-right">
            <div className="text-[10px] opacity-40 uppercase tracking-[0.4em] font-black">Control_Index</div>
            <div className="text-4xl font-black italic">{gameState.hackedCount} / {gameState.totalServers} NODES</div>
          </div>
          <div className="w-96 space-y-3">
            <div className="flex justify-between text-[11px] uppercase font-black tracking-[0.2em]">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" /> TRACE_SIGNATURE
              </span>
              <span className={gameState.detectionLevel > 60 ? 'text-red-600 animate-bounce' : 'text-white'}>
                {gameState.detectionLevel.toFixed(1)}%
              </span>
            </div>
            <div className="h-8 bg-black border-2 border-[#00ff41]/40 relative overflow-hidden p-1 shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
              <div 
                className={`h-full transition-all duration-1000 ${
                  gameState.detectionLevel > 80 ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.7)]' : 
                  gameState.detectionLevel > 50 ? 'bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)]' : 'bg-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.5)]'
                }`}
                style={{ width: `${gameState.detectionLevel}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex gap-8 overflow-hidden">
        <aside className="w-96 flex flex-col gap-6">
          <div className="border-4 border-[#00ff41]/20 p-6 bg-black/80 flex-grow shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden">
            {/* Warning glitch overlay when detection is high */}
            {gameState.detectionLevel > 50 && (
              <div className="absolute inset-0 z-10 bg-red-600/10 animate-pulse pointer-events-none flex items-center justify-center p-4">
                <div className="text-red-600 text-[10px] font-black uppercase text-center border-2 border-red-600 p-2 bg-black">
                   [!!] CRITICAL_TRACE_LEVEL_DETECTED [!!]<br/>
                   REBOOT KERNEL ADVISED (HACK NODES NOW)
                </div>
              </div>
            )}

            <h2 className="text-md font-black border-b-2 border-[#00ff41]/30 pb-4 mb-8 flex items-center gap-3 uppercase tracking-widest italic text-white/90">
              <ShieldAlert className="w-6 h-6 text-[#00ff41]" /> SUPPRESSION_UNIT_V1
            </h2>
            
            <div className="mb-10">
              <div className="text-[11px] opacity-40 mb-3 uppercase font-black tracking-widest text-white">Active_Unit_Slots:</div>
              <div className="flex gap-2">
                {Array.from({ length: maxSuppression || 1 }).map((_, i) => (
                  <div key={i} className={`h-4 flex-grow border-2 shadow-lg transition-all ${i < servers.filter(s => s.isSuppressed).length ? 'bg-blue-600 border-blue-400 animate-pulse shadow-blue-500/30' : 'border-[#00ff41]/10 bg-black/50'}`} />
                ))}
                {maxSuppression === 0 && <div className="text-[10px] text-purple-600 font-black italic p-2 border border-purple-900 bg-purple-900/10">NIGHTMARE_MODE_RESTRICTION</div>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] opacity-30 font-black uppercase mb-6 tracking-[0.3em] flex items-center gap-2">
                <Activity className="w-4 h-4" /> SYSTEM_STREAM_LOGS
              </h3>
              <div className="h-64 overflow-hidden mask-fade-bottom">
                {log.map((msg, i) => (
                  <div key={i} className="text-[10px] opacity-70 mb-2 font-mono flex gap-2 animate-in slide-in-from-left duration-300">
                    <span className="text-[#00ff41] font-black">[{new Date().toLocaleTimeString().split(' ')[0]}]</span> 
                    <span className="text-white/80">{msg}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-[#00ff41]/10 text-[9px] opacity-30 font-black italic">
               KERNEL_V1_STABLE // GTKTHECODER_ENGINES
            </div>
          </div>
        </aside>

        <section className="flex-grow border-4 border-[#00ff41]/10 bg-black/60 p-10 overflow-y-auto shadow-[inset_0_0_80px_rgba(0,255,65,0.02)] relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servers.map(server => (
              <div 
                key={server.id}
                onClick={() => handleServerClick(server)}
                className={`group relative p-8 border-4 transition-all duration-500 cursor-pointer overflow-hidden ${
                  server.status === ServerStatus.COMPROMISED 
                    ? 'border-[#00ff41] shadow-[0_0_30px_rgba(0,255,65,0.1)] bg-[#00ff41]/5' 
                    : 'border-[#00ff41]/20 hover:border-[#00ff41] hover:translate-y-[-5px] hover:shadow-[0_10px_30px_rgba(0,255,65,0.1)]'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className={`text-xl font-black tracking-tighter uppercase ${server.status === ServerStatus.COMPROMISED ? 'text-[#00ff41]' : 'text-white/90'}`}>
                      {server.name}
                    </h3>
                    <p className="text-[10px] opacity-40 font-mono italic mt-1 font-black">{server.ip} // {server.location}</p>
                  </div>
                  <div className={`p-3 border-2 transition-colors ${server.status === ServerStatus.COMPROMISED ? 'bg-[#00ff41]/20 border-[#00ff41]' : 'bg-[#00ff41]/5 border-[#00ff41]/10'}`}>
                    {server.status === ServerStatus.COMPROMISED ? <Database className="w-6 h-6 text-[#00ff41]" /> : <Wifi className="w-6 h-6" />}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="border-2 border-[#00ff41]/10 p-3 text-center bg-black/90">
                    <div className="text-[9px] opacity-30 uppercase font-black mb-1">Node_Rank</div>
                    <div className={`text-[12px] font-black italic ${server.difficulty === 'PRO' ? 'text-red-500' : 'text-[#00ff41]'}`}>{server.difficulty}</div>
                  </div>
                  <div className="border-2 border-[#00ff41]/10 p-3 text-center bg-black/90">
                    <div className="text-[9px] opacity-30 uppercase font-black mb-1">State</div>
                    <div className="text-[12px] font-black uppercase tracking-widest">{server.status}</div>
                  </div>
                </div>

                {server.status === ServerStatus.COMPROMISED && (
                  <div className="pt-6 border-t-2 border-[#00ff41]/10 flex justify-between items-center">
                    <span className={`text-[10px] font-black italic uppercase ${server.isSuppressed ? 'text-blue-400' : 'text-white/40'}`}>
                      {server.isSuppressed ? 'PROTOCOL: ACTIVE' : 'PROTOCOL: OFFLINE'}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSuppression(server.id); }}
                      className={`px-5 py-2 text-[10px] font-black border-2 transition-all uppercase tracking-widest ${
                        server.isSuppressed ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'border-blue-600/40 text-blue-500 hover:bg-blue-600/20'
                      }`}
                    >
                      {server.isSuppressed ? 'SUSPEND' : 'ENGAGE'}
                    </button>
                  </div>
                )}
                
                {server.status === ServerStatus.ONLINE && (
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute inset-0 flex items-center justify-center bg-black/90 p-6 border-4 border-[#00ff41]">
                    <div className="text-center">
                      <Search className="w-10 h-10 mx-auto mb-4 animate-bounce text-[#00ff41]" />
                      <span className="text-sm font-black tracking-[0.4em] uppercase text-[#00ff41] italic underline underline-offset-8 decoration-white/20">INITIATE_V1_PENETRATION</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {activeServer && (
        <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-8 backdrop-blur-3xl">
           <Terminal 
            server={activeServer} 
            gameDifficulty={gameState.difficulty || 'EASY'}
            suppressionPower={servers.filter(s => s.isSuppressed).length}
            onSuccess={() => onHackSuccess(activeServer.id)}
            onFail={onHackFail}
            onCancel={() => setActiveServer(null)}
          />
        </div>
      )}

      <footer className="mt-8 flex justify-between items-center text-[11px] opacity-40 font-black tracking-[0.4em] border-t-4 border-[#00ff41]/30 pt-6 uppercase italic">
        <div className="flex gap-12">
          <div className="flex items-center gap-3 text-[#00ff41]"><Activity className="w-5 h-5" /> ENCRYPTION: GTK_SHA512_V1</div>
          <div className="flex items-center gap-3 font-bold hover:text-white transition-colors">
            <Github className="w-5 h-5" /> <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">BY_GTKTHECODER_GITHUB_CENTRAL</a>
          </div>
        </div>
        <div className="flex gap-10 items-center">
          <span className="text-white/40 not-italic">V1_STABLE_BUILD</span>
          <span className="animate-pulse text-[#00ff41] flex items-center gap-2 font-black">
             <RefreshCw className="w-4 h-4 animate-spin-slow" /> SYSTEM_HEARTBEAT_V1_OK
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
