import React, { useState, useRef, useEffect } from 'react';
import { VideoProject, Channel, AvatarProfile, VoiceProfile } from '../../types';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Zap,
  Mic,
  Film,
  Download,
  Terminal,
  Volume2,
  VolumeX,
  Check,
  ChevronDown,
  Target,
} from 'lucide-react';

interface HermesChatFloatingProps {
  project: VideoProject;
  channel: Channel;
  avatar: AvatarProfile;
  voice: VoiceProfile;
  onApplyHook: (newHook: string, newTitle?: string) => void;
  onUpdateVoiceInstructions: (instructions: string) => void;
  onTriggerRender: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'hermes';
  text: string;
  actionPayload?: any;
  timestamp: string;
}

export const HermesChatFloating: React.FC<HermesChatFloatingProps> = ({
  project,
  channel,
  avatar,
  voice,
  onApplyHook,
  onUpdateVoiceInstructions,
  onTriggerRender,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceResponseEnabled, setIsVoiceResponseEnabled] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'hermes',
      text: `Greetings! I am Hermes, your autonomous production agent hooked into OmniTube AI Studio via Model Context Protocol (MCP). I am monitoring your channel "${channel.name}". Delegate tasks to me to write viral hooks, optimize pacing, or trigger renders.`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/hermes/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          projectTitle: project.title,
          channelNiche: channel.niche,
          activeHook: project.hook,
        }),
      });

      const data = await res.json();
      const hermesMsg: ChatMessage = {
        id: 'hermes-' + Date.now(),
        sender: 'hermes',
        text: data.reply || 'Task acknowledged, commander.',
        actionPayload: data.action || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, hermesMsg]);

      // If action returned, auto apply or make available
      if (data.action) {
        if (data.action.type === 'suggest_hook' && data.action.hook) {
          onApplyHook(data.action.hook, data.action.suggestedTitle);
        } else if (data.action.type === 'update_voice_instructions' && data.action.customInstructions) {
          onUpdateVoiceInstructions(data.action.customInstructions);
        } else if (data.action.type === 'trigger_render') {
          onTriggerRender();
        }
      }

      // Voice response
      if (isVoiceResponseEnabled && 'speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance(data.reply);
        utter.rate = 1.15;
        window.speechSynthesis.speak(utter);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'hermes-err-' + Date.now(),
          sender: 'hermes',
          text: `[MCP Gateway Error] Could not reach backend: ${err.message}`,
          timestamp: 'Now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDelegate = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Minimized Pill Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white rounded-full shadow-2xl shadow-purple-600/40 border border-white/20 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="font-bold text-xs">Hermes Agent</span>
          <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono border border-white/10 text-cyan-300">
            MCP Online
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 ${
            isMinimized
              ? 'w-72 h-14'
              : 'w-[360px] sm:w-[420px] h-[520px] max-h-[85vh]'
          }`}
          style={{
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(168, 85, 247, 0.2)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-950/80 via-neutral-900 to-cyan-950/80 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white flex items-center gap-1.5 leading-tight">
                  <span>Hermes Agent</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono block leading-tight">
                  MCP Protocol • Active Context
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-400">
              <button
                onClick={() => setIsVoiceResponseEnabled(!isVoiceResponseEnabled)}
                title={isVoiceResponseEnabled ? 'Audio replies ON' : 'Audio replies OFF'}
                className={`p-1.5 rounded-lg hover:text-white transition-colors ${
                  isVoiceResponseEnabled ? 'text-cyan-400 bg-cyan-950/60' : ''
                }`}
              >
                {isVoiceResponseEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/5"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Body when not minimized */}
          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                          : 'bg-neutral-800/90 text-neutral-100 rounded-bl-none border border-white/5 shadow-md'
                      }`}
                    >
                      {msg.sender === 'hermes' && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-300 font-semibold mb-1">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>Hermes AI</span>
                        </div>
                      )}
                      <p className="text-[12px] whitespace-pre-wrap">{msg.text}</p>

                      {/* Action Executed Card */}
                      {msg.actionPayload && (
                        <div className="mt-2.5 p-2 bg-neutral-950/80 rounded-xl border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>Action: {msg.actionPayload.type}</span>
                          </span>
                          <span className="text-emerald-400 font-bold">Applied ✓</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-neutral-500 font-mono mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-neutral-400 text-xs italic p-2 bg-neutral-950/40 rounded-xl border border-white/5 w-max">
                    <Bot className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    <span>Hermes is orchestrating tool actions...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Delegation Task Pills */}
              <div className="px-3 py-2 bg-neutral-950/80 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[11px]">
                <button
                  onClick={() => handleQuickDelegate('Hermes, ejecuta el ciclo completo del Agente Autónomo para el canal Emprendenmx')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shrink-0 flex items-center gap-1 font-semibold"
                >
                  <Bot className="w-3 h-3 text-amber-400" />
                  <span>Pipeline Emprendenmx</span>
                </button>
                <button
                  onClick={() => handleQuickDelegate('Hermes, audita a los top 3 competidores y extrae los hooks de sus 10 videos más vistos')}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 shrink-0 flex items-center gap-1"
                >
                  <Target className="w-3 h-3 text-rose-400" />
                  <span>Top 3 Competidores</span>
                </button>
                <button
                  onClick={() => handleQuickDelegate('Hermes, draft a 10x viral retention hook for this short')}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 shrink-0 flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>10x Hook</span>
                </button>
                <button
                  onClick={() => handleQuickDelegate('Hermes, adjust my voice instructions to sound more punchy and fast-paced')}
                  className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-white/10 shrink-0 flex items-center gap-1"
                >
                  <Mic className="w-3 h-3 text-emerald-400" />
                  <span>Tune Voice</span>
                </button>
              </div>

              {/* Input Box */}
              <div className="p-3 bg-neutral-950 border-t border-white/10 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Delegate a task to Hermes..."
                  className="flex-1 px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-neutral-100 text-xs focus:outline-none focus:border-purple-500 font-medium"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl transition-transform active:scale-95 shadow-md shadow-purple-600/30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
