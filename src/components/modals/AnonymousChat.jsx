import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, ShieldCheck, Sparkles, MessageSquare, AlertTriangle, 
  Dices, Smile, Heart, ThumbsUp, Flame, Volume2, VolumeX,
  Users, CheckCircle2, Music2
} from 'lucide-react';
import { 
  validateContent, generateAnonymousIdentity, 
  getChatMessages, saveChatMessage, updateMessageReaction 
} from '@/utils/chatModerator';

const QUICK_PROMPTS = [
  '🎸 What songs are we jamming to?',
  '🥁 Bringing my cajon and shakers!',
  '🎙️ Looking for vocalists to duet with',
  '☕ What time does the circle start?'
];

const COMMUNITY_BOT_REPLIES = [
  "Can't wait to jam together! Bringing extra guitar picks for everyone. 🎸",
  "That sounds super soulful! Let's definitely play that during the acoustic sunset set.",
  "Count me in on harmonies! See you at the jam circle. ✨",
  "Love the energy in this community! First time attending and already loving the vibe. 🎶",
  "I have that chord progression memorized, let's make it happen!"
];

export default function AnonymousChat({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentIdentity, setCurrentIdentity] = useState(null);
  const [moderationWarning, setModerationWarning] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [onlineCount, setOnlineCount] = useState(38);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const chatContainerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const isInitialMount = useRef(true);

  // Initialize identity and load messages
  useEffect(() => {
    // Check or generate identity
    const savedId = localStorage.getItem('reson_user_anon_identity');
    if (savedId) {
      try {
        setCurrentIdentity(JSON.parse(savedId));
      } catch {
        const fresh = generateAnonymousIdentity();
        setCurrentIdentity(fresh);
        localStorage.setItem('reson_user_anon_identity', JSON.stringify(fresh));
      }
    } else {
      const fresh = generateAnonymousIdentity();
      setCurrentIdentity(fresh);
      localStorage.setItem('reson_user_anon_identity', JSON.stringify(fresh));
    }

    setMessages(getChatMessages());

    // Randomize online jammers counter slightly
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.min(52, Math.max(28, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll ONLY the internal chat container, never window
  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
      return;
    }
    scrollToBottom(true);
  }, [messages.length]);

  // Audio tone on message send
  const playChime = (freq = 523.25) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtxRef.current = new AudioClass();
      }
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (!audioCtxRef.current) return;

      const now = audioCtxRef.current.currentTime;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  };

  // Roll new anonymous identity
  const handleRollIdentity = () => {
    const next = generateAnonymousIdentity();
    setCurrentIdentity(next);
    localStorage.setItem('reson_user_anon_identity', JSON.stringify(next));
    playChime(659.25);
  };

  // Send message with moderation validation
  const handleSendMessage = (textToSend = inputText) => {
    const text = textToSend.trim();
    if (!text) return;

    // Run Content Moderation Check for profanity, vulgarity & slogans
    const check = validateContent(text);
    if (check.isBlocked) {
      setModerationWarning(check.reason);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      playChime(220); // Low warning buzz
      return;
    }

    setModerationWarning('');

    const newMsg = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender: currentIdentity?.name || 'Anonymous Jammer',
      icon: currentIdentity?.icon || '🎸',
      gradient: currentIdentity?.gradient || 'from-violet-500 to-purple-600',
      text,
      time: 'Just now',
      isMe: true,
      reactions: {}
    };

    const updated = saveChatMessage(newMsg);
    setMessages(updated);
    setInputText('');
    playChime(587.33);

    // Simulated community member response after 1.8 seconds to keep chat alive
    setTimeout(() => {
      const botIdentity = generateAnonymousIdentity();
      const botText = COMMUNITY_BOT_REPLIES[Math.floor(Math.random() * COMMUNITY_BOT_REPLIES.length)];
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: botIdentity.name,
        icon: botIdentity.icon,
        gradient: botIdentity.gradient,
        text: botText,
        time: 'Just now',
        isMe: false,
        reactions: { '🎸': 1, '❤️': 1 }
      };
      const withBot = saveChatMessage(botMsg);
      setMessages(withBot);
      playChime(783.99); // Pleasant higher harmonic chime
    }, 1800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle reaction click
  const handleReaction = (msgId, emoji) => {
    const updated = updateMessageReaction(msgId, emoji);
    setMessages(updated);
    playChime(659.25);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Backdrop Click to Close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Floating Chat Modal Container */}
      <div className="relative w-full max-w-3xl h-[88vh] max-h-[780px] bg-gradient-to-b from-[#181330] via-dusk-900 to-[#100c22] border-2 border-violet-500/40 rounded-3xl sm:rounded-[36px] shadow-[0_25px_90px_rgba(139,92,246,0.35)] overflow-hidden flex flex-col z-10 text-left">
        
        {/* Top Iridescent Glow Strip */}
        <div className="shrink-0 h-1.5 bg-gradient-to-r from-amber-400 via-pink-500 to-violet-500" />

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-3.5 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all z-20"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header: "Connect, Create, Resonate" */}
        <div className="px-5 pt-4 pb-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-600 to-amber-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-dusk-900 rounded-[14px] flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-display tracking-tight">
                  Connect, Create, Resonate
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  4+ New Messages
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                Anonymous Community Lounge · Chat with jam attendees without showing real identity
              </p>
            </div>
          </div>
        </div>

        {/* Top Bar: Online status, Your Anonymous Alias, & Guidelines */}
        <div className="px-5 py-2.5 border-b border-white/10 bg-white/[0.01] flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Live Indicator & Jammers */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono tracking-wide">
              {onlineCount} Jammers Online
            </span>
          </div>

          {/* Current Anonymous Alias Pill + Roll Button */}
          {currentIdentity && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
                <span className="text-base">{currentIdentity.icon}</span>
                <span className="text-gray-400 font-medium hidden sm:inline">You are:</span>
                <span className="font-bold text-white truncate max-w-[130px] sm:max-w-[180px]">
                  {currentIdentity.name}
                </span>
              </div>

              <button
                onClick={handleRollIdentity}
                className="p-1 rounded-full bg-violet-600/30 hover:bg-violet-600/50 border border-violet-400/40 text-violet-300 hover:text-white transition-all"
                title="Roll a new random anonymous identity"
              >
                <Dices className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1 rounded-full border transition-all ${
                  soundEnabled 
                    ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white' 
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                }`}
                title={soundEnabled ? 'Mute chimes' : 'Unmute chimes'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

        </div>

        {/* Safety Notice Ribbon */}
        <div className="px-5 py-1.5 bg-violet-950/40 border-b border-violet-500/20 flex items-center justify-between text-[11px] text-violet-300/80 shrink-0">
          <span className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Anonymous lounge. Vulgar language, offensive slangs & political slogans are auto-filtered.</span>
          </span>
          <span className="text-[10px] text-gray-400 font-mono hidden md:inline">Positive Vibe Policy</span>
        </div>

        {/* Messages Stream (Self-contained scroll, never affects window) */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {messages.map((msg) => {
            const isMine = msg.isMe || (currentIdentity && msg.sender === currentIdentity.name);

            return (
              <div 
                key={msg.id} 
                className={`flex items-start gap-2.5 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${msg.gradient || 'from-violet-600 to-amber-500'} flex items-center justify-center text-sm shadow-md shrink-0 border border-white/20`}>
                  {msg.icon || '🎸'}
                </div>

                {/* Message Bubble Container */}
                <div className={`flex flex-col max-w-[82%] sm:max-w-[72%] ${isMine ? 'items-end' : 'items-start'}`}>
                  
                  {/* Sender & Timestamp */}
                  <div className="flex items-center gap-2 mb-1 px-1 text-[11px]">
                    <span className={`font-bold ${isMine ? 'text-violet-300' : 'text-gray-300'}`}>
                      {isMine ? 'You (Anonymous)' : msg.sender}
                    </span>
                    <span className="text-gray-500 text-[10px] font-mono">{msg.time}</span>
                  </div>

                  {/* Bubble */}
                  <div className={`p-3 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-lg ${
                    isMine 
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-tr-none'
                      : 'bg-white/[0.07] border border-white/10 text-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Reactions Pill Ribbon */}
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {['🎸', '🔥', '❤️', '👏', '✨'].map((emoji) => {
                      const count = msg.reactions?.[emoji] || 0;
                      return (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className={`px-1.5 py-0.5 rounded-full text-[11px] transition-all flex items-center gap-0.5 border ${
                            count > 0 
                              ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                              : 'bg-transparent border-transparent text-gray-500 hover:border-white/10 hover:text-gray-300'
                          }`}
                          title={`React with ${emoji}`}
                        >
                          <span>{emoji}</span>
                          {count > 0 && <span className="font-mono text-[10px]">{count}</span>}
                        </button>
                      );
                    })}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Moderation Warning Toast Banner */}
        {moderationWarning && (
          <div className="px-5 py-2.5 bg-rose-950/90 border-t border-rose-500/40 text-rose-300 text-xs flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 shrink-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{moderationWarning}</span>
            </div>
            <button 
              onClick={() => setModerationWarning('')}
              className="text-rose-400 hover:text-white text-xs font-bold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Quick Discussion Starters */}
        <div className="px-4 py-2 bg-black/30 border-t border-white/5 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <span className="text-[10px] uppercase font-mono text-gray-500 shrink-0">Quick:</span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white text-xs whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Box Footer */}
        <div className="p-3.5 bg-dusk-900 border-t border-white/10 shrink-0">
          <div className={`relative flex items-center gap-2 transition-transform ${isShaking ? 'animate-shake' : ''}`}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (moderationWarning) setModerationWarning('');
              }}
              onKeyDown={handleKeyPress}
              maxLength={240}
              placeholder={`Message anonymously as ${currentIdentity?.name || 'Jammer'}...`}
              className="flex-1 bg-white/5 border border-white/15 focus:border-violet-400 rounded-2xl pl-4 pr-12 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none transition-all font-medium"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className={`p-2.5 rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center shrink-0 ${
                inputText.trim()
                  ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-violet-600/30 hover:scale-105 active:scale-95'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
              }`}
              title="Send anonymous message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500 font-mono">
            <span>Press Enter to send · Respectful language only</span>
            <span>{inputText.length}/240</span>
          </div>
        </div>

      </div>
    </div>
  );
}
