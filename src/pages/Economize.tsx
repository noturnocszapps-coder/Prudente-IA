import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AffiliateProduct } from '../types';
import { ShoppingCart, ExternalLink, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Economize() {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AffiliateProduct)));
    });
    return () => unsubscribe();
  }, []);

  const categories = ['Todos', ...new Set(products.map(p => p.category))];
  const filteredProducts = filter === 'Todos' ? products : products.filter(p => p.category === filter);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Economize em Prudente</h2>
        <p className="text-neutral-400 text-sm">Ofertas selecionadas e links afiliados para você poupar.</p>
      </header>

      {/* Categorias */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
              filter === cat 
                ? "bg-blue-600 border-blue-500 text-white" 
                : "bg-neutral-900 border-white/5 text-neutral-400 hover:border-white/20"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <motion.div
            layout
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="aspect-square relative overflow-hidden bg-white/5">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/200?text=Produto')}
              />
              <div className="absolute top-2 left-2">
                <span className="bg-blue-600 text-[10px] uppercase font-bold px-2 py-1 rounded-md shadow-lg">
                  {product.category}
                </span>
              </div>
            </div>
            
            <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-xs font-semibold text-neutral-200 line-clamp-2">{product.name}</h3>
                <p className="text-sm font-bold text-blue-400 mt-1">
                  R$ {product.price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <a 
                href={product.affiliateLink}
                target="_blank"
                rel="no-referrer"
                className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-blue-500/20 transition-all"
              >
                <ShoppingCart size={12} />
                Comprar
                <ExternalLink size={10} className="opacity-50" />
              </a>
            </div>
          </motion.div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-2 py-20 text-center space-y-3">
            <Tag size={48} className="mx-auto text-neutral-800" />
            <p className="text-neutral-500">Nenhum produto cadastrado nesta categoria.</p>
          </div>
        )}
      </div>

      <div className="bg-neutral-900/50 border border-dashed border-white/10 rounded-2xl p-4 text-center">
        <p className="text-[10px] text-neutral-600">
          * Os preços e disponibilidade são de responsabilidade do anunciante. Links de afiliados podem gerar comissão para o Prudente IA.
        </p>
      </div>
    </div>
  );
}
