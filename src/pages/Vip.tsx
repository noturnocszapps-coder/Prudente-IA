import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check, Star, ShieldCheck, Zap, Bell, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Vip() {
  const { isVip, user } = useAuth();

  const benefits = [
    { title: 'Chat Ilimitado', desc: 'Pergunte o quanto quiser para o Prudente IA sem restrições.', icon: MessageCircle },
    { title: 'Alertas Exclusivos', desc: 'Receba alertas VIP sobre oportunidades e segurança antes de todos.', icon: Bell },
    { title: 'Ofertas Selecionadas', desc: 'Acesso a uma curadoria premium de descontos em Prudente.', icon: Zap },
    { title: 'Suporte Prioritário', desc: 'Canal direto para sugerir melhorias e tirar dúvidas.', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-2">
          <Star className="text-blue-400" size={32} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Prudente IA <span className="text-blue-500">VIP</span></h2>
        <p className="text-neutral-400 text-sm max-w-xs mx-auto">
          A experiência definitiva para quem quer dominar a cidade com inteligência superior.
        </p>
      </header>

      {isVip ? (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-center space-y-4 shadow-2xl shadow-blue-900/40 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <h3 className="text-2xl font-bold">Você é VIP!</h3>
          <p className="text-blue-100 text-sm">
            Obrigado por apoiar a comunidade local. Você tem acesso total a todas as funcionalidades premium.
          </p>
          <div className="pt-4 grid grid-cols-2 gap-4 text-left">
            {benefits.map(b => (
              <div key={b.title} className="flex gap-2 items-start">
                <Check size={16} className="text-white shrink-0 mt-1" />
                <span className="text-[10px] font-medium text-blue-500 bg-white/10 px-2 py-1 rounded-full">{b.title}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <section className="space-y-6">
          {/* Planos */}
          <div className="space-y-4">
            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 opacity-60">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold">Plano Grátis</h4>
                <span className="text-neutral-500 font-mono text-xs">R$ 0,00</span>
              </div>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li className="flex items-center gap-2"><Check size={12} /> Limite de 20 mensagens/mês</li>
                <li className="flex items-center gap-2"><Check size={12} /> Alertas públicos da cidade</li>
                <li className="flex items-center gap-2"><Check size={12} /> Visualização básica de ofertas</li>
              </ul>
            </div>

            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-neutral-900 border-2 border-blue-500 rounded-2xl p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">
                Recomendado
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  Plano VIP
                  <Star size={16} className="fill-blue-500 text-blue-500" />
                </h4>
                <div className="text-right">
                  <span className="text-xl font-bold">R$ 14,90</span>
                  <span className="text-neutral-500 text-[10px] block">/mês</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-neutral-300 mb-6">
                {benefits.map(b => (
                  <li key={b.title} className="flex items-start gap-2">
                    <Check size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">{b.title}</span>
                      <span className="text-neutral-500 text-[10px]">{b.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => alert("Integração com Mercado Pago em breve!")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
              >
                Assinar Agora
              </button>
            </motion.div>
          </div>

          <p className="text-[10px] text-center text-neutral-600 px-10">
            Ao assinar, você concorda com nossos Termos de Uso e Política de Privacidade. O cancelamento pode ser feito a qualquer momento.
          </p>
        </section>
      )}

      {/* Grid de benefícios */}
      {!isVip && (
        <section className="bg-neutral-900/50 rounded-3xl p-6 grid grid-cols-1 gap-6 border border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 text-center">Por que ser VIP?</h3>
          {benefits.map((b, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 w-12 h-12 bg-neutral-900 border border-white/5 rounded-xl flex items-center justify-center text-blue-400">
                <b.icon size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold">{b.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
