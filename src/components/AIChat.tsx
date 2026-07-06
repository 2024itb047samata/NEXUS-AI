import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Trash2, 
  Brain, 
  Copy, 
  Check, 
  Cpu, 
  HelpCircle,
  FileText,
  Bookmark
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatProps {
  documents: any[];
}

export default function AIChat({ documents }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch initial chat history
  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/chat/history');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // Append user message locally instantly
    const userMsg: ChatMessage = {
      id: `chat_user_temp_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.filter(m => !m.id.startsWith('chat_user_temp')) // strip temp IDs
        })
      });

      const data = await response.json();
      if (data.aiResponse) {
        setMessages(prev => {
          // Remove temp user message, replace with persistent ones
          const clean = prev.filter(m => m.id !== userMsg.id);
          return [...clean, data.userMessage, data.aiResponse];
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!confirm('Clear all conversation logs?')) return;
    try {
      await fetch('/api/chat/clear', { method: 'POST' });
      setMessages([]);
    } catch (err) {
      console.error('Error clearing chats:', err);
    }
  };

  const handleCopyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Simple and ultra-robust inline markdown renderer to handle bold formatting, bullets, headers and code cards
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();

      // Heading 3
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-sm font-display font-bold text-white mt-4 mb-2">{trimmed.replace('###', '').trim()}</h4>;
      }
      // Heading 2
      if (trimmed.startsWith('##')) {
        return <h3 key={idx} className="text-base font-display font-bold text-white mt-5 mb-2.5 border-b border-purple-950/20 pb-1">{trimmed.replace('##', '').trim()}</h3>;
      }
      // Heading 1
      if (trimmed.startsWith('#')) {
        return <h2 key={idx} className="text-lg font-display font-bold text-white mt-6 mb-3">{trimmed.replace('#', '').trim()}</h2>;
      }
      // Bullet items
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const content = trimmed.substring(1).trim();
        return (
          <ul key={idx} className="list-disc pl-5 text-xs text-gray-300 space-y-1 my-1">
            <li>{parseInlineBold(content)}</li>
          </ul>
        );
      }
      // Empty lines
      if (!trimmed) {
        return <div key={idx} className="h-2"></div>;
      }

      // Default paragraph line
      return <p key={idx} className="text-xs text-gray-300 leading-relaxed font-sans my-1.5">{parseInlineBold(trimmed)}</p>;
    });
  };

  const parseInlineBold = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-white font-semibold">{part}</strong>;
      }
      return part;
    });
  };

  const suggestions = [
    'Which project uses TensorRT?',
    'Show all my certificates',
    'Compare Resume Version 1 and Version 2',
    'Generate a customized LinkedIn bio based on my credentials'
  ];

  return (
    <div className="bg-[#0b0629]/40 border border-purple-950/20 rounded-3xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.4)] flex flex-col h-[580px] justify-between relative overflow-hidden" id="ai-chat-view">
      
      {/* Chat header */}
      <div className="flex items-center justify-between border-b border-purple-950/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-950/40 flex items-center justify-center border border-purple-900/10 text-purple-400">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-white">RAG Identity Assistant</h3>
            <p className="text-[10px] text-gray-400 font-mono">Considers {documents.length} verified documents</p>
          </div>
        </div>
        <button 
          onClick={handleClearChat}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl transition-colors"
          title="Clear Conversation Logs"
          id="btn-clear-chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4 max-h-[380px]" id="chat-messages-container">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
            <MessageSquare className="w-10 h-10 mb-3 text-purple-950 animate-bounce" />
            <h4 className="text-xs font-semibold text-gray-400">Consult your Digital Brain</h4>
            <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">Ask AI queries targeting any certificate details, compare resumes, or generate cover letters immediately from your credentials.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border text-[10px] font-mono shrink-0 ${
                  isUser 
                    ? 'bg-blue-950/30 border-blue-900/20 text-blue-400' 
                    : 'bg-purple-950/40 border-purple-900/20 text-purple-400'
                }`}>
                  {isUser ? 'U' : 'AI'}
                </div>

                {/* Bubble content */}
                <div className={`p-4 rounded-2xl border text-xs relative group ${
                  isUser 
                    ? 'bg-blue-950/20 border-blue-900/30 text-gray-200 shadow-[inset_0_0_10px_rgba(59,130,246,0.05)]' 
                    : 'bg-purple-950/15 border-purple-950/30 text-gray-300 shadow-[inset_0_0_10px_rgba(168,85,247,0.05)]'
                }`}>
                  
                  {/* Copy Button for non-users */}
                  {!isUser && (
                    <button 
                      onClick={() => handleCopyToClipboard(msg.id, msg.text)}
                      className="absolute top-3 right-3 p-1 bg-black/40 hover:bg-black border border-purple-950/30 rounded text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Copy response content"
                      id={`btn-copy-msg-${msg.id}`}
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}

                  {/* Body text markdown */}
                  <div className="space-y-1">{renderMarkdown(msg.text)}</div>

                  {/* Related document connections tags */}
                  {msg.relatedDocIds && msg.relatedDocIds.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-purple-950/20 flex flex-wrap gap-1.5 items-center">
                      <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-[9px] text-gray-400 uppercase font-mono mr-1">RAG Sources:</span>
                      {msg.relatedDocIds.map((docId) => (
                        <span key={docId} className="text-[9px] px-2 py-0.5 rounded bg-purple-950/40 border border-purple-900/30 text-purple-300 font-mono">
                          doc_{docId}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Related suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1.5 border-t border-purple-950/10 pt-2">
                      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider block">Suggested Synapses</span>
                      <div className="flex flex-col gap-1">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(sug)}
                            className="text-[10px] text-purple-400 hover:text-purple-300 text-left hover:underline cursor-pointer flex items-center gap-1 font-mono"
                          >
                            &bull; {sug}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-7 h-7 rounded-lg bg-purple-950/40 border border-purple-900/20 flex items-center justify-center text-[10px] font-mono text-purple-400">
              AI
            </div>
            <div className="bg-purple-950/15 border border-purple-950/30 p-4 rounded-2xl flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-xs font-mono text-gray-400">AI digital memory retrieving...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Suggested Fastprompts */}
      {messages.length === 0 && (
        <div className="border-t border-purple-950/10 pt-3 pb-2">
          <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Suggested Synapses:</span>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((sug, idx) => (
              <button 
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="p-2 text-left bg-purple-950/10 hover:bg-purple-900/10 border border-purple-950/30 rounded-xl text-[10px] text-purple-300 leading-snug transition-all truncate"
                id={`btn-fast-chat-${idx}`}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Text Prompt input box */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="flex gap-2.5 border-t border-purple-950/20 pt-4"
      >
        <input 
          type="text"
          placeholder="Consult your Digital Brain..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-[#110c32]/60 border border-purple-950/40 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          id="chat-text-input"
        />
        <button 
          type="submit"
          disabled={!inputValue.trim() || loading}
          className="px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 rounded-2xl text-white transition-all cursor-pointer flex items-center justify-center"
          id="btn-chat-submit"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
