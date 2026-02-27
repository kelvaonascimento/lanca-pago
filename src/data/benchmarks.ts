export interface BenchmarkData {
  id: string
  niche: string
  metric: string
  value: number
  unit: string
  source: string
}

// ============================================================
// CPA (Custo por Aquisicao) Benchmarks
// ============================================================
const CPA_BENCHMARKS: BenchmarkData[] = [
  {
    id: 'cpa-inicio',
    niche: 'Geral',
    metric: 'CPA Inicio de Campanha',
    value: 15,
    unit: 'BRL',
    source: 'Playbook - Secao 9.2: Comportamento do CPA ao Longo do Tempo',
  },
  {
    id: 'cpa-inicio-teto',
    niche: 'Geral',
    metric: 'CPA Inicio de Campanha (teto)',
    value: 28,
    unit: 'BRL',
    source: 'Playbook - Secao 9.2: Comportamento do CPA ao Longo do Tempo',
  },
  {
    id: 'cpa-meio',
    niche: 'Geral',
    metric: 'CPA Meio de Campanha',
    value: 40,
    unit: 'BRL',
    source: 'Playbook - Secao 9.2: Comportamento do CPA ao Longo do Tempo',
  },
  {
    id: 'cpa-meio-teto',
    niche: 'Geral',
    metric: 'CPA Meio de Campanha (teto)',
    value: 50,
    unit: 'BRL',
    source: 'Playbook - Secao 9.2: Comportamento do CPA ao Longo do Tempo',
  },
  {
    id: 'cpa-final',
    niche: 'Geral',
    metric: 'CPA Final de Campanha',
    value: 60,
    unit: 'BRL',
    source: 'Playbook - Secao 9.2: Comportamento do CPA ao Longo do Tempo',
  },
  {
    id: 'cpa-final-teto',
    niche: 'Geral',
    metric: 'CPA Final de Campanha (teto)',
    value: 90,
    unit: 'BRL',
    source: 'Playbook - Secao 9.2: Comportamento do CPA ao Longo do Tempo',
  },
  {
    id: 'cpa-pago-min',
    niche: 'Geral',
    metric: 'CPA Lancamento Pago (minimo)',
    value: 33,
    unit: 'BRL',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'cpa-pago-max',
    niche: 'Geral',
    metric: 'CPA Lancamento Pago (maximo)',
    value: 60,
    unit: 'BRL',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'cpa-kimura',
    niche: 'Design / Identidade Visual',
    metric: 'CPA Medio',
    value: 33,
    unit: 'BRL',
    source: 'Playbook - Case 1: Kimura',
  },
  {
    id: 'cpa-kimura-teto',
    niche: 'Design / Identidade Visual',
    metric: 'CPA Medio (teto)',
    value: 45,
    unit: 'BRL',
    source: 'Playbook - Case 1: Kimura',
  },
  {
    id: 'cpa-sombra',
    niche: 'Social Media / Prestadores de Servico',
    metric: 'CAC (Custo de Aquisicao de Cliente)',
    value: 42,
    unit: 'BRL',
    source: 'Playbook - Case 3: Eduardo Sombra',
  },
  {
    id: 'cpa-nicolas',
    niche: 'INSS de Obras',
    metric: 'CAC',
    value: 207,
    unit: 'BRL',
    source: 'Playbook - Case 5: Nicolas',
  },
  {
    id: 'cpa-bruna',
    niche: 'Direito Internacional de Familia',
    metric: 'CPM',
    value: 56.39,
    unit: 'BRL',
    source: 'Playbook - Case 4: Bruna e Arthur',
  },
]

// ============================================================
// Conversao Benchmarks
// ============================================================
const CONVERSION_BENCHMARKS: BenchmarkData[] = [
  // Conversao por tipo de comprador
  {
    id: 'conv-ingresso-min',
    niche: 'Geral',
    metric: 'Conversao: So ingresso (minimo)',
    value: 6,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Tipo de Comprador',
  },
  {
    id: 'conv-ingresso-max',
    niche: 'Geral',
    metric: 'Conversao: So ingresso (maximo)',
    value: 15,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Tipo de Comprador',
  },
  {
    id: 'conv-ingresso-gravacao-min',
    niche: 'Geral',
    metric: 'Conversao: Ingresso + Gravacao (minimo)',
    value: 10,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Tipo de Comprador',
  },
  {
    id: 'conv-ingresso-gravacao-max',
    niche: 'Geral',
    metric: 'Conversao: Ingresso + Gravacao (maximo)',
    value: 33,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Tipo de Comprador',
  },
  {
    id: 'conv-cashback-min',
    niche: 'Geral',
    metric: 'Conversao: Ingresso + Gravacao + Cashback (minimo)',
    value: 20,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Tipo de Comprador',
  },
  {
    id: 'conv-cashback-max',
    niche: 'Geral',
    metric: 'Conversao: Ingresso + Gravacao + Cashback (maximo)',
    value: 33,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Tipo de Comprador',
  },
  {
    id: 'conv-tripwire',
    niche: 'Geral',
    metric: 'Conversao: Comprador de Tripwire',
    value: 17.58,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Tipo de Comprador',
  },
  {
    id: 'conv-lead-frio',
    niche: 'Geral',
    metric: 'Conversao: Nao-comprador (lead frio)',
    value: 0.8,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Tipo de Comprador',
  },
  {
    id: 'conv-lote-0',
    niche: 'Geral',
    metric: 'Conversao: Comprador Lote 0 (primeiro a comprar)',
    value: 40,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Tipo de Comprador',
  },

  // Conversao por ticket
  {
    id: 'conv-ticket-997-min',
    niche: 'Geral',
    metric: 'Conversao: Produto R$997-1.500 (minimo)',
    value: 10,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Ticket',
  },
  {
    id: 'conv-ticket-997-max',
    niche: 'Geral',
    metric: 'Conversao: Produto R$997-1.500 (maximo)',
    value: 20,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Ticket',
  },
  {
    id: 'conv-ticket-2000-min',
    niche: 'Geral',
    metric: 'Conversao: Produto R$2.000-3.500 (minimo)',
    value: 8,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Ticket',
  },
  {
    id: 'conv-ticket-2000-max',
    niche: 'Geral',
    metric: 'Conversao: Produto R$2.000-3.500 (maximo)',
    value: 20,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Ticket',
  },
  {
    id: 'conv-ticket-5000',
    niche: 'Geral',
    metric: 'Conversao: Produto R$5.000 (faixa)',
    value: 6.5,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Ticket (6-7%)',
  },
  {
    id: 'conv-ticket-highticket-min',
    niche: 'Geral',
    metric: 'Conversao: High Ticket R$15k-20k via call (minimo)',
    value: 30,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Ticket',
  },
  {
    id: 'conv-ticket-highticket-max',
    niche: 'Geral',
    metric: 'Conversao: High Ticket R$15k-20k via call (maximo)',
    value: 55,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Conversao por Ticket',
  },

  // Conversao de lancamento gratuito vs pago
  {
    id: 'conv-gratuito-min',
    niche: 'Geral',
    metric: 'Conversao Lancamento Gratuito (minimo)',
    value: 1,
    unit: '%',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'conv-gratuito-max',
    niche: 'Geral',
    metric: 'Conversao Lancamento Gratuito (maximo)',
    value: 3,
    unit: '%',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'conv-pago-min',
    niche: 'Geral',
    metric: 'Conversao Lancamento Pago (minimo)',
    value: 15,
    unit: '%',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'conv-pago-max',
    niche: 'Geral',
    metric: 'Conversao Lancamento Pago (maximo)',
    value: 33,
    unit: '%',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },

  // Order bump conversions
  {
    id: 'conv-orderbump-gravacoes-min',
    niche: 'Geral',
    metric: 'Conversao Order Bump Gravacoes (minimo)',
    value: 20,
    unit: '%',
    source: 'Playbook - Secao 13.1: Metricas de Venda de Ingressos',
  },
  {
    id: 'conv-orderbump-gravacoes-max',
    niche: 'Geral',
    metric: 'Conversao Order Bump Gravacoes (maximo)',
    value: 43,
    unit: '%',
    source: 'Playbook - Secao 13.1: Metricas de Venda de Ingressos',
  },
  {
    id: 'conv-orderbump-debriefing-min',
    niche: 'Geral',
    metric: 'Conversao Order Bump Debriefing (minimo)',
    value: 18,
    unit: '%',
    source: 'Playbook - Secao 13.1: Metricas de Venda de Ingressos',
  },
  {
    id: 'conv-orderbump-debriefing-max',
    niche: 'Geral',
    metric: 'Conversao Order Bump Debriefing (maximo)',
    value: 32,
    unit: '%',
    source: 'Playbook - Secao 13.1: Metricas de Venda de Ingressos',
  },
  {
    id: 'conv-gravacao-para-principal-min',
    niche: 'Geral',
    metric: 'Conversao Gravacoes -> Produto Principal (minimo)',
    value: 22,
    unit: '%',
    source: 'Playbook - Secao 13.2: Metricas do Evento',
  },
  {
    id: 'conv-gravacao-para-principal-max',
    niche: 'Geral',
    metric: 'Conversao Gravacoes -> Produto Principal (maximo)',
    value: 27,
    unit: '%',
    source: 'Playbook - Secao 13.2: Metricas do Evento',
  },
  {
    id: 'conv-downsell-min',
    niche: 'Geral',
    metric: 'Conversao Downsell (minimo)',
    value: 5,
    unit: '%',
    source: 'Playbook - Secao 13.2: Metricas do Evento',
  },
  {
    id: 'conv-downsell-max',
    niche: 'Geral',
    metric: 'Conversao Downsell (maximo)',
    value: 7,
    unit: '%',
    source: 'Playbook - Secao 13.2: Metricas do Evento',
  },
  {
    id: 'conv-boleto-min',
    niche: 'Geral',
    metric: 'Conversao via Boleto (minimo)',
    value: 3,
    unit: '%',
    source: 'Playbook - Secao 13.2: Metricas do Evento',
  },
  {
    id: 'conv-boleto-max',
    niche: 'Geral',
    metric: 'Conversao via Boleto (maximo)',
    value: 5,
    unit: '%',
    source: 'Playbook - Secao 13.2: Metricas do Evento',
  },

  // Naming impact on conversions
  {
    id: 'conv-naming-replay',
    niche: 'Geral',
    metric: 'Conversao Order Bump "Replay"',
    value: 1.1,
    unit: '%',
    source: 'Playbook - Case 8: Willian Baldan',
  },
  {
    id: 'conv-naming-gravacoes',
    niche: 'Geral',
    metric: 'Conversao Order Bump "Gravacoes"',
    value: 4,
    unit: '%',
    source: 'Playbook - Case 8: Willian Baldan',
  },
  {
    id: 'conv-naming-aulas',
    niche: 'Geral',
    metric: 'Conversao Order Bump "Acesso em formato de aulas"',
    value: 6.56,
    unit: '%',
    source: 'Playbook - Case 8: Willian Baldan',
  },
]

// ============================================================
// ROAS Benchmarks
// ============================================================
const ROAS_BENCHMARKS: BenchmarkData[] = [
  {
    id: 'roas-gratuito-min',
    niche: 'Geral',
    metric: 'ROAS Lancamento Gratuito (minimo)',
    value: 2,
    unit: 'x',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'roas-gratuito-max',
    niche: 'Geral',
    metric: 'ROAS Lancamento Gratuito (maximo)',
    value: 4,
    unit: 'x',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'roas-pago-min',
    niche: 'Geral',
    metric: 'ROAS Lancamento Pago (minimo)',
    value: 5,
    unit: 'x',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'roas-pago-max',
    niche: 'Geral',
    metric: 'ROAS Lancamento Pago (maximo)',
    value: 23,
    unit: 'x',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'roas-meta-geral',
    niche: 'Geral',
    metric: 'ROAS Meta Geral',
    value: 5,
    unit: 'x',
    source: 'Playbook - Secao 13.2: Metricas do Evento',
  },
  {
    id: 'roas-primeiro-lancamento-min',
    niche: 'Geral',
    metric: 'ROAS 1o Lancamento Conservador (minimo)',
    value: 3,
    unit: 'x',
    source: 'Playbook - Resumo Executivo',
  },
  {
    id: 'roas-primeiro-lancamento-max',
    niche: 'Geral',
    metric: 'ROAS 1o Lancamento Conservador (maximo)',
    value: 5,
    unit: 'x',
    source: 'Playbook - Resumo Executivo',
  },
]

// ============================================================
// Page & Traffic Benchmarks
// ============================================================
const PAGE_TRAFFIC_BENCHMARKS: BenchmarkData[] = [
  // CTR
  {
    id: 'ctr-ruim',
    niche: 'Geral',
    metric: 'CTR - Ruim',
    value: 0.6,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'ctr-normal-min',
    niche: 'Geral',
    metric: 'CTR - Normal (minimo)',
    value: 0.7,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'ctr-normal-max',
    niche: 'Geral',
    metric: 'CTR - Normal (maximo)',
    value: 0.8,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'ctr-bom',
    niche: 'Geral',
    metric: 'CTR - Bom',
    value: 1,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'ctr-muito-bom',
    niche: 'Geral',
    metric: 'CTR - Muito Bom',
    value: 1.5,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },

  // Conversao da pagina
  {
    id: 'page-conv-ruim',
    niche: 'Geral',
    metric: 'Conversao da Pagina - Ruim',
    value: 3,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'page-conv-normal',
    niche: 'Geral',
    metric: 'Conversao da Pagina - Normal',
    value: 5,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'page-conv-bom-min',
    niche: 'Geral',
    metric: 'Conversao da Pagina - Bom (minimo)',
    value: 6,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'page-conv-bom-max',
    niche: 'Geral',
    metric: 'Conversao da Pagina - Bom (maximo)',
    value: 7,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'page-conv-muito-bom-min',
    niche: 'Geral',
    metric: 'Conversao da Pagina - Muito Bom (minimo)',
    value: 8,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'page-conv-muito-bom-max',
    niche: 'Geral',
    metric: 'Conversao da Pagina - Muito Bom (maximo)',
    value: 9,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },

  // Checkout to compra
  {
    id: 'checkout-ruim',
    niche: 'Geral',
    metric: 'Checkout to Compra - Ruim',
    value: 30,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'checkout-normal-min',
    niche: 'Geral',
    metric: 'Checkout to Compra - Normal (minimo)',
    value: 30,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'checkout-normal-max',
    niche: 'Geral',
    metric: 'Checkout to Compra - Normal (maximo)',
    value: 40,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'checkout-bom-min',
    niche: 'Geral',
    metric: 'Checkout to Compra - Bom (minimo)',
    value: 40,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'checkout-bom-max',
    niche: 'Geral',
    metric: 'Checkout to Compra - Bom (maximo)',
    value: 48,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'checkout-muito-bom',
    niche: 'Geral',
    metric: 'Checkout to Compra - Muito Bom',
    value: 48,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },

  // Connect Rate
  {
    id: 'connect-ruim',
    niche: 'Geral',
    metric: 'Connect Rate - Ruim',
    value: 80,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'connect-normal-min',
    niche: 'Geral',
    metric: 'Connect Rate - Normal (minimo)',
    value: 81,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'connect-normal-max',
    niche: 'Geral',
    metric: 'Connect Rate - Normal (maximo)',
    value: 90,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'connect-bom-min',
    niche: 'Geral',
    metric: 'Connect Rate - Bom (minimo)',
    value: 90,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'connect-bom-max',
    niche: 'Geral',
    metric: 'Connect Rate - Bom (maximo)',
    value: 94,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },
  {
    id: 'connect-muito-bom',
    niche: 'Geral',
    metric: 'Connect Rate - Muito Bom',
    value: 94,
    unit: '%',
    source: 'Playbook - Secao 17: Benchmark Metricas de Pagina e Trafego',
  },

  // CPM e Checkout Referencia
  {
    id: 'cpm-ref-min',
    niche: 'Geral',
    metric: 'CPM Referencia (minimo)',
    value: 16,
    unit: 'BRL',
    source: 'Playbook - Secao 13.1: Metricas de Venda de Ingressos',
  },
  {
    id: 'cpm-ref-max',
    niche: 'Geral',
    metric: 'CPM Referencia (maximo)',
    value: 28,
    unit: 'BRL',
    source: 'Playbook - Secao 13.1: Metricas de Venda de Ingressos',
  },
  {
    id: 'checkout-conv-min',
    niche: 'Geral',
    metric: 'Conversao do Checkout (minimo)',
    value: 15,
    unit: '%',
    source: 'Playbook - Secao 13.1: Metricas de Venda de Ingressos',
  },
  {
    id: 'checkout-conv-max',
    niche: 'Geral',
    metric: 'Conversao do Checkout (maximo)',
    value: 30,
    unit: '%',
    source: 'Playbook - Secao 13.1: Metricas de Venda de Ingressos',
  },
]

// ============================================================
// Comparecimento Benchmarks
// ============================================================
const ATTENDANCE_BENCHMARKS: BenchmarkData[] = [
  {
    id: 'comp-gratuito-min',
    niche: 'Geral',
    metric: 'Comparecimento Lancamento Gratuito (minimo)',
    value: 10,
    unit: '%',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'comp-gratuito-max',
    niche: 'Geral',
    metric: 'Comparecimento Lancamento Gratuito (maximo)',
    value: 15,
    unit: '%',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'comp-pago-min',
    niche: 'Geral',
    metric: 'Comparecimento Lancamento Pago (minimo)',
    value: 55,
    unit: '%',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'comp-pago-max',
    niche: 'Geral',
    metric: 'Comparecimento Lancamento Pago (maximo)',
    value: 80,
    unit: '%',
    source: 'Playbook - Secao 2: Comparativo de Metricas',
  },
  {
    id: 'comp-pago-meta',
    niche: 'Geral',
    metric: 'Comparecimento Pago Meta (quase nada de esforco)',
    value: 70,
    unit: '%',
    source: 'Playbook - Secao 6: Fase 3 Comparecimento',
  },
]

// ============================================================
// Tripwire Benchmarks
// ============================================================
const TRIPWIRE_BENCHMARKS: BenchmarkData[] = [
  {
    id: 'tripwire-49',
    niche: 'Geral',
    metric: 'Conversao Tripwire R$49',
    value: 0.83,
    unit: '%',
    source: 'Playbook - Secao 10: Estrategia de Tripwire',
  },
  {
    id: 'tripwire-37',
    niche: 'Geral',
    metric: 'Conversao Tripwire R$37',
    value: 3.19,
    unit: '%',
    source: 'Playbook - Secao 10: Estrategia de Tripwire',
  },
  {
    id: 'tripwire-27',
    niche: 'Geral',
    metric: 'Conversao Tripwire R$27',
    value: 5,
    unit: '%',
    source: 'Playbook - Secao 10: Estrategia de Tripwire',
  },
  {
    id: 'tripwire-valor-lead',
    niche: 'Geral',
    metric: 'Lead Comprador vale X mais que nao-comprador',
    value: 22,
    unit: 'x',
    source: 'Playbook - Secao 10: Estrategia de Tripwire',
  },
  {
    id: 'tripwire-conv-principal',
    niche: 'Geral',
    metric: 'Compradores Tripwire -> Produto Principal',
    value: 17.58,
    unit: '%',
    source: 'Playbook - Secao 10: Estrategia de Tripwire',
  },
  {
    id: 'tripwire-paga-trafego',
    niche: 'Geral',
    metric: 'Melhor dia: tripwire pagou X% do trafego',
    value: 55,
    unit: '%',
    source: 'Playbook - Secao 10: Estrategia de Tripwire',
  },
]

// ============================================================
// Traffic Distribution Benchmarks
// ============================================================
const DISTRIBUTION_BENCHMARKS: BenchmarkData[] = [
  {
    id: 'dist-trafego-min',
    niche: 'Geral',
    metric: 'Ingressos via Trafego Pago (minimo)',
    value: 75,
    unit: '%',
    source: 'Playbook - Secao 4.3: Origem dos Ingressos',
  },
  {
    id: 'dist-trafego-max',
    niche: 'Geral',
    metric: 'Ingressos via Trafego Pago (maximo)',
    value: 82,
    unit: '%',
    source: 'Playbook - Secao 4.3: Origem dos Ingressos',
  },
  {
    id: 'dist-organico',
    niche: 'Geral',
    metric: 'Ingressos via Conteudo Organico',
    value: 13,
    unit: '%',
    source: 'Playbook - Secao 4.3: Origem dos Ingressos',
  },
  {
    id: 'dist-bases-antigas',
    niche: 'Geral',
    metric: 'Ingressos via Bases Antigas (email, WhatsApp)',
    value: 8,
    unit: '%',
    source: 'Playbook - Secao 4.3: Origem dos Ingressos',
  },
  {
    id: 'dist-outros',
    niche: 'Geral',
    metric: 'Ingressos via Outros (Google Ads, indicacao)',
    value: 4,
    unit: '%',
    source: 'Playbook - Secao 4.3: Origem dos Ingressos',
  },

  // Orcamento distribution
  {
    id: 'budget-venda',
    niche: 'Geral',
    metric: 'Orcamento: Venda de Ingressos',
    value: 82,
    unit: '%',
    source: 'Playbook - Secao 4.3: Distribuicao do Orcamento',
  },
  {
    id: 'budget-conteudo',
    niche: 'Geral',
    metric: 'Orcamento: Distribuicao de Conteudo',
    value: 10,
    unit: '%',
    source: 'Playbook - Secao 4.3: Distribuicao do Orcamento',
  },
  {
    id: 'budget-remarketing',
    niche: 'Geral',
    metric: 'Orcamento: Remarketing + Aquecimento',
    value: 5,
    unit: '%',
    source: 'Playbook - Secao 4.3: Distribuicao do Orcamento',
  },
  {
    id: 'budget-reserva',
    niche: 'Geral',
    metric: 'Orcamento: Reserva/Outros',
    value: 3,
    unit: '%',
    source: 'Playbook - Secao 4.3: Distribuicao do Orcamento',
  },

  // Platform distribution
  {
    id: 'platform-facebook-min',
    niche: 'Geral',
    metric: 'Ingressos via Facebook/Meta (minimo)',
    value: 75,
    unit: '%',
    source: 'Playbook - Secao 9.3: Facebook vs Google',
  },
  {
    id: 'platform-facebook-max',
    niche: 'Geral',
    metric: 'Ingressos via Facebook/Meta (maximo)',
    value: 82,
    unit: '%',
    source: 'Playbook - Secao 9.3: Facebook vs Google',
  },
  {
    id: 'platform-google-min',
    niche: 'Geral',
    metric: 'Ingressos via Google Ads (minimo)',
    value: 10,
    unit: '%',
    source: 'Playbook - Secao 9.3: Facebook vs Google',
  },
  {
    id: 'platform-google-max',
    niche: 'Geral',
    metric: 'Ingressos via Google Ads (maximo)',
    value: 12,
    unit: '%',
    source: 'Playbook - Secao 9.3: Facebook vs Google',
  },
]

// ============================================================
// Consolidated BENCHMARKS array
// ============================================================
export const BENCHMARKS: BenchmarkData[] = [
  ...CPA_BENCHMARKS,
  ...CONVERSION_BENCHMARKS,
  ...ROAS_BENCHMARKS,
  ...PAGE_TRAFFIC_BENCHMARKS,
  ...ATTENDANCE_BENCHMARKS,
  ...TRIPWIRE_BENCHMARKS,
  ...DISTRIBUTION_BENCHMARKS,
]

// ============================================================
// Validated Niches
// ============================================================
export interface ValidatedNicheData {
  id: string
  niche: string
  caseName: string
  result: string
}

export const VALIDATED_NICHES: ValidatedNicheData[] = [
  {
    id: 'niche-design',
    niche: 'Design / Identidade Visual',
    caseName: 'Kimura',
    result: 'R$2M+/lancamento',
  },
  {
    id: 'niche-photoshop',
    niche: 'Photoshop',
    caseName: 'Lucas Rosa',
    result: 'R$1.2M',
  },
  {
    id: 'niche-ui-design',
    niche: 'UI Design / Framer',
    caseName: 'Cassio',
    result: 'R$400k do zero',
  },
  {
    id: 'niche-social-media',
    niche: 'Social Media',
    caseName: 'Pedro/Sombra',
    result: 'R$100k com R$10k',
  },
  {
    id: 'niche-direito',
    niche: 'Direito Internacional',
    caseName: 'Bruna/Arthur',
    result: 'R$368k com 414 ingressos',
  },
  {
    id: 'niche-inss',
    niche: 'INSS de Obras',
    caseName: 'Nicolas',
    result: 'R$167k, 24% conversao',
  },
  {
    id: 'niche-gestao-escolar',
    niche: 'Gestao Escolar',
    caseName: 'Lucas/Raquel',
    result: '500 ingressos com 3k seguidores',
  },
  {
    id: 'niche-jiu-jitsu',
    niche: 'Jiu-Jitsu (Business)',
    caseName: 'Fabio Gurgel',
    result: '800 ingressos, R$200k',
  },
  {
    id: 'niche-acompanhamento-fetal',
    niche: 'Acompanhamento Fetal',
    caseName: 'Via Gabriel',
    result: 'Servico R$8-10k',
  },
  {
    id: 'niche-advocacia',
    niche: 'Advocacia',
    caseName: 'Via Gabriel',
    result: 'Pacote R$25-30k/ano',
  },
  {
    id: 'niche-reconquistar-ex',
    niche: 'Reconquistar Ex',
    caseName: 'Rafael Mariano',
    result: 'Ticket R$2k',
  },
  {
    id: 'niche-ecommerce',
    niche: 'E-commerce',
    caseName: 'Mentorado',
    result: '500 ingressos, break-even',
  },
  {
    id: 'niche-hidroponia',
    niche: 'Hidroponia',
    caseName: 'Mentorado',
    result: 'Micro-nicho validado',
  },
  {
    id: 'niche-tatuagem',
    niche: 'Tatuagem',
    caseName: 'Chico',
    result: 'Micro-nicho validado',
  },
  {
    id: 'niche-pecuaria',
    niche: 'Pecuaria',
    caseName: 'Orbica',
    result: 'Todos lancamentos do nicho',
  },
]
