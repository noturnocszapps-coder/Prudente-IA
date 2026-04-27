import React from 'react';

export default function Terms() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-6 space-y-8 pb-24">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Termos de Uso</h1>
        <p className="text-neutral-500 text-sm">Última atualização: 27 de Abril de 2024</p>
      </header>

      <div className="space-y-6 text-neutral-400 text-sm leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. O QUE É O PRUDENTE IA</h2>
          <p>
            O Prudente IA é um assistente digital informativo focado em Presidente Prudente - SP. O serviço utiliza inteligência artificial para fornecer dicas, alertas e recomendações sobre a cidade.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. USO INFORMATIVO</h2>
          <p>
            As informações fornecidas pela IA são de caráter consultivo. Não garantimos a veracidade absoluta de preços em tempo real ou disponibilidade de estabelecimentos. Recomendamos sempre verificar localmente informações críticas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. PLANO VIP E ASSINATURA</h2>
          <p>
            O acesso completo requer uma assinatura VIP de R$ 9,90/mês. A assinatura pode oferecer um período de teste gratuito. O cancelamento pode ser feito a qualquer momento através das configurações da conta.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. LIMITAÇÃO DE RESPONSABILIDADE</h2>
          <p>
            O Prudente IA não se responsabiliza por decisões financeiras, atrasos causados por trânsito ou quaisquer problemas decorrentes do uso das informações fornecidas no aplicativo.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. ALTERAÇÕES NOS TERMOS</h2>
          <p>
            Reservamos o direito de alterar estes termos e o modelo de precificação a qualquer momento, mediante aviso no aplicativo.
          </p>
        </section>
      </div>

      <footer className="pt-10 border-t border-white/5 text-[10px] text-neutral-600">
        © 2024 Prudente IA - Todos os direitos reservados.
      </footer>
    </div>
  );
}
