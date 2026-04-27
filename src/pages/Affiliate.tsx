import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Share2, Copy, CheckCircle2, TrendingUp, DollarSign, Users, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Affiliate() {
  const { profile } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/?ref=${profile?.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Header */}
      <header className="pt-6 space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
          <Award size={12} />
          Programa de Afiliados Oficial
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Ganhe Dinheiro Indicando</h1>
        <p className="text-neutral-400 text-sm max-w-xs mx-auto">
          Transforme cada indicação em renda recorrente. Sem limite de ganhos.
        </p>
      </header>

      {/* Your Link Section */}
      <section className="bg-neutral-900 border border-white/5 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2">
            <Share2 size={16} className="text-blue-500" />
            Seu Link de Afiliado
          </h2>
          <span className="text-[10px] text-green-400 font-bold uppercase">Ativo</span>
        </div>

        <div className="space-y-3">
          <div className="bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono break-all text-neutral-400">
            {referralLink}
          </div>
          <button 
            onClick={copyToClipboard}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
          >
            {copied ? (
              <>
                <CheckCircle2 size={18} /> Link Copiado!
              </>
            ) : (
              <>
                <Copy size={18} /> Copiar Link e Começar
              </>
            )}
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-1">Como funciona</h3>
        <div className="grid grid-cols-1 gap-3">
          {[
            { step: 1, title: 'Compartilhe seu link', desc: 'Envie para amigos ou seguidores em Prudente.' },
            { step: 2, title: 'Eles testam grátis', desc: 'Novos usuários ganham 7 dias de VIP para conhecer.' },
            { step: 3, title: 'Você recebe', desc: 'Ganha comissão sobre a primeira mensalidade paga.' },
          ].map((item) => (
            <div key={item.step} className="bg-neutral-900/50 border border-white/5 p-4 rounded-2xl flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-xs text-neutral-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 ml-1">Suas Estatísticas</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-neutral-900 border border-white/5 rounded-2xl p-4 space-y-1">
            <Users size={16} className="text-blue-500" />
            <p className="text-2xl font-bold">{profile?.referralCount || 0}</p>
            <p className="text-[10px] font-medium text-neutral-500 uppercase">Indicados</p>
          </div>
          <div className="bg-neutral-900 border border-white/5 rounded-2xl p-4 space-y-1">
            <DollarSign size={16} className="text-green-500" />
            <p className="text-2xl font-bold">R$ {profile?.totalEarnings || 0},00</p>
            <p className="text-[10px] font-medium text-neutral-500 uppercase">Ganhos Totais</p>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <div className="px-6 text-center space-y-2">
        <p className="text-[10px] text-neutral-600 flex items-center justify-center gap-1">
          <ShieldCheck size={12} /> Pagamentos manuais via Pix na fase inicial.
        </p>
        <button 
          onClick={() => window.location.href = '/affiliate-terms'}
          className="text-[10px] text-blue-500/60 hover:text-blue-500 underline"
        >
          Ver regras completas do programa
        </button>
      </div>
    </div>
  );
}
