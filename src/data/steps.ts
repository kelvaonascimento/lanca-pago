// ============================================================================
// LAUNCH STEPS DATA
// Extracted from PASSO_A_PASSO.md - Willian Baldan's Paid Launch Playbook
// 38 steps across 5 phases (Fase 0 through Fase 4)
// ============================================================================

export interface StepDefinition {
  key: string;
  phase: number;
  order: number;
  title: string;
  description: string;
  howTo: string;
  benchmark: string;
  tip: string;
  commonError: string;
  items: string[];
  dependsOn?: string;
}

export const PHASES = [
  {
    phase: 0,
    name: 'Decisao e Analise',
    description: 'Avalie se o lancamento pago faz sentido, analise o nicho, monte a equipe minima e faca as projecoes financeiras antes de comecar.',
    color: '#6366f1',
    steps: '1-4',
    duration: '1-2 semanas',
  },
  {
    phase: 1,
    name: 'Planejamento',
    description: 'Defina metas de ingressos, estruture lotes, order bumps, produto principal, projecao de faturamento, Big Idea, trafego e cronograma.',
    color: '#8b5cf6',
    steps: '5-14',
    duration: '2-4 semanas',
  },
  {
    phase: 2,
    name: 'Preparacao e Venda de Ingressos',
    description: 'Crie a identidade visual, pagina de vendas, checkout, automacoes, criativos e campanhas de trafego. Abra vendas e gerencie lotes.',
    color: '#ec4899',
    steps: '15-24',
    duration: '30-44 dias',
  },
  {
    phase: 3,
    name: 'Evento',
    description: 'Execute o evento ao vivo em 2 dias: sequencia de comparecimento, check tecnico, conteudo, pitch e ativacao comercial.',
    color: '#f97316',
    steps: '25-31',
    duration: '2 dias (sabado + domingo)',
  },
  {
    phase: 4,
    name: 'Pos-Evento e Otimizacao',
    description: 'Mantenha o carrinho aberto, encerre cashback e gravacoes em datas diferentes, ative downsell, follow-up comercial e consolide metricas.',
    color: '#10b981',
    steps: '32-38',
    duration: '7-14 dias',
  },
] as const;

export const LAUNCH_STEPS: StepDefinition[] = [
  // ===========================================================================
  // FASE 0: DECISAO E ANALISE (Passos 1-4)
  // ===========================================================================
  {
    key: 'phase0_step1',
    phase: 0,
    order: 1,
    title: 'Avaliar se o Lancamento Pago Faz Sentido para o Seu Projeto',
    description:
      'Antes de qualquer planejamento, avalie se o modelo de lancamento pago e adequado ao seu momento, nicho e especialista. O lancamento pago nao e para todos -- mas funciona para muito mais nichos do que as pessoas imaginam.',
    howTo:
      'Responda com honestidade: (1) O especialista tem dominio tecnico real? (2) Existe publico que pagaria R$19-39 para aprender algo pratico em 2 dias? (3) O especialista aguenta 16h ao vivo? (4) Existe um produto principal para vender ao final? (5) Pode investir R$3k-10k em trafego no primeiro lancamento?',
    benchmark:
      'SIM para 4+: lancamento pago faz sentido. SIM para 3: teste pequeno (200-300 ingressos). Menos de 3: reavalie ou construa base primeiro.',
    tip: '"Funciona pra voce tambem, acredita. Usa a estrategia certa, produza conteudo, faca uma boa distribuicao, tenha um mecanismo unico e seja competente no que voce faz." Case Cassio: projeto do zero, 9k seguidores, primeiro lancamento R$262k.',
    commonError:
      'Achar que precisa ser uma grande autoridade no nicho. Cassio: projeto do zero, conta de 3 meses, 9k seguidores, primeiro lancamento R$262k. Sombra: 3k seguidores e fez R$100k+ no primeiro lancamento.',
    items: [
      'Respondi as 5 perguntas de viabilidade',
      'Tenho clareza sobre o especialista e seu dominio tecnico',
      'Identifiquei pelo menos 1 produto principal para vender apos o evento',
      'Tenho (ou consigo levantar) capital minimo para trafego',
    ],
  },
  {
    key: 'phase0_step2',
    phase: 0,
    order: 2,
    title: 'Analisar o Tamanho do Nicho e Publico Disponivel',
    description:
      'Entenda o tamanho do seu mercado, o potencial de ingressos e se o nicho suporta lancamentos repetidos. Micronichos funcionam extraordinariamente bem no lancamento pago.',
    howTo:
      'Verifique a audiencia do especialista (Instagram, YouTube, email, grupos). Calcule potencial de ingressos (1-5% da base). Avalie o CPM do nicho. Pesquise concorrencia -- se ninguem faz eventos pagos no nicho, e oportunidade.',
    benchmark:
      '1% da base = lancamento conservador (primeiro). 3-5% = lancamento otimizado. Kimura com 374k: 4k-7k ingressos. Cassio com 9k: 588 ingressos.',
    tip: '"Eu estou num micronicho do design, que e a identidade visual. Enquanto ninguem faz lancamento de 500, a gente ta fazendo lancamento de 2 milhoes." Praticamente qualquer tamanho de projeto consegue vender 300-400 ingressos.',
    commonError:
      'Achar que seu nicho e pequeno demais. Willian opera em design de identidade visual (sub-nicho de sub-nicho) e fatura 8 digitos por ano com lancamentos pagos. O poder esta na especificidade.',
    items: [
      'Mapeei o tamanho da audiencia do especialista em todas as plataformas',
      'Calculei o potencial de ingressos (1-5% da base)',
      'Pesquisei concorrencia e oportunidades no nicho',
      'Defini se e micronicho (e entendi que isso e uma VANTAGEM)',
    ],
    dependsOn: 'phase0_step1',
  },
  {
    key: 'phase0_step3',
    phase: 0,
    order: 3,
    title: 'Definir a Equipe Minima Necessaria',
    description:
      'Monte o time essencial. Lancamento pago exige menos pessoas que o gratuito, mas as funcoes certas precisam estar cobertas.',
    howTo:
      'Equipe minima (3 pessoas): Estrategista, Especialista, Gestor de trafego. Equipe ideal (9-12 pessoas): + Copywriter, Designer/editor de video, Gestor de projetos, Suporte/comercial (2), Audiovisual, Infraestrutura.',
    benchmark:
      'Willian saiu de 29 para 9 pessoas, faturando igual ou mais. Meta: R$1M por colaborador/ano. Caso Sombra: R$100k+ com 3 pessoas e R$10k de investimento.',
    tip: '"A gente esta em 9 pessoas, vai faturar algo proximo ou acima do que faturou ano passado com 3x mais pessoas, so que agora com muito mais ruas, investindo bem menos, com muito menos trabalho."',
    commonError:
      'Contratar demais antes de validar. Comece enxuto. No lancamento pago, a complexidade operacional e menor. Nao precisa de equipe grande de aquecimento ou CPLs multiplos.',
    items: [
      'Defini quem sera o estrategista',
      'Defini quem sera o especialista',
      'Defini quem fara o trafego',
      'Mapeei funcoes adicionais necessarias (copy, design, suporte)',
      'Toda a equipe entende o modelo de lancamento pago (nao e CPL)',
    ],
    dependsOn: 'phase0_step2',
  },
  {
    key: 'phase0_step4',
    phase: 0,
    order: 4,
    title: 'Calcular Investimento Minimo e Projecao Conservadora',
    description:
      'Faca as contas ANTES de comecar. Defina quanto pode investir, qual o retorno minimo esperado e qual e o cenario pessimista.',
    howTo:
      'Formula: Investimento / CPA estimado = Ingressos via trafego. + Ingressos organicos = Total. Total x Taxa conversao = Vendas. Vendas x Ticket = Faturamento produto principal. + Order bumps + Ingressos = Faturamento total.',
    benchmark:
      'Sombra: R$10k investido, 233 ingressos, R$100k+ (ROAS 8.9x). Cassio: R$60k, 588 ingressos, R$262k (4.5x). Kimura: R$40k, 4k+ ingressos, R$1.5M (23x). Lucas Rosa: R$73k, 2.148 ingressos, R$740k (10x).',
    tip: '"Qual e o risco? Cara, e praticamente zero. Eu vou vender um ingresso que vai pagar o trafego. Se der errado, o pior que vai acontecer e sair do zero a zero."',
    commonError:
      'Nao fazer a projecao completa antes de comecar. Planejar so o faturamento de ingressos e esquecer dos order bumps, que frequentemente DOBRAM ou TRIPLICAM o faturamento total.',
    items: [
      'Defini valor maximo de investimento em trafego',
      'Calculei CPA estimado para o nicho',
      'Projetei cenario pessimista (CAC alto, menos ingressos)',
      'Projetei cenario realista',
      'Projetei cenario otimista',
      'Garanti que o cenario pessimista nao quebra o negocio',
      'Entendi que o ingresso tende a pagar o trafego na captacao',
    ],
    dependsOn: 'phase0_step3',
  },

  // ===========================================================================
  // FASE 1: PLANEJAMENTO (Passos 5-14)
  // ===========================================================================
  {
    key: 'phase1_step5',
    phase: 1,
    order: 1,
    title: 'Definir Meta de Ingressos',
    description:
      'Estabeleca um numero claro de ingressos a serem vendidos. Esse numero define TUDO: investimento, equipe, faturamento.',
    howTo:
      'Olhe para sua base atual e calcule 1-5%. Se e o primeiro lancamento, mire entre 200 e 500 ingressos. Calcule o pacing diario: total de ingressos / dias de venda. Considere dias uteis vs fins de semana.',
    benchmark:
      'Pacing de 7 vendas/dia e factivel para projetos pequenos. 100+ vendas/dia para projetos maduros. Sombra: 233 ingressos em 32 dias = 7/dia. Willian: 4.500 em 44 dias = 102/dia.',
    tip: '"Parece dificil fazer 100 mil. Mas quando voce fala que tem que fazer 7 vendas por dia durante 32 dias pra botar 200 e tantos ingressos e botar 100 mil pra dentro, fica muito mais factivel."',
    commonError:
      'Mirar alto demais no primeiro lancamento. Melhor vender 300 ingressos e converter bem do que mirar 1.000 e vender 400 com a moral la embaixo.',
    items: [
      'Defini meta de ingressos (numero exato)',
      'Calculei pacing diario (vendas/dia necessarias)',
      'Calculei pacing por dia util',
      'Meta esta realista para o tamanho da minha base',
    ],
    dependsOn: 'phase0_step4',
  },
  {
    key: 'phase1_step6',
    phase: 1,
    order: 2,
    title: 'Montar Estrutura de Lotes',
    description:
      'Divida seus ingressos em 7 a 9 lotes com precos crescentes. A virada de lote e a principal ferramenta de escassez e urgencia durante a venda de ingressos.',
    howTo:
      'Defina 7-9 lotes com precos progressivos. Comece barato (R$19-39) e termine mais caro (R$74-97). Distribua quantidade por lote (mais nos primeiros). Calcule ticket medio ponderado.',
    benchmark:
      'Ticket medio resultante: R$33-57. Kimura: lote 0 a R$19, ultimo R$74, TM R$35. Cassio: TM R$34. Willian: lotes de R$29 a R$74, 9 lotes, TM R$57.',
    tip: '"Quanto maior o ingresso, maior a conversao do order bump. Virada de lote e comunicar isso na pagina, ter barra de progresso, automatizar essa parada, saber usar a escassez a seu favor o tempo inteiro."',
    commonError:
      'Fazer poucos lotes (3-4). Quanto mais lotes, mais momentos de escassez voce cria. Cada virada e uma oportunidade de comunicacao que gera pico de vendas.',
    items: [
      'Defini 7-9 lotes com precos crescentes',
      'Distribui quantidade de ingressos por lote',
      'Calculei ticket medio ponderado',
      'Preco inicial e atrativo (R$19-39)',
      'Cada virada de lote esta no calendario',
    ],
    dependsOn: 'phase1_step5',
  },
  {
    key: 'phase1_step7',
    phase: 1,
    order: 3,
    title: 'Definir Order Bumps',
    description:
      'Configure de 1 a 3 order bumps no checkout. Os order bumps sao responsaveis por DOBRAR ou TRIPLICAR o faturamento de ingressos. Sao a chave financeira do lancamento pago.',
    howTo:
      'OB1 (OBRIGATORIO): Gravacoes do evento (R$147-197, conv. 6-20%). Chame de "gravacoes em formato de aulas", NAO "replay". OB2 (opcional): Debriefing/Material (R$97, conv. 7-32%). OB3 (opcional): Pack de criativos/ferramentas (R$147, conv. 5-15%).',
    benchmark:
      '"Replay" = 1,1% conversao. "Gravacoes" = 3-4%. "Evento em formato de aulas" = 6,5%+. Debriefing = 18-32%. Drive de criativos = 5-15%.',
    tip: '"Gravacoes converte mais do que replay. A gente mudou de replay pra gravacoes e a conversao foi de 1,1% para 4,5%. Depois de outro ajuste, foi de 4,5% para 20%." Cada order bump tem objetivo alem do dinheiro.',
    commonError:
      'Chamar de "replay" em vez de "gravacoes em formato de aulas". Nao oferecer cashback das gravacoes no produto principal. Vender gravacoes muito baratas (perde o efeito do cashback).',
    items: [
      'Order Bump 1 (gravacoes) definido com preco e copy',
      'Testei a nomenclatura: "gravacoes em formato de aulas"',
      'Order Bump 2 definido (se aplicavel)',
      'Order Bump 3 definido (se aplicavel)',
      'Estrategia de cashback definida',
      'Cada order bump tem um objetivo estrategico alem do faturamento',
    ],
    dependsOn: 'phase1_step6',
  },
  {
    key: 'phase1_step8',
    phase: 1,
    order: 4,
    title: 'Definir Produto Principal e Ticket',
    description:
      'Defina qual e o produto que sera vendido no pitch do evento. Pode ser curso, mentoria, servico ou programa.',
    howTo:
      'Defina o tipo (curso, mentoria, mastermind, servico). Defina o ticket baseado no ROI que o produto gera. Regra do cashback: gravacoes = ~10% do produto principal. Ofereca boleto parcelado via time comercial (ticket ligeiramente mais alto).',
    benchmark:
      'Kimura: R$1.198-1.500 (mid-ticket) -> 15-21% conversao. Cassio: R$1.500 -> 26%. Bruna/Arthur: R$3.500 -> 20%. Sombra: R$4.997 -> 6,4%. Willian: R$10.000 (high ticket) -> projecao 6%.',
    tip: '"Quem quer comprar seu produto esta disposto a pagar muito mais do que voce esta cobrando. So que voce esta baixando o preco pensando em pegar aquele que nao quer comprar."',
    commonError:
      'Cobrar barato por inseguranca. O ticket deve ser precificado pelo ROI que gera, nao pelo medo de nao vender. Se o produto gera resultado real, cobre mais.',
    items: [
      'Produto principal definido (nome, formato, entrega)',
      'Ticket definido com base no ROI para o aluno',
      'Opcao de boleto parcelado configurada (ticket ligeiramente maior)',
      'Cashback das gravacoes calculado como % do produto principal',
      'Pagina de vendas do produto principal pronta ou em producao',
    ],
    dependsOn: 'phase1_step7',
  },
  {
    key: 'phase1_step9',
    phase: 1,
    order: 5,
    title: 'Criar Projecao Completa de Faturamento',
    description:
      'Monte uma planilha linha por linha com TODAS as fontes de receita. Este e o documento mais importante do planejamento -- ele dita todas as decisoes.',
    howTo:
      'Monte na ordem: 1) Ingressos (qtd x TM). 2) Order bumps (gravacoes, debriefing, outros). 3) Produto principal (cartao + boleto + cashback). 4) Upsell. 5) Downsell. Total geral, investimento, ROAS, margem.',
    benchmark:
      'Exemplo Willian: 750 ingressos x R$57 = R$42.750 + OBs R$37k + Cashback R$26.250 + Produto principal R$450k + Downsell R$131k = R$811k total. ROAS 5.4x.',
    tip: '"Eu planejei vender R$42 mil so de ingressos. Vendendo esses order bumps, vou vender mais R$37 mil. Quase dobra. E com o produto principal, vai triplicar."',
    commonError:
      'Planejar so o ingresso e o produto principal, esquecendo que os order bumps e o downsell podem representar 40-60% do faturamento total.',
    items: [
      'Planilha de projecao completa montada',
      'Cada linha tem: qtd, taxa de conversao, ticket, faturamento',
      'Cenario pessimista calculado',
      'Cenario realista calculado',
      'Cenario otimista calculado',
      'ROAS projetado em cada cenario',
    ],
    dependsOn: 'phase1_step8',
  },
  {
    key: 'phase1_step10',
    phase: 1,
    order: 6,
    title: 'Definir Big Idea e Narrativa/Tema',
    description:
      'Crie um tema ou narrativa que torne o evento unico, memoravel e diferente de "mais um curso online". Isso e o que separa lancamentos de 6 digitos dos de 7 digitos.',
    howTo:
      'Pergunte ao especialista: "O que as pessoas mais perguntam?" Encontre a Big Idea (angulo unico). Use o formato "FACA, nao aprenda". Exemplos reais: "Viagem no Tempo", "Do Figma ao Framer", "Identidade Visual com IA".',
    benchmark:
      'Tema quente (ex: IA aplicada) pode aumentar vendas de ingressos em 50-100%. Kimura: 6 lancamentos repetidos e bilheteria sempre acima de 4.000 ingressos.',
    tip: '"Um tema quente e melhor do que um publico quente. A gente falou de design com IA. Foi uma outra promessa, um outro evento e a gente criou um outro produto. A aderencia foi muito legal." Nao faca nada que pareca CPL.',
    commonError:
      'Fazer um lancamento generico sem narrativa. "Workshop de Marketing Digital" nao vende. "2 Dias Construindo Sua Maquina de Vendas com IA" vende.',
    items: [
      'Big Idea definida (angulo unico do evento)',
      'Tema/narrativa criada',
      'Promessa usa linguagem de ACAO ("faca", "crie", "construa")',
      'O tema gera curiosidade e desejo',
      'O especialista valida e se empolga com o tema',
    ],
    dependsOn: 'phase1_step5',
  },
  {
    key: 'phase1_step11',
    phase: 1,
    order: 7,
    title: 'Planejar Distribuicao de Trafego',
    description:
      'Distribua seu orcamento de trafego em categorias claras. A maior parte vai para venda de ingressos, mas reservas para conteudo, remarketing e emergencias sao essenciais.',
    howTo:
      'Distribuicao recomendada: Vendas de ingressos 82%, Distribuicao de conteudo 10%, Remarketing + aquecimento 5%, Reserva 3%. Origem esperada: 60-75% trafego pago, 13-25% conteudo organico, 8-17% bases antigas.',
    benchmark:
      'Kimura: 75% trafego, 25% organico. Sombra: 70% trafego, 30% organico. Bruna/Arthur: 61% trafego, 38% organico. Google traz ~10-12% dos ingressos totais.',
    tip: '"Em lancamento pago, e bizarra a proporcao de vendas via trafego. Quando o meu CPA estiver alto, eu aumento a verba da distribuicao pra diminuir esse CPA. Isso nunca pode ser escrito em pedra."',
    commonError:
      'Nao investir em distribuicao de conteudo. O organico alimenta o trafego pago -- quando para de produzir conteudo por 3 dias, o CPA sobe. Os dois trabalham juntos.',
    items: [
      'Orcamento total de trafego definido',
      'Distribuicao por categoria definida (82/10/5/3 ou ajustado)',
      'Expectativa de ingressos por origem (trafego/organico/base)',
      'Margem de reserva separada',
      'Custo de API WhatsApp/Manychat incluido no remarketing',
    ],
    dependsOn: 'phase1_step9',
  },
  {
    key: 'phase1_step12',
    phase: 1,
    order: 8,
    title: 'Calcular CPA Maximo e Pacing Diario',
    description:
      'Defina o preco maximo que pode pagar por ingresso (CPA) e quantas vendas por dia precisa atingir.',
    howTo:
      'CPA maximo = Orcamento de vendas / Meta de ingressos via trafego. Pacing diario: total / dias de venda. Pacing dias uteis: total / dias uteis. Media = (ambos) / 2.',
    benchmark:
      'Kimura: CPA R$33-41. Willian: R$60-130. Sombra: R$42. Bruna/Arthur: R$158 (ticket alto R$3.500). Medio geral: R$45-60 para mid-ticket.',
    tip: '"Eu comeco com CPA menor e ele vai aumentando porque o publico qualificado e finito. Preciso manter ate 60-70% dos ingressos vendidos um CAC abaixo do teto, pra que na reta final bote mais pressao."',
    commonError:
      'Desesperar quando o CPA sobe nos ultimos dias. E normal -- o publico mais qualificado ja comprou. Reserve verba para escalar nos ultimos lotes com CPA mais alto.',
    items: [
      'CPA maximo calculado',
      'Pacing diario definido (total e por dia util)',
      'Entendi que o CPA comeca baixo e sobe ao longo da captacao',
      'Reservei verba extra para os ultimos lotes',
    ],
    dependsOn: 'phase1_step11',
  },
  {
    key: 'phase1_step13',
    phase: 1,
    order: 9,
    title: 'Definir Cronograma do Evento',
    description:
      'Defina quando sera o evento e qual sera o formato exato de cada dia. O padrao e sabado + domingo, 9h30 as 17h30.',
    howTo:
      'Formato padrao: Sabado 9h30-17h30 (8h), Domingo 9h30-17h30 (8h) = 16 horas de tela. Dia 1: abertura + 3 blocos de conteudo + seeding. Dia 2: conteudo avancado + projeto final + 3 pitches (pre-pitch, principal, fechamento).',
    benchmark:
      'Comparecimento dia 1: 65-80%. Dia 2: 55-70%. No momento do pitch: 50-65%. 16 horas = 960 Reels de 1 minuto. Muito tempo de tela e poder de conversao.',
    tip: '"Sao 16 horas de tempo de tela em 2 dias. Se voce souber usar bem, consegue contar historias, gerar autoridade, reciprocidade, inspiracao." Use intervalos para rodar video de vendas, cases e depoimentos.',
    commonError:
      'Fazer o evento em dias de semana ou a noite. Sabado e domingo funciona melhor. E entregar pouco conteudo com medo de "dar demais" -- entregue TUDO, o produto tem que ser a continuidade natural.',
    items: [
      'Data do evento definida (sabado + domingo)',
      'Horarios definidos (9h30 as 17h30 padrao)',
      'Cronograma hora a hora de cada dia',
      'Intervalos estrategicos planejados (cases, videos)',
      'Momentos de pitch definidos (3 pitches: pre-pitch, pitch principal, fechamento)',
      'Plataforma definida (Zoom ate 1.000 pessoas, YouTube acima)',
    ],
    dependsOn: 'phase1_step10',
  },
  {
    key: 'phase1_step14',
    phase: 1,
    order: 10,
    title: 'Montar Calendario Completo do Lancamento',
    description:
      'Monte um calendario retroativo a partir da data do evento com TODAS as datas e marcos importantes.',
    howTo:
      'Calendario modelo (44 dias): S-7 Preparacao, S-6 Abertura vendas, S-5 a S-3 Venda ativa, S-2 Aceleracao, S-1 Semana do evento, S0 EVENTO, S+1 Carrinho aberto, S+2 Encerramento.',
    benchmark:
      '30-44 dias de venda de ingressos e o padrao. Virada de lote a cada 4-7 dias. Sequencia de comparecimento comeca 7 dias antes do evento.',
    tip: '"A gente tem um calendario do lancamento separando cada etapa. Tem checklist de criativos de video, de imagem, de paginas, tudo."',
    commonError:
      'Nao ter dias suficientes de captacao. Se comeca tarde, perde lotes baratos e o CPA medio sobe. Planeje pelo menos 30 dias.',
    items: [
      'Calendario completo montado com todas as datas',
      'Data de abertura de vendas definida',
      'Datas de virada de cada lote definidas',
      'Data do evento definida',
      'Datas de encerramento de cashback, gravacoes, carrinho definidas',
      'Calendario compartilhado com toda a equipe',
    ],
    dependsOn: 'phase1_step13',
  },

  // ===========================================================================
  // FASE 2: PREPARACAO E VENDA DE INGRESSOS (Passos 15-24)
  // ===========================================================================
  {
    key: 'phase2_step15',
    phase: 2,
    order: 1,
    title: 'Criar Identidade Visual do Evento',
    description:
      'Crie uma identidade visual propria para o evento que transmita profissionalismo, seja coerente com o tema/narrativa e funcione em todos os pontos de contato.',
    howTo:
      'Defina nome do evento (conectado com a Big Idea). Crie logotipo ou identidade visual. Defina paleta de cores e tipografia. Produza assets: banners, thumbnails, templates. Crie countdown e materiais de antecipacao.',
    benchmark:
      'A identidade visual deve ser reconhecivel em 2 segundos. Deve funcionar em: pagina de vendas, checkout, criativos, grupos WhatsApp, emails, evento ao vivo. Willian refaz a identidade a cada lancamento.',
    tip: '"A gente mudou pagina ate a identidade pra conseguir ter um recesso legal pro time descansar e um periodo bom de venda de ingressos."',
    commonError:
      'Usar identidade visual generica ou reaproveitar sem adaptacao. Cada edicao do evento deve parecer NOVA, mesmo que o formato se repita.',
    items: [
      'Nome do evento definido',
      'Identidade visual criada (logo, cores, tipografia)',
      'Assets produzidos para todos os canais',
      'Templates de criativos prontos',
      'Materiais de countdown/antecipacao prontos',
    ],
    dependsOn: 'phase1_step14',
  },
  {
    key: 'phase2_step16',
    phase: 2,
    order: 2,
    title: 'Construir Pagina de Vendas do Ingresso',
    description:
      'A pagina de vendas e um dos 3 pilares que carregam 80% do resultado (junto com promessa e criativos). Ela deve ser clara, atrativa e converter.',
    howTo:
      'Elementos obrigatorios: Headline com promessa clara, Subheadline, Video de apresentacao, Barra de progresso de lotes, Preco/lote atual, Cronograma, Bio do especialista, Depoimentos, FAQ e CTA repetido.',
    benchmark:
      'Taxa de conversao da pagina: 3-7%. Connect Rate (Meta): 90-94%. Sombra: 94% Connect Rate e 5,44% de conversao de pagina.',
    tip: '"Ter barra de progresso na pagina e automatizar. Ela e alimentada, voce nao precisa nem recarregar a pagina pra ela avancar." As tres coisas que carregam 80%: promessa, criativos e pagina.',
    commonError:
      'Pagina com muita informacao sem hierarquia visual. O visitante deve entender em 10 segundos: O QUE e, QUANDO e, QUANTO CUSTA e COMO COMPRAR.',
    items: [
      'Headline com promessa de acao ("crie", "construa", "faca")',
      'Video do especialista na pagina',
      'Barra de progresso de lotes funcionando',
      'Preco e lote atual em destaque',
      'Cronograma do evento visivel',
      'Bio do especialista com credibilidade',
      'Depoimentos/cases',
      'FAQ com objecoes principais',
      'Botao CTA em multiplos pontos',
      'Pagina testada em mobile e desktop',
    ],
    dependsOn: 'phase2_step15',
  },
  {
    key: 'phase2_step17',
    phase: 2,
    order: 3,
    title: 'Configurar Checkout com Order Bumps na Hotmart',
    description:
      'Configure o checkout com todos os order bumps, garantindo que a experiencia de compra seja fluida e os produtos estejam corretamente vinculados.',
    howTo:
      'Crie o produto "Ingresso" na Hotmart com todos os lotes. Adicione order bumps no checkout. Configure links diferentes para cada lote. Teste TODOS os links antes de abrir vendas. Configure emails automaticos.',
    benchmark:
      'Checkout deve carregar em menos de 3 segundos. Conversao do order bump (gravacoes): meta minima 6%. Teste todos os links antes de subir anuncios.',
    tip: '"A gente tem checklist de precos de cada lote, link de cada lote. Deixa o checkout personalizado tudo antes."',
    commonError:
      'Nao testar os links antes de subir anuncios. Trocar o lote na Hotmart e esquecer de atualizar o link nos anuncios e na pagina.',
    items: [
      'Produto "Ingresso" criado na Hotmart',
      'Order bumps configurados no checkout',
      'Links de checkout de cada lote gerados e testados',
      'Emails de confirmacao configurados',
      'Pagina de obrigado pos-compra configurada',
      'Teste completo do fluxo de compra (do anuncio ao email)',
    ],
    dependsOn: 'phase2_step16',
  },
  {
    key: 'phase2_step18',
    phase: 2,
    order: 4,
    title: 'Configurar Automacoes',
    description:
      'Configure todas as automacoes que vao rodar durante a venda de ingressos e o evento: virada de lotes, barra de progresso, emails, WhatsApp, onboarding.',
    howTo:
      'Automacoes essenciais: Virada automatica de lotes, Barra de progresso na pagina, Email de boas-vindas, Onboarding WhatsApp, Sequencia de comparecimento (D-7, D-3, D-1, 1h antes, inicio), Emails de virada de lote.',
    benchmark:
      'Taxa de entrada no grupo WhatsApp: 55-82%. Hack: colocar um "presente" na descricao do grupo aumenta entrada de 60% para 82%+.',
    tip: '"A gente ta vendo ate pra automatizar essas viradas de lote. A barrinha, ela e alimentada, voce nao precisa nem recarregar a pagina pra ela avancar."',
    commonError:
      'Nao automatizar a virada de lotes (gera atrasos e erros). Nao configurar o onboarding -- o comprador precisa sentir que fez uma boa compra imediatamente.',
    items: [
      'Automacao de virada de lotes configurada (ou processo manual definido)',
      'Barra de progresso configurada e testada',
      'Email de boas-vindas pronto',
      'Onboarding WhatsApp configurado',
      'Sequencia de comparecimento agendada',
      'Emails de virada de lote redigidos',
      'Teste de todas as automacoes antes da abertura',
    ],
    dependsOn: 'phase2_step17',
  },
  {
    key: 'phase2_step19',
    phase: 2,
    order: 5,
    title: 'Produzir Primeira Leva de Criativos',
    description:
      'Produza no minimo 5 criativos para o inicio da campanha. A maioria dos ingressos vem de criativos de VIDEO, nao de imagem.',
    howTo:
      'Tipos por prioridade: Video do especialista (1-3 min), UGC/depoimentos de alunos (30s-1min), Video de bastidores, Imagens estaticas, Video de escassez. Framework: Gancho em 3s, Promessa, Publico-alvo, Cronograma, Preco/urgencia, CTA.',
    benchmark:
      'Maioria dos ingressos vem de video. CTR bom: acima de 1% (Sombra: 1.06%). CPM bom: R$16-28. Produzir novos criativos continuamente.',
    tip: '"A gente fez muito criativo de video, que da muito trampo, e fez muito de imagem, que da muito menos trabalho, mas que tambem da menos resultado. A maioria dos leads vem de video."',
    commonError:
      'Parar de produzir criativos apos a primeira semana (saturam). Nao testar formatos diferentes. Criativos com promessa generica em vez de especifica.',
    items: [
      'Minimo 5 criativos produzidos para o lancamento',
      'Pelo menos 2 videos do especialista',
      'Pelo menos 1 UGC/depoimento',
      'Imagens estaticas como complemento',
      'Criativos revisados (copy, edicao, CTA)',
      'Todos os criativos com link correto do lote atual',
    ],
    dependsOn: 'phase2_step15',
  },
  {
    key: 'phase2_step20',
    phase: 2,
    order: 6,
    title: 'Estruturar Campanhas de Trafego',
    description:
      'Configure as campanhas no Facebook/Instagram Ads e Google Ads com a estrutura correta para venda de ingressos.',
    howTo:
      'Facebook/Instagram: objetivo Conversao, Advantage+, comece publico quente e escale para frio. Google Ads complementar (~10-12% dos ingressos). Escalada: Dias 1-3 R$800-1k/dia, Dias 4-7 R$2k-4k, Dias 8-15 R$4k-6k, Dias 16+ R$6k-10k+.',
    benchmark:
      'CPA inicio: R$15-25 (publico quente). CPA meio: R$33-50. CPA final: R$60-90 (escalando). CPA medio final: R$40-60.',
    tip: '"A gente comecou com R$800 no dia, R$15 de CAC, foi pra R$4.000 e manteve os R$28, foi pra R$10.000 e manteve os R$41. Muito bom."',
    commonError:
      'Comecar com orcamento alto demais (queima dinheiro). Nao escalar quando o CPA esta bom. Desesperar com CPA alto na primeira semana sem testar ajustes.',
    items: [
      'Campanha Facebook/Instagram configurada',
      'Campanha Google configurada (se aplicavel)',
      'Criativos subidos e revisados',
      'Pixel/API de conversao instalado e testando',
      'Orcamento diario inicial definido',
      'Plano de escalada de orcamento documentado',
    ],
    dependsOn: 'phase2_step19',
  },
  {
    key: 'phase2_step21',
    phase: 2,
    order: 7,
    title: 'Abrir Vendas e Monitorar Diariamente',
    description:
      'Abra as vendas no Lote 0 ou Lote 1 e comece o monitoramento diario obsessivo de todos os indicadores.',
    howTo:
      'Dashboard diario: Vendas do dia, Vendas acumuladas, CPA do dia, CPA medio acumulado, Conversao order bump (6%+), Faturamento dia/acumulado, CTR criativos (>1%), Conversao pagina (>3%).',
    benchmark:
      'Monitorar no minimo 2x ao dia (manha e noite). Se pacing abaixo: ajustar criativos, orcamento, pagina, promessa. Se CPA alto: verificar criativos saturados, pagina, publico.',
    tip: '"Voce tem que acompanhar o seu faturamento por dia. Olhar a media de conversao do order bump, o ritmo de venda de ingressos. Esse e o seu pacing."',
    commonError:
      'So olhar vendas e ignorar CPA, conversao de pagina e conversao de order bump. Todos sao interdependentes.',
    items: [
      'Dashboard diario configurado',
      'Responsavel pelo monitoramento definido',
      'Processo de ajuste rapido (quem decide, quem executa)',
      'Acompanhando vendas/dia vs pacing',
      'Acompanhando CPA vs teto',
      'Acompanhando conversao de order bumps',
    ],
    dependsOn: 'phase2_step20',
  },
  {
    key: 'phase2_step22',
    phase: 2,
    order: 8,
    title: 'Gerenciar Viradas de Lote',
    description:
      'Cada virada de lote e um evento de marketing. Comunique em TODOS os canais e use como gatilho de urgencia.',
    howTo:
      'Avisar com antecedencia (D-2: "Faltam X ingressos", D-1: "Ultimo dia", D-0: "Ultimas horas", Virada: "Esgotado! Garanta no lote Z"). Canais: email, WhatsApp, Instagram stories, feed, anuncios.',
    benchmark:
      'Picos de venda nos 2-3 dias apos cada virada. Conversao de order bump da sprint junto com virada de lote na reta final.',
    tip: '"Virada de lote, comunicar na pagina, ter barra de progresso, automatizar, saber usar a escassez a seu favor o tempo inteiro, em todos os pontos de contato."',
    commonError:
      'Virar o lote silenciosamente. Cada virada e uma CAMPANHA. Quem nao comunica, perde o pico de vendas.',
    items: [
      'Calendario de virada de lotes definido',
      'Copias de email para cada virada redigidas',
      'Copias de WhatsApp para cada virada redigidas',
      'Posts/stories para cada virada planejados',
      'Criativos de anuncio atualizados a cada virada',
      'Link do checkout atualizado a cada virada',
    ],
    dependsOn: 'phase2_step21',
  },
  {
    key: 'phase2_step23',
    phase: 2,
    order: 9,
    title: 'Produzir Criativos Continuamente',
    description:
      'NAO pare de produzir criativos apos a abertura. Os criativos saturam e o CPA sobe se voce nao renova.',
    howTo:
      'Acompanhe ranking de criativos (quais vendem, quais saturam). Produza novos a cada 3-5 dias. Testes: video vs imagem, UGC vs especialista, hooks diferentes. Mate os com CPA alto, escale os com CPA baixo. Cadencia: S1=5, S2=+3, S3=+3, S4+=2-3/semana.',
    benchmark:
      'Criativo bom: CPA abaixo da media com volume. CTR em queda = saturando. Criativos de video vendem mais que imagem na maioria dos casos.',
    tip: '"E natural cair o CTR quando voce nao atualiza os criativos, porque voce vai saturando o seu melhor publico."',
    commonError:
      'Depender de 2-3 criativos durante todo o lancamento. Eles vao saturar.',
    items: [
      'Ranking de criativos atualizado semanalmente',
      'Novos criativos sendo produzidos continuamente',
      'Testes de formatos diferentes rodando',
      'Criativos saturados sendo desativados',
      'Pelo menos 2 novos criativos por semana apos a abertura',
    ],
    dependsOn: 'phase2_step21',
  },
  {
    key: 'phase2_step24',
    phase: 2,
    order: 10,
    title: 'Fazer Onboarding Imediato dos Compradores',
    description:
      'Assim que alguem comprar o ingresso (e/ou gravacoes), faca o onboarding imediato: boas-vindas, acesso ao grupo, instrucoes do evento.',
    howTo:
      'Email automatico de confirmacao + proximos passos. WhatsApp com boas-vindas + link do grupo. Grupo WhatsApp com "presente" na descricao para aumentar entrada. Mensagem especifica para quem comprou gravacoes reafirmando cashback.',
    benchmark:
      'Meta de entrada no grupo: 60-82%. Hack: presente na descricao do grupo aumenta de 60% para 82%+. O onboarding abre canal de dialogo para vender o produto depois.',
    tip: '"Faca o onboarding com quem compra ingressos, e de novo com quem compra gravacoes, porque mantem canal de comunicacao aberto. O cara vai responder e voce volta depois falando do cashback."',
    commonError:
      'Nao fazer onboarding e so esperar o dia do evento. O comprador precisa se sentir parte de algo IMEDIATAMENTE apos a compra.',
    items: [
      'Email de boas-vindas automatico configurado',
      'Mensagem de WhatsApp automatica configurada',
      'Grupo do evento criado com descricao estrategica',
      'Presente/incentivo na descricao do grupo',
      'Onboarding especifico para compradores de gravacoes',
      'Canal de comunicacao aberto para abordagem futura (cashback)',
    ],
    dependsOn: 'phase2_step18',
  },

  // ===========================================================================
  // FASE 3: EVENTO (Passos 25-31)
  // ===========================================================================
  {
    key: 'phase3_step25',
    phase: 3,
    order: 1,
    title: 'Ativar Sequencia de Comparecimento',
    description:
      'Nos 7 dias que antecedem o evento, ative uma sequencia de lembretes e aquecimento para maximizar o comparecimento.',
    howTo:
      'Sequencia: D-7 "Falta 1 semana!" (Email+WhatsApp), D-3 "Cronograma do evento", D-1 "Amanha comeca! Link de acesso", D-0 -1h "Comeca em 1 hora!", D-0 inicio "Estamos ao vivo!", Intervalo "Voltamos as 13h30!", D-1 manha "Dia 2 comeca as 9h30!".',
    benchmark:
      'Comparecimento medio: 55-80%. Excelente: 70%+. Bruna/Arthur: 65%. Kimura: ~70%. Ingresso mais caro = comparecimento mais alto.',
    tip: '"Quase nada de esforco para comparecimento e da de 70% a 80%, geralmente. Se comprou ingresso, geralmente e qualificado."',
    commonError:
      'Bombardear demais de mensagens. Seja estrategico -- cada mensagem deve ter funcao clara (lembrete, conteudo, antecipacao).',
    items: [
      'Sequencia de comparecimento redigida e agendada',
      'Links de acesso ao evento testados',
      'Lembretes em todos os canais (email, WhatsApp, Instagram)',
      'Mensagem de D-0 -1h pronta',
      'Mensagem de inicio do evento pronta',
    ],
    dependsOn: 'phase2_step24',
  },
  {
    key: 'phase3_step26',
    phase: 3,
    order: 2,
    title: 'Check Tecnico Final',
    description:
      'No dia anterior ao evento, faca um check tecnico completo. Problemas tecnicos durante o evento custam vendas e satisfacao.',
    howTo:
      'Checar: Audio (microfone, sem eco/ruido), Video (camera, iluminacao, cenario), Internet (conexao estavel + backup 4G), Plataforma (Zoom/YouTube), Links de compra, Slides/apresentacao, Videos de intervalo, Chat/moderacao, Equipe tecnica briefada.',
    benchmark:
      'Zero problemas tecnicos no inicio. Willian pagou US$2.500/mes pelo Zoom para 5.000 pessoas. Zoom ate 1.000: ~US$50/mes. Alternativa: YouTube (menos controle, melhor qualidade).',
    tip: '"Se voce vai fazer lancamento pago, nao recomendo fazer a operacao sozinho. Traga um profissional. Voce perdendo flow, sua turma perde flow, e perde venda."',
    commonError:
      'Nao ter backup de internet. Se a transmissao cai no meio do evento, perde comparecimento e vendas.',
    items: [
      'Audio testado e funcionando',
      'Video testado e funcionando',
      'Internet principal + backup configurados',
      'Plataforma (Zoom/YouTube) configurada e testada',
      'Links de compra do produto principal testados',
      'Slides/apresentacao testados',
      'Videos de intervalo carregados',
      'Chat/moderacao configurada',
      'Operador tecnico briefado',
      'Ensaio geral feito (pelo menos 30 min antes)',
    ],
    dependsOn: 'phase3_step25',
  },
  {
    key: 'phase3_step27',
    phase: 3,
    order: 3,
    title: 'Executar Dia 1 do Evento',
    description:
      'Execute o primeiro dia do evento seguindo o cronograma. Foco em CONTEUDO + CONEXAO. O dia 1 planta as sementes (seeding) para o pitch do dia 2.',
    howTo:
      'Roteiro: Abertura (30min, video emocional, boas-vindas, quebra-gelo), Bloco 1 (2h, fundamentacao), Intervalo almoco (1h30, cases rodando), Bloco 2 (2h, aprofundamento, exercicio), Intervalo (30min, cases), Bloco 3 (1h30, pratica, seeding), Encerramento (30min, antecipacao dia 2).',
    benchmark:
      'Comparecimento dia 1: 65-80%. Kimura: 1.600 no pico (de 2.148 ingressos). Bruna/Arthur: 269 (65% de 414). NPS alto: conteudo deve ser tao bom que as pessoas comprem so pela entrega.',
    tip: '"Entrega tudo. O Cassio nao teve receio. Entrega o melhor, porque dai a gente vai se forcar a deixar o produto ainda melhor." Coloque cases ao vivo -- ex: aluno contando por que contrata alunos do curso.',
    commonError:
      'Guardar conteudo "pro produto". Entregue TUDO. O produto e a continuidade, acompanhamento, comunidade. Nao usar intervalos (tela preta = desperdicio de 2-3 horas de influencia).',
    items: [
      'Video de abertura pronto e rodou',
      'Blocos de conteudo entregues conforme cronograma',
      'Intervalos com conteudo rodando (cases, depoimentos)',
      'Seeding feito (sementes plantadas para o produto)',
      'Encerramento com antecipacao do dia 2',
      'Feedback da equipe sobre o dia (o que ajustar pro dia 2)',
    ],
    dependsOn: 'phase3_step26',
  },
  {
    key: 'phase3_step28',
    phase: 3,
    order: 4,
    title: 'Executar Dia 2 do Evento (com Pitch)',
    description:
      'O dia 2 e o dia da conversao. Conteudo avancado + projeto final + PITCH PRINCIPAL. Faca 3 momentos de pitch.',
    howTo:
      'Roteiro: Abertura dia 2 (30min, recapitulacao), Bloco 4 (2h, avancado), Intervalo almoco (1h30, cases + VSL), Bloco 5 (1h30, projeto final), PITCH 1 Pre-pitch (15min, transicao natural), PITCH 2 Principal (30-45min, produto completo, carrinho abre), Intervalo (30min, cases + contagem vendas), PITCH 3 Fechamento (15-30min, Q&A, escassez).',
    benchmark:
      'Conversao no dia do pitch: 7-13% da base. Bruna/Arthur: 12,7%. Willian/Kimura: 9% no dia, subindo para 21% nos 14 dias seguintes. Sombra: 6% com ticket de R$5.000.',
    tip: '"Se voce fizer tudo errado, vai ser 5%. Se fizer tudo certo, 15-30%. A gente ja converteu 33% com o nosso menor projeto." Nao tenha medo de vender.',
    commonError:
      'So fazer 1 pitch. Faca 3 momentos (pre-pitch, principal, fechamento). Encerrar o evento apos o pitch sem dar tempo para perguntas e decisao.',
    items: [
      'Conteudo do dia 2 entregue conforme cronograma',
      'Pre-pitch realizado (transicao natural)',
      'Pitch principal executado com todos os elementos',
      'Link de compra funcionando e no chat',
      'Intervalo pos-pitch com cases e video de vendas',
      'Pitch de fechamento realizado',
      'Q&A com objecoes respondidas',
    ],
    dependsOn: 'phase3_step27',
  },
  {
    key: 'phase3_step29',
    phase: 3,
    order: 5,
    title: 'Gerenciar Intervalos Estrategicamente',
    description:
      'Os intervalos NAO sao tempo morto. Sao tempo de influencia. Rode conteudo estrategico durante cada pausa.',
    howTo:
      'Conteudo para intervalos (em loop): VSL do produto principal (5-10 min), Depoimentos de alunos (3-5), Cases de sucesso detalhados, Video historia do especialista, Countdown para volta. Ordem: Case -> VSL -> Depoimento -> Case -> Countdown -> Volta.',
    benchmark:
      'Muitas pessoas comem na frente do computador assistindo os intervalos. O intervalo pos-pitch e o mais importante (rodar cases enquanto decidem). 16 horas = 960 Reels.',
    tip: '"Use os intervalos para passar video de vendas, cases, depoimentos, video de historia do especialista. Tudo que voce tiver de material que nao quer interromper o conteudo, usa esses intervalos."',
    commonError:
      'Deixar tela preta ou musica generica. Cada minuto de intervalo com conteudo estrategico e investimento na conversao.',
    items: [
      'Videos de intervalo produzidos e prontos',
      'Pelo menos 3-5 depoimentos em video',
      'VSL do produto principal gravado',
      'Playlist de intervalo montada e testada',
      'Operador sabe trocar entre conteudo e intervalos',
    ],
    dependsOn: 'phase3_step26',
  },
  {
    key: 'phase3_step30',
    phase: 3,
    order: 6,
    title: 'Ativar Time Comercial Durante e Pos-Pitch',
    description:
      'O time comercial deve estar ativo DURANTE o evento, respondendo duvidas e abordando interessados em tempo real.',
    howTo:
      'Durante o pitch: monitore chat e WhatsApp. Apos o pitch: aborde quem fez perguntas, clicou no link. Follow-up nas horas seguintes. Abordagem personalizada nos dias seguintes. Use dados do Zoom (horas de participacao) para personalizar.',
    benchmark:
      'Willian: 193 vendas no dia do pitch + 242 nos dias seguintes (comercial fez a diferenca). Sombra: conversao de call acima de 30%. Todo mundo entra no atendimento.',
    tip: '"Olha como o atendimento comercial e importante. O gestor de projetos entrou, eu entrei, a copy entrou. Todo mundo que produz algo pro cliente precisa ter experiencia com ele." Baixe lista do Zoom e aborde os mais participativos.',
    commonError:
      'Nao ter time comercial ativo (confiar so no remarketing). Nao usar dados de participacao. Esperar o cliente vir em vez de ir ate ele.',
    items: [
      'Time comercial briefado e pronto antes do evento',
      'Scripts de abordagem redigidos',
      'Canais de atendimento definidos (WhatsApp, DM, chat)',
      'Processo de follow-up definido (quem aborda quem, quando)',
      'Lista de participantes do Zoom/YouTube sera extraida apos o evento',
      'Todo o time sabe que pode/deve ajudar no atendimento',
    ],
    dependsOn: 'phase3_step28',
  },
  {
    key: 'phase3_step31',
    phase: 3,
    order: 7,
    title: 'Abrir Cashback para Compradores de Gravacoes',
    description:
      'Ative a oferta de cashback para quem comprou as gravacoes. O valor pago nas gravacoes vira desconto no produto principal.',
    howTo:
      'Comunique imediatamente apos o pitch: "Quem comprou gravacoes tem R$X de cashback". Envie link especifico com desconto aplicado. Defina prazo de validade (encerra ANTES do carrinho geral). Comunique em todos os canais.',
    benchmark:
      'Quem comprou gravacoes converte o DOBRO para o produto principal. Conversao com gravacoes: 22-27% vs sem: 8-13%. Cashback e o incentivo decisivo para o lead qualificado.',
    tip: '"Quando a gente vende a gravacao por R$200 e o produto por R$1.000, eu pego esses R$200 e dou de cashback. A pessoa tem um degrau a menos para subir." Nao encerre cashback e carrinho no mesmo dia.',
    commonError:
      'Encerrar cashback e carrinho no mesmo dia. Encerre o cashback ANTES para criar um momento de urgencia exclusivo para essa base mais qualificada.',
    items: [
      'Cashback ativado e comunicado',
      'Link especifico com desconto configurado',
      'Prazo de validade do cashback definido (antes do carrinho geral)',
      'Comunicacao por email, WhatsApp individual e grupo',
      'Follow-up individual com quem comprou gravacoes e nao usou o cashback',
    ],
    dependsOn: 'phase3_step28',
  },

  // ===========================================================================
  // FASE 4: POS-EVENTO E OTIMIZACAO (Passos 32-38)
  // ===========================================================================
  {
    key: 'phase4_step32',
    phase: 4,
    order: 1,
    title: 'Manter Carrinho Aberto 3-7 Dias com Urgencia Real',
    description:
      'Apos o evento, mantenha o carrinho aberto por 3 a 7 dias com comunicacao ativa, escassez real e remarketing.',
    howTo:
      'Cronograma: D+1 "Ainda da tempo" (email+WhatsApp), D+2 Cases de quem comprou, D+3 "Cashback expira amanha", D+4 Encerrar cashback, D+5 "Gravacoes saem do ar amanha", D+6 Encerrar gravacoes, D+7 "ULTIMO DIA". Canais: email (1-2/dia), WhatsApp grupo (2-3/dia), individual (comercial), Stories, Remarketing pago.',
    benchmark:
      '40-60% das vendas do produto principal acontecem nos dias APOS o evento. Willian: 193 no dia do pitch, 242 nos dias seguintes. Time comercial e responsavel por grande parte.',
    tip: '"Cada dia e um foco de comunicacao. Encerrar cashback, encerrar gravacoes, encerrar carrinho geral. Nao encerra tudo junto."',
    commonError:
      'Fechar o carrinho muito cedo (perde 40-60% das vendas). Parar de comunicar apos o evento (lead ainda esta quente). Nao usar remarketing pago no pos-evento.',
    items: [
      'Carrinho aberto por 3-7 dias apos o evento',
      'Cronograma de comunicacao pos-evento definido',
      'Emails diarios redigidos e agendados',
      'Mensagens WhatsApp redigidas e agendadas',
      'Remarketing rodando para base do evento',
      'Time comercial ativo no follow-up',
    ],
    dependsOn: 'phase3_step31',
  },
  {
    key: 'phase4_step33',
    phase: 4,
    order: 2,
    title: 'Encerrar Cashback',
    description:
      'Encerre a oferta de cashback em um dia especifico ANTES do encerramento geral. Isso cria um momento de urgencia exclusivo para os compradores de gravacoes.',
    howTo:
      'Comunique D-2: "Cashback expira em 2 dias". D-1: "Ultimo dia de cashback". D-0: "Cashback encerra as 23h59". Apos encerramento: "Cashback encerrado. Voce ainda pode comprar, mas sem desconto."',
    benchmark:
      'Pico de vendas forte no dia de encerramento. Base de gravacoes converte o dobro vs sem. Willian: cashback converteu 3,5% da base total (meta: 4%).',
    tip: '"Eu gosto de encerrar antes o cashback, ter outro dia para encerrar as gravacoes. Nesse dia que encerra o cashback a gente converte muito esse pessoal que comprou as gravacoes."',
    commonError:
      'Encerrar cashback e carrinho no mesmo dia -- perde o efeito de urgencia segmentada.',
    items: [
      'Data de encerramento do cashback definida (antes do carrinho geral)',
      'Comunicacao de D-2, D-1 e D-0 redigida',
      'Follow-up individual com quem tem cashback e nao usou',
      'Apos encerramento: foco muda para escassez geral',
    ],
    dependsOn: 'phase4_step32',
  },
  {
    key: 'phase4_step34',
    phase: 4,
    order: 3,
    title: 'Encerrar Gravacoes',
    description:
      'Encerre a venda de gravacoes em um dia especifico, diferente do cashback e do carrinho geral. Mais um gatilho de urgencia.',
    howTo:
      'Comunique: "Gravacoes saem do ar em [data]". Use como gatilho: "Ultima chance de assistir o evento completo". Para quem comprou gravacoes e nao comprou o produto: oferta direta.',
    benchmark:
      'Encerrar gravacoes APOS o cashback, mas ANTES do carrinho geral. Cronologia ideal: Cashback (dia X) -> Gravacoes (dia X+2) -> Carrinho (dia X+4).',
    tip: '"Cada dia e um foco de comunicacao. Cashback num dia, gravacoes em outro, carrinho geral em outro."',
    commonError:
      'Nao comunicar o encerramento das gravacoes. E um momento de escassez que gera vendas tanto das gravacoes quanto do produto principal.',
    items: [
      'Data de encerramento das gravacoes definida',
      'Comunicacao redigida e agendada',
      'Follow-up com compradores de gravacoes que nao compraram o produto',
      'Acesso as gravacoes efetivamente encerrado na data comunicada',
    ],
    dependsOn: 'phase4_step33',
  },
  {
    key: 'phase4_step35',
    phase: 4,
    order: 4,
    title: 'Ativar Downsell para Quem Nao Comprou',
    description:
      'Para quem nao comprou o produto principal, ofereca um produto de ticket menor (downsell). Funciona melhor para high ticket.',
    howTo:
      'Identifique quem NAO comprou o produto principal. Crie produto de menor ticket (R$200-500 para mid-ticket, R$2k-2.5k para high ticket). Envie oferta especifica e empatetica. Rode por 3-7 dias.',
    benchmark:
      'Conversao de downsell: 5-7% da base nao-compradora. Willian: downsell de R$2.500 convertendo 7% = R$130k adicionais. Para mid-ticket pode nao justificar. Para high ticket funciona muito bem.',
    tip: '"Muitas vezes o downsell nao vale quando o ticket principal e baixo. Quando e high ticket, deve valer muito." O objetivo e simplificar o downsell para nao virar um mini-lancamento.',
    commonError:
      'Fazer downsell complexo que demanda tanto esforco quanto mini-lancamento. Ticket tao baixo que nao compensa. Nao fazer downsell quando o produto e high ticket (dinheiro na mesa).',
    items: [
      'Avaliacao: downsell faz sentido para o meu ticket? (Sim para high ticket, avaliar para mid)',
      'Produto de downsell definido e precificado',
      'Pagina/checkout do downsell configurados',
      'Comunicacao de downsell redigida',
      'Base segmentada (so quem NAO comprou o produto principal)',
      'Prazo de downsell definido',
    ],
    dependsOn: 'phase4_step34',
  },
  {
    key: 'phase4_step36',
    phase: 4,
    order: 5,
    title: 'Follow-up Comercial com Interessados via Boleto',
    description:
      'Ative o time comercial para follow-up intensivo com quem demonstrou interesse mas nao fechou. Ofereca boleto parcelado como alternativa.',
    howTo:
      'Identifique: quem clicou no link e nao finalizou, quem mandou mensagem, quem fez aplicacao. Aborde por WhatsApp individual com empatia. Ofereca boleto parcelado (ticket ligeiramente mais alto). Faca calls de fechamento.',
    benchmark:
      'Boleto parcelado pode representar 10-20% das vendas totais. Willian (Kimura): boleto com TM de R$1.253 (vs R$1.198 cartao). Sombra: conversao de calls acima de 30%.',
    tip: '"O produto via boleto e vendido um pouco mais caro. O comercial oferece e joga um boleto mais caro."',
    commonError:
      'Nao oferecer boleto parcelado (muitas pessoas nao tem limite no cartao). Abandonar leads apos o evento. Nao ter script de abordagem.',
    items: [
      'Lista de interessados nao-compradores levantada',
      'Boleto parcelado configurado na Hotmart',
      'Scripts de abordagem comercial prontos',
      'Calls de fechamento agendados',
      'Follow-up diario ate o encerramento do carrinho',
    ],
    dependsOn: 'phase4_step32',
  },
  {
    key: 'phase4_step37',
    phase: 4,
    order: 6,
    title: 'Encerrar Carrinho Geral',
    description:
      'Encerre o carrinho com comunicacao intensa de escassez REAL. O ultimo dia e o segundo maior dia de vendas (depois do dia do pitch).',
    howTo:
      'Sequencia: D-2 "Faltam 2 dias", D-1 "Ultimo dia amanha", D-0 manha "ULTIMO DIA. Encerra as 23h59", D-0 tarde "Ultimas horas", D-0 noite "Encerram em 2 horas", Pos: "Carrinho fechado. Obrigado!"',
    benchmark:
      'Ultimo dia de carrinho tem pico de vendas (urgencia real). A escassez deve ser REAL. Se disser que fecha, FECHE.',
    tip: '"Nao se limite a avisar uma vez. Avisa no email, avisa algumas vezes no privado, porque vale a pena. E um publico muito qualificado."',
    commonError:
      'Fechar o carrinho e reabrir (destroi credibilidade). Nao comunicar com intensidade. Encerrar cedo demais (perder vendas de ultima hora).',
    items: [
      'Data de encerramento definida e comunicada desde o inicio',
      'Emails de encerramento redigidos e agendados',
      'Mensagens WhatsApp de encerramento prontas',
      'Remarketing de ultimo dia rodando',
      'Carrinho REALMENTE fechado na data comunicada',
      'Time comercial fazendo ultimas abordagens',
    ],
    dependsOn: 'phase4_step35',
  },
  {
    key: 'phase4_step38',
    phase: 4,
    order: 7,
    title: 'Consolidar Metricas, Debriefing e Planejar Proximo',
    description:
      'Apos o encerramento de tudo, consolide TODAS as metricas, faca debriefing com a equipe e planeje o proximo lancamento.',
    howTo:
      'Consolide: ingressos vendidos, faturamento ingressos, conversao/faturamento gravacoes, conversao/vendas/faturamento produto principal, vendas boleto, conversao cashback, downsell, faturamento total, investimento, ROAS, CPA, comparecimento. Debriefing: 5 acertos, 5 erros, o que mudar, metas e investimento do proximo.',
    benchmark:
      'Debriefing documentado em ate 7 dias apos encerramento. Comparar TODOS indicadores planejado vs realizado. Identificar 3 maiores alavancas de melhoria.',
    tip: '"Tem metas que a gente vai superar, tem metas que vai diminuir, mas a gente vai aprendendo. Nos proximos a gente ja tem um plano muito mais perto do real." Cada lancamento pega o melhor de um e elimina o pior do outro.',
    commonError:
      'Nao documentar os aprendizados (repetir os mesmos erros). Nao fazer debriefing com toda equipe (perder insights). Nao aproveitar o momentum para ja vender ingressos do proximo evento.',
    items: [
      'Todas as metricas consolidadas em planilha',
      'Planejado vs Realizado comparado para cada indicador',
      'Debriefing realizado com toda a equipe',
      'Top 5 acertos documentados',
      'Top 5 erros documentados',
      'Top 3 alavancas de melhoria identificadas',
      'Proximo lancamento ja com data estimada',
      'Lista de espera para proximo evento ativada (se aplicavel)',
    ],
    dependsOn: 'phase4_step37',
  },
];
