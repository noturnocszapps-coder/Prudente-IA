import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CityAlert, DailyTip } from '../types';
import { Cloud, AlertTriangle, Lightbulb, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

export default function Home() {
  const [alerts, setAlerts] = useState<CityAlert[]>([]);
  const [tips, setTips] = useState<DailyTip[]>([]);
  
  useEffect(() => {
    const qAlerts = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'), limit(3));
    const unsubAlerts = onSnapshot(qAlerts, (snap) => {
      setAlerts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CityAlert)));
    });

    const qTips = query(collection(db, 'dailyTips'), orderBy('date', 'desc'), limit(5));
    const unsubTips = onSnapshot(qTips, (snap) => {
      setTips(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyTip)));
    });

    return () => {
      unsubAlerts();
      unsubTips();
    };
  }, []);

  return (
    <div className="space-y-6 pb-4">
      {/* Hero Section */}
      <section className="py-8 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight px-2">
            💸 Economize dinheiro e não perca nada em <span className="text-blue-500">Prudente</span> com IA
          </h2>
          <p className="text-neutral-400 text-sm max-w-xs mx-auto">
            Receba dicas práticas, alertas da cidade e recomendações inteligentes para gastar menos e aproveitar mais seu dia.
          </p>
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="pt-2"
        >
          <button 
            onClick={() => window.location.href = '/chat'}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] active:scale-95"
          >
            <span className="relative flex items-center gap-2 text-lg">
              🚀 Testar Assistente Agora
            </span>
          </button>
        </motion.div>
        
        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest pt-1">
          ⚡ IA Treinada para Presidente Prudente
        </p>
      </section>

      {/* Info Sections */}
      <div className="space-y-6">
        {/* Clima Simulado */}
        <section className="bg-neutral-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-wider">Prudente Agora</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">28°C</span>
              <Cloud className="text-blue-400" size={20} />
            </div>
            <p className="text-neutral-500 text-[10px]">{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-neutral-400 font-medium tracking-tight">Ensolarado</p>
            <p className="text-[10px] text-neutral-500">Máx: 31° • Mín: 19°</p>
          </div>
        </section>

        {/* Alertas */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            Alertas da Cidade
          </h3>
          <div className="space-y-2">
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-neutral-900 border border-white/5 p-3 rounded-xl flex gap-3"
                >
                  <div className={cn(
                    "w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold",
                    alert.severity === 'alert' ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                  )}>!</div>
                  <div>
                    <h4 className="font-bold text-xs">{alert.title}</h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{alert.description}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-neutral-900/50 border border-dashed border-white/5 p-3 rounded-xl text-center">
                <p className="text-[11px] text-neutral-600">Nenhum alerta crítico no momento.</p>
              </div>
            )}
            
            {/* Fallback Alerta */}
            {alerts.length === 0 && (
              <div className="bg-neutral-900 border border-white/5 p-3 rounded-xl flex gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">i</div>
                <div>
                  <h4 className="font-bold text-xs">Previsão Semanal</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Semana com temperaturas elevadas em Prudente.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Dicas e Cards */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
            <Lightbulb size={14} className="text-blue-500" />
            Hoje em Prudente
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {tips.length > 0 ? (
              tips.map((tip, idx) => (
                <div 
                  key={tip.id} 
                  className={cn(
                    "p-4 rounded-2xl border flex flex-col gap-3 transition-all active:scale-[0.98]",
                    idx === 0 ? "col-span-2 bg-blue-600/10 border-blue-500/20" : "bg-neutral-900 border-white/5"
                  )}
                >
                  <div className="flex justify-between items-start">
                    {tip.type === 'economy' && <div className="p-1 px-2 bg-green-500/10 text-green-400 text-[8px] font-bold uppercase rounded-md">Economize</div>}
                    {tip.type === 'leisure' && <div className="p-1 px-2 bg-purple-500/10 text-purple-400 text-[8px] font-bold uppercase rounded-md">Lazer</div>}
                    {tip.type === 'reminder' && <div className="p-1 px-2 bg-blue-500/10 text-blue-400 text-[8px] font-bold uppercase rounded-md">Dica IA</div>}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm mb-1">{tip.title}</h4>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">{tip.content}</p>
                  </div>
                  {idx === 0 && (
                    <button className="text-[10px] font-bold text-blue-400 flex items-center gap-1 mt-auto uppercase tracking-widest">
                      Ver detalhes <ArrowRight size={10} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              // Fallback Dicas
              <>
                <div className="col-span-2 p-4 rounded-2xl border bg-blue-600/10 border-blue-500/20 space-y-2">
                  <div className="p-1 px-2 bg-blue-500/10 text-blue-400 text-[8px] font-bold uppercase rounded-md w-fit">Sugestão do Dia</div>
                  <h4 className="font-bold text-sm">Ótimo dia para tarefas externas</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">O clima está estável. Aproveite para resolver pendências no centro antes das 16h.</p>
                </div>
                <div className="p-4 rounded-2xl border bg-neutral-900 border-white/5 space-y-2">
                  <div className="p-1 px-2 bg-green-500/10 text-green-400 text-[8px] font-bold uppercase rounded-md w-fit">Economize</div>
                  <h4 className="font-bold text-[11px]">Dica de Compra</h4>
                  <p className="text-[10px] text-neutral-500">Mantenha os olhos na área "Economize" para as melhores ofertas.</p>
                </div>
                <div className="p-4 rounded-2xl border bg-neutral-900 border-white/5 space-y-2">
                  <div className="p-1 px-2 bg-purple-500/10 text-purple-400 text-[8px] font-bold uppercase rounded-md w-fit">Relaxe</div>
                  <h4 className="font-bold text-[11px]">Parque do Povo</h4>
                  <p className="text-[10px] text-neutral-500">O pôr do sol hoje promete ser um dos mais belos da semana.</p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
