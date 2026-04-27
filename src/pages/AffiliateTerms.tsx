import React from 'react';

export default function AffiliateTerms() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-6 space-y-8 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Regras do Programa de Afiliados</h1>
        <p className="text-neutral-500 text-sm">Última atualização: 27 de Abril de 2024</p>
      </header>

      <div className="space-y-6 text-neutral-400 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. COMISSÕES</h2>
          <p>
            A comissão é gerada apenas sobre o primeiro pagamento realizado por um usuário indicado que utilize seu link exclusivo. O pagamento deve ser confirmado após o período de teste de 7 dias.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. PAGAMENTOS</h2>
          <p>
            Nesta fase inicial, os pagamentos são processados manualmente via Pix. Os valores mínimos e datas de resgate serão informados individualmente ou atualizados nesta página.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. PROIBIÇÕES</h2>
          <p>
            É estritamente proibido o uso de técnicas de spam, anúncios enganosos ou qualquer forma de fraude para gerar indicações. O auto-referenciamento (criar contas para indicar a si mesmo) resultará em banimento imediato.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. CANCELAMENTO</h2>
          <p>
            Reservamos o direito de suspender a conta de qualquer afiliado que viole as regras de bom senso ou tente prejudicar a reputação do Prudente IA.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. AJUSTES DE REGULAMENTO</h2>
          <p>
            As regras e porcentagens de comissão podem ser alteradas futuramente para garantir a sustentabilidade do projeto.
          </p>
        </section>
      </div>

      <footer className="pt-10 border-t border-white/5 text-[10px] text-neutral-600 text-center">
        Dúvidas? Entre em contato com o suporte.
      </footer>
    </div>
  );
}
