import { useEffect, useState } from 'react';
import { vscode } from './utilities/vscode';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [selectedCode, setSelectedCode] = useState<string>("");
  const [hint, setHint] = useState<string>("Highlight some code to begin architectural analysis.");
  const [xp, setXp] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    const message = event.data;
    
    // 1. THIS IS THE MOST IMPORTANT LOG:
    // If you don't see this in the WEBVIEW CONSOLE, the bridge is broken.
    console.log("RAW MESSAGE RECEIVED IN REACT:", message);

    if (message.command === 'receiveHint') {
      // 2. Use 'includes' instead of 'startsWith' to avoid hidden character issues
      if (typeof message.text === 'string' && message.text.includes("Analyzing:")) {
        const codeOnly = message.text.split("Analyzing:")[1];
        console.log("Setting Selected Code to:", codeOnly);
        setSelectedCode(codeOnly);
      } else {
        setHint(message.text);
        setXp(prev => Math.min(prev + 10, 100));
        setIsLoading(false); 
      }
    }
  };

  window.addEventListener('message', handleMessage);
  
  // 3. Tell the backend we are ready
  vscode.postMessage({ command: 'webviewReady' });

  return () => window.removeEventListener('message', handleMessage);
}, []); // Keep this empty so it only runs once

  const requestHint = () => {
    if (!selectedCode) return;
    setIsLoading(true);
    vscode.postMessage({ command: 'requestHint', code: selectedCode });
  };

  return (
    <div className="p-4 flex flex-col gap-6 text-vscode-fg font-sans min-h-screen">
      <header className="flex justify-between items-center border-b border-gray-700 pb-2">
        <h1 className="text-xl font-bold">Mirror Architect</h1>
        <span className="text-xs bg-blue-600 px-2 py-1 rounded-full text-white font-mono">
          XP: {xp}%
        </span>
      </header>

      {/* 1. Syntax Highlighted Selection */}
      <section className="flex flex-col gap-2">
        <h2 className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Active Blueprint</h2>
        <div className="rounded-md overflow-hidden border border-gray-800 text-[11px]">
          <SyntaxHighlighter 
            language="typescript" 
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '12px', background: 'transparent' }}
          >
            {selectedCode || "// Select a block of code in the editor..."}
          </SyntaxHighlighter>
        </div>
      </section>

      {/* 2. Architectural Insight Box */}
      <section className="bg-vscode-bg rounded-lg p-4 border-l-4 border-blue-500 shadow-lg">
        <h2 className="text-[10px] uppercase text-blue-400 font-bold mb-2">Architect's Advice</h2>
        <p className="text-sm italic leading-relaxed">
          {isLoading ? "Consulting the Gemini oracle..." : `"${hint}"`}
        </p>
      </section>

      {/* 3. Action Button */}
      <button 
        onClick={requestHint}
        // disabled={isLoading || !selectedCode}
        className={`py-3 rounded font-bold transition-all ${
          // isLoading || !selectedCode 
          //   ? 'bg-gray-700 opacity-50 cursor-not-allowed' 
          /*   : */'bg-vscode-accent hover:opacity-90 active:scale-95'
        }`}
      >
        {isLoading ? "Thinking..." : "Get Architectural Hint"}
      </button>

      {/* 4. Experience Bar */}
      <div className="mt-auto pt-4">
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
            style={{ width: `${xp}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;