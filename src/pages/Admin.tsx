import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AlertTriangle, Lightbulb, ShoppingBag, Plus, Loader2, Users, DollarSign, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';
import { useEffect } from 'react';

export default function Admin() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<'alerts' | 'tips' | 'products' | 'affiliates'>('alerts');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);

  // Forms states
  const [alertForm, setAlertForm] = useState({ title: '', description: '', severity: 'info' });
  const [tipForm, setTipForm] = useState({ title: '', content: '', type: 'reminder' });
  const [prodForm, setProdForm] = useState({ name: '', image: '', price: '', affiliateLink: '', category: '' });

  useEffect(() => {
    if (!isAdmin) return;
    return onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ ...d.data(), uid: d.id } as UserProfile)));
    });
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-4">
        <AlertTriangle size={64} className="text-red-500 mb-2" />
        <h2 className="text-xl font-bold">Acesso Restrito</h2>
        <p className="text-neutral-400 text-sm">
          Apenas administradores podem acessar esta área.
        </p>
      </div>
    );
  }

  const handleAddAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'alerts'), {
        ...alertForm,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setAlertForm({ title: '', description: '', severity: 'info' });
      alert("Alerta adicionado!");
    } catch (err) { alert("Erro ao adicionar"); }
    finally { setLoading(false); }
  };

  const handleAddTip = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'dailyTips'), {
        ...tipForm,
        date: new Date().toISOString().split('T')[0],
      });
      setTipForm({ title: '', content: '', type: 'reminder' });
      alert("Dica adicionada!");
    } catch (err) { alert("Erro ao adicionar"); }
    finally { setLoading(false); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'products'), {
        ...prodForm,
        price: parseFloat(prodForm.price),
        createdAt: serverTimestamp(),
      });
      setProdForm({ name: '', image: '', price: '', affiliateLink: '', category: '' });
      alert("Produto adicionado!");
    } catch (err) { alert("Erro ao adicionar"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 pb-20">
      <header>
        <h2 className="text-2xl font-bold">Painel de Gestão</h2>
        <p className="text-neutral-400 text-sm">Controle os conteúdos e afiliados de Prudente.</p>
      </header>

      <div className="flex gap-2 p-1 bg-neutral-900 rounded-xl overflow-x-auto">
        {[
          { id: 'alerts' as const, label: 'Alertas', icon: AlertTriangle },
          { id: 'tips' as const, label: 'Dicas', icon: Lightbulb },
          { id: 'products' as const, label: 'Produtos', icon: ShoppingBag },
          { id: 'affiliates' as const, label: 'Afiliados', icon: Users },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap",
              tab === t.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 shadow-xl">
        {tab === 'alerts' && (
          <form onSubmit={handleAddAlert} className="space-y-4">
            <h3 className="font-bold border-b border-white/5 pb-2 mb-4">Novo Alerta</h3>
            <FormField label="Título" value={alertForm.title} onChange={v => setAlertForm({...alertForm, title: v})} />
            <FormField label="Descrição" value={alertForm.description} onChange={v => setAlertForm({...alertForm, description: v})} textarea />
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-500">Severidade</label>
              <select 
                value={alertForm.severity}
                onChange={e => setAlertForm({...alertForm, severity: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm"
              >
                <option value="info">Informação</option>
                <option value="warning">Aviso</option>
                <option value="alert">Crítico</option>
              </select>
            </div>
            <AdminButton loading={loading} />
          </form>
        )}

        {tab === 'tips' && (
          <form onSubmit={handleAddTip} className="space-y-4">
            <h3 className="font-bold border-b border-white/5 pb-2 mb-4">Dica Diária</h3>
            <FormField label="Título" value={tipForm.title} onChange={v => setTipForm({...tipForm, title: v})} />
            <FormField label="Conteúdo" value={tipForm.content} onChange={v => setTipForm({...tipForm, content: v})} textarea />
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-neutral-500">Tipo</label>
              <select 
                value={tipForm.type}
                onChange={e => setTipForm({...tipForm, type: e.target.value as any})}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm"
              >
                <option value="reminder">Lembrete</option>
                <option value="economy">Economia</option>
                <option value="leisure">Lazer</option>
              </select>
            </div>
            <AdminButton loading={loading} />
          </form>
        )}

        {tab === 'products' && (
          <form onSubmit={handleAddProduct} className="space-y-4">
            <h3 className="font-bold border-b border-white/5 pb-2 mb-4">Produto Afiliado</h3>
            <FormField label="Nome do Produto" value={prodForm.name} onChange={v => setProdForm({...prodForm, name: v})} />
            <FormField label="URL da Imagem" value={prodForm.image} onChange={v => setProdForm({...prodForm, image: v})} />
            <FormField label="Preço (R$)" value={prodForm.price} onChange={v => setProdForm({...prodForm, price: v})} type="number" />
            <FormField label="Link Afiliado" value={prodForm.affiliateLink} onChange={v => setProdForm({...prodForm, affiliateLink: v})} />
            <FormField label="Categoria" value={prodForm.category} onChange={v => setProdForm({...prodForm, category: v})} />
            <AdminButton loading={loading} />
          </form>
        )}

        {tab === 'affiliates' && (
          <div className="space-y-6">
            <h3 className="font-bold border-b border-white/5 pb-2">Gestão de Afiliados</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <p className="text-[9px] uppercase font-bold text-neutral-500 mb-1">Aguardando Pagamento</p>
                <p className="text-xl font-bold">{users.filter(u => u.firstPaymentCompleted && !u.commissionGenerated).length}</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                <p className="text-[9px] uppercase font-bold text-neutral-500 mb-1">Comissões Pagas</p>
                <p className="text-xl font-bold text-blue-400">{users.filter(u => u.commissionGenerated).length}</p>
              </div>
            </div>

            <div className="space-y-3">
              {users.filter(u => u.referralCount > 0 || u.firstPaymentCompleted).map(u => (
                <div key={u.uid} className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm">{u.displayName}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">{u.email}</p>
                    </div>
                    <span className={cn(
                      "text-[9px] font-bold uppercase px-2 py-0.5 rounded",
                      u.firstPaymentCompleted ? "bg-green-500/20 text-green-400" : "bg-neutral-800 text-neutral-500"
                    )}>
                      {u.firstPaymentCompleted ? 'Pagamento VIP OK' : 'Aguardando VIP'}
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[9px] uppercase font-bold text-neutral-500">Indicados</p>
                      <p className="text-sm font-bold">{u.referralCount}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-neutral-500">Saldo Atual</p>
                      <p className="text-sm font-bold text-green-400">R$ {u.totalEarnings || 0},00</p>
                    </div>
                  </div>

                  {!u.commissionGenerated && u.firstPaymentCompleted && (
                    <button 
                      onClick={() => updateDoc(doc(db, 'users', u.uid), { 
                        commissionGenerated: true, 
                        totalEarnings: (u.totalEarnings || 0) + 5 
                      })}
                      className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-[10px] font-bold uppercase"
                    >
                      Processar Crédito (R$ 5,00)
                    </button>
                  )}
                </div>
              ))}
              {users.filter(u => u.referralCount > 0 || u.firstPaymentCompleted).length === 0 && (
                <p className="text-center py-10 text-neutral-600 text-xs italic">Nenhuma atividade de afiliado detectada.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, textarea, type = "text" }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase font-bold text-neutral-500">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm min-h-[100px] focus:ring-1 focus:ring-blue-500 outline-none"
          required
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
          required
        />
      )}
    </div>
  );
}

function AdminButton({ loading }: { loading: boolean }) {
  return (
    <button
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-4"
    >
      {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
      Salvar Registro
    </button>
  );
}
