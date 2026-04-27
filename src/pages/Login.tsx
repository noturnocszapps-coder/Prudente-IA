import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../lib/firebase';
import { Bot, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('STARTING_LOGIN_POPUP...');
      const user = await signInWithGoogle(false);
      if (user) {
        console.log('REDIRECT_HOME_SUCCESS');
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      console.error('LOGIN_ERROR:', err);
      
      // If popup is blocked or fails, try redirect
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user' || err.code === 'auth/network-request-failed') {
        try {
          console.log('FALLBACK_TO_REDIRECT...', err.code);
          await signInWithGoogle(true);
        } catch (redirErr: any) {
          setError('Ocorreu uma falha de conexão. Tente desativar bloqueadores de anúncios ou trocar de rede.');
          setLoading(false);
        }
      } else {
        setError(`Erro ao entrar: ${err.message || 'Verifique sua conexão'}`);
        setLoading(false);
      }
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

      <div className="w-full max-w-sm space-y-4">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-left">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
            {error.includes('conexão') && (
              <p className="text-[10px] text-neutral-500 text-center px-4 leading-normal">
                Dica: Tente abrir o app em uma <b>nova aba</b> clicando no ícone de "Seta para fora" no topo do preview.
              </p>
            )}
          </motion.div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="group relative w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-full font-bold transition-all hover:bg-neutral-100 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            )}
            {loading ? 'Entrando...' : 'Entrar com Google'}
            {!loading && <LogIn size={18} className="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </button>

          {error && (
            <button
              onClick={() => signInWithGoogle(true)}
              className="w-full text-[11px] text-neutral-500 hover:text-white transition-colors underline py-2 font-medium"
            >
              Tentar login por redirecionamento (alternativo)
            </button>
          )}
        </div>
      </div>

      <p className="text-[10px] text-neutral-600 max-w-xs uppercase tracking-widest font-bold">
        Ao entrar, você concorda com nossos termos de privacidade.
      </p>
    </div>
  );
}
