import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../lib/firebase';
import { Bot, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/30"
      >
        <Bot size={48} className="text-white" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight">Bem-vindo ao Prudente IA</h2>
        <p className="text-neutral-400 text-sm">
          Sua cidade, mais inteligente. Entre para acessar seu assistente pessoal.
        </p>
      </div>

      <button
        onClick={handleLogin}
        className="group relative w-full max-w-sm flex items-center justify-center gap-3 bg-white text-black py-4 rounded-full font-bold transition-all hover:bg-neutral-100 hover:shadow-xl active:scale-95"
      >
        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
        Entrar com Google
        <LogIn size={18} className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      <p className="text-[10px] text-neutral-600 max-w-xs uppercase tracking-widest font-bold">
        Ao entrar, você concorda com nossos termos de privacidade.
      </p>
    </div>
  );
}
