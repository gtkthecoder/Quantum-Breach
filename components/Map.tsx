import React from 'react';
import { ServerNode, ServerStatus } from '../types';

interface MapProps {
  servers: ServerNode[];
  activeServerId: string | null;
  onServerClick: (server: ServerNode) => void;
}

const Map: React.FC<MapProps> = ({ servers, activeServerId, onServerClick }) => {
  return (
    <div className="w-full h-full relative">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none opacity-10">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border border-[#00ff41]" />
        ))}
      </div>

      {/* Fictional Global Map SVG (simplified) */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100">
        <path 
          d="M10,40 Q20,30 30,35 T50,45 T70,40 T90,50 L90,60 Q80,70 70,65 T50,75 T30,70 T10,80 Z" 
          fill="none" 
          stroke="#00ff41" 
          strokeWidth="0.5" 
        />
        <path 
          d="M20,10 Q40,15 60,10 T80,15 L80,25 Q60,30 40,25 T20,30 Z" 
          fill="none" 
          stroke="#00ff41" 
          strokeWidth="0.5" 
        />
      </svg>

      {/* Connection Lines for suppressed servers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
        {servers.filter(s => s.isSuppressed).map(s => (
          <g key={s.id}>
             <circle cx={s.x} cy={s.y} r="10" fill="none" stroke="#3b82f6" strokeWidth="0.2" className="animate-ping" />
          </g>
        ))}
      </svg>

      {/* Server Nodes */}
      {servers.map((server) => {
        const isCompromised = server.status === ServerStatus.COMPROMISED;
        const isActive = activeServerId === server.id;

        return (
          <div
            key={server.id}
            onClick={() => onServerClick(server)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              isActive ? 'scale-150 z-10' : 'scale-100 hover:scale-110'
            }`}
            style={{ left: `${server.x}%`, top: `${server.y}%` }}
          >
            <div className="relative group">
              <div 
                className={`w-4 h-4 rounded-full border-2 shadow-[0_0_15px_rgba(0,0,0,0.5)] ${
                  isCompromised 
                    ? 'bg-green-500 border-green-200' 
                    : server.isSuppressed ? 'bg-blue-500 border-blue-200' : 'bg-transparent border-[#00ff41]'
                } ${isActive ? 'animate-pulse' : ''}`}
              />
              
              {/* Tooltip on hover */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black border border-[#00ff41] p-2 text-[8px] z-30 min-w-[120px] shadow-2xl">
                <div className="font-bold uppercase text-blue-400">{server.name}</div>
                <div>IP: {server.ip}</div>
                <div>LVL: {server.difficulty}</div>
                <div>LOC: {server.location}</div>
                <div className="mt-1 text-yellow-400">STATUS: {server.status}</div>
                {isCompromised && (
                  <div className="text-green-400 mt-1">[SUPPRESSION: {server.isSuppressed ? 'ON' : 'OFF'}]</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Map;