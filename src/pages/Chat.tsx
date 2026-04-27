import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { getChatResponse } from '../services/gemini';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

export default function Chat() {
  const { user, isVip, profile } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Use a fixed chat session for simplicity in this version
  const chatId = user?.uid ? `main-${user.uid}` : null;

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !chatId) return;

    // Plan check: Free users have limits (simulated for now)
    if (!isVip && messages.length > 20) {
      alert("Limite de chat atingido para o plano grátis. Torne-se VIP para continuar!");
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      // 1. Create/Update chat metadata FIRST (important for security rules)
      const chatDocRef = doc(db, 'chats', chatId);
      await setDoc(chatDocRef, {
        userId: user.uid,
        title: userMessage.substring(0, 50),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(), // Will only set if doesn't exist due to merge
      }, { merge: true });

      // 2. Add user message to Firestore
      const msgRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(msgRef, {
        role: 'user',
        content: userMessage,
        timestamp: serverTimestamp(),
      });

      // 3. Get AI Response
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model' as 'user' | 'model',
        parts: [{ text: msg.content }]
      }));
      
      const aiResponse = await getChatResponse(userMessage, history);

      // 4. Add AI message to Firestore
      await addDoc(msgRef, {
        role: 'assistant',
        content: aiResponse,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-4">
        <Bot size={64} className="text-blue-500 mb-2" />
        <h2 className="text-xl font-bold">Acesse o Prudente IA</h2>
        <p className="text-neutral-400 text-sm">
          Você precisa estar logado para conversar com nosso assistente inteligente.
        </p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          Entrar agora
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-2 scroll-smooth">
        <div className="text-center mb-6">
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest pt-2">
            Pergunte qualquer coisa sobre seu dia em Prudente
          </p>
        </div>

        {messages.length === 0 && (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
              <Bot className="text-blue-500" size={32} />
            </div>
            <h3 className="text-lg font-semibold">Olá, {profile?.displayName}!</h3>
            <p className="text-neutral-500 text-sm max-w-xs mx-auto">
              Como posso facilitar sua vida hoje em Prudente?
            </p>
            <div className="grid grid-cols-1 gap-2 pt-4">
              {[
                "O que fazer hoje em Prudente?",
                "Como economizar hoje?",
                "Me dê uma dica útil agora"
              ].map(s => (
                <button 
                  key={s} 
                  onClick={() => setInput(s)}
                  className="text-xs border border-white/5 bg-neutral-900 hover:bg-neutral-800 p-3 rounded-xl transition-all text-left flex items-center justify-between group"
                >
                  <span>{s}</span>
                  <Send size={12} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full mb-4",
                msg.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] rounded-2xl p-3 text-sm",
                msg.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-neutral-800 text-neutral-100 rounded-tl-none border border-white/5"
              )}>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.timestamp && (
                  <p className="text-[10px] opacity-50 mt-1 text-right italic">
                    {format(msg.timestamp.toDate(), 'HH:mm')}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-neutral-800 border border-white/5 rounded-2xl p-4 flex gap-2 items-center">
              <Loader2 className="animate-spin text-blue-500" size={16} />
              <span className="text-xs text-neutral-400">Prudente IA está pensando...</span>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSend} className="pt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre Prudente..."
          className="flex-1 bg-neutral-900 border border-white/10 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-neutral-600"
        />
        <button
          disabled={loading || !input.trim()}
          className="bg-blue-600 disabled:opacity-50 text-white p-3 rounded-full hover:shadow-lg hover:shadow-blue-900/40 transition-all flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
