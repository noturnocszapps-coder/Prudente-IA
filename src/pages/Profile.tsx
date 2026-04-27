import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, User, Shield, Star, Mail, Calendar, Share2, Copy, CheckCircle2, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function Profile() {
  const { profile, user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-20 px-6 bg-neutral-900 rounded-3xl border border-white/5 space-y-4">
        <User size={48} className="mx-auto text-neutral-800" />
        <h3 className="text-lg font-bold">Você não está logado</h3>
        <p className="text-neutral-500 text-sm">Entre para ver suas informações e status VIP.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="bg-blue-600 px-8 py-2 rounded-full text-sm font-bold"
        >
          Entrar
        </button>
      </div>
    );
  }

  const handleLogout = () => signOut(auth);

  return (
    <div className="space-y-6 pb-24">
      <header className="flex flex-col items-center gap-4 pt-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-blue-500/20 p-1">
            <img 
              src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`} 
              className="w-full h-full rounded-full object-cover"
              alt="Avatar"
            />
          </div>
          {profile?.isVip && (
            <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full border-4 border-black">
              <Star size={12} className="fill-white text-white" />
            </div>
          )}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">{profile?.displayName || user.displayName}</h2>
          <span className={cn(
            "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
            profile?.role === 'admin' ? "bg-red-500/20 text-red-400" :
            profile?.isVip ? "bg-blue-500/20 text-blue-400" : "bg-neutral-800 text-neutral-500"
          )}>
            {profile?.role === 'admin' ? 'Administrador' : profile?.isVip ? 'Membro VIP' : 'Plano Grátis'}
          </span>
        </div>
      </header>

      {/* Affiliate Program Entry */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-1">Monetização</h3>
        <button 
          onClick={() => window.location.href = '/affiliate'}
          className="w-full bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-2xl p-5 text-left flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="font-bold text-sm">Ganhar Dinheiro</p>
              <p className="text-[11px] text-neutral-500">Indique o Prudente IA e receba comissões</p>
            </div>
          </div>
          <ArrowRight className="text-neutral-600 group-hover:text-green-500 transition-colors" size={18} />
        </button>
      </section>

      <section className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 flex items-center gap-4 border-b border-white/5">
          <Mail className="text-neutral-500" size={18} />
          <div>
            <p className="text-[10px] text-neutral-500 uppercase font-bold">E-mail</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>
        
        <div className="p-4 flex items-center gap-4 border-b border-white/5">
          <Calendar className="text-neutral-500" size={18} />
          <div>
            <p className="text-[10px] text-neutral-500 uppercase font-bold">Membro desde</p>
            <p className="text-sm font-medium">
              {profile?.createdAt ? format(profile.createdAt, "MMMM 'de' yyyy", { locale: ptBR }) : '...'}
            </p>
          </div>
        </div>

        {profile?.role === 'admin' && (
          <button 
            onClick={() => window.location.href = '/admin'}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5 text-red-400"
          >
            <div className="flex items-center gap-4">
              <Shield size={18} />
              <span className="text-sm font-bold">Painel Admin</span>
            </div>
            <ArrowRight size={16} />
          </button>
        )}

        <button 
          onClick={() => window.location.href = '/terms'}
          className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5"
        >
          <div className="flex items-center gap-4 text-neutral-400">
            <ShieldCheck size={18} />
            <span className="text-sm">Termos de Uso</span>
          </div>
          <ArrowRight className="text-neutral-700" size={16} />
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full p-4 flex items-center gap-4 text-red-500 hover:bg-red-500/5 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm font-bold">Sair da Conta</span>
        </button>
      </section>

      <p className="text-center text-[10px] text-neutral-600 font-medium">
        v1.0.0 • Feito em Presidente Prudente
      </p>
    </div>
  );
}
