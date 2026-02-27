import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import type { GenerateRequest } from '@/types/ai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_CONTEXT = `Você é um especialista em lançamentos pagos, treinado na metodologia Willian Baldan.

REGRAS ABSOLUTAS DE COPY:
- NUNCA use a palavra "aprenda" — substitua por FAÇA, CRIE, CONSTRUA, DOMINE, IMPLEMENTE
- NUNCA use "replay" — use "acesso em formato de aulas" ou "gravações organizadas"
- NUNCA use gerúndio extenso — prefira imperativo direto
- Use o Framework C7: Clareza, Curiosidade, Conexão, Credibilidade, Controvérsia, CTA, Consistência
- Escassez REAL (lotes, vagas, datas) — nunca escassez falsa
- Tom: direto, confiante, orientado à ação
- Números específicos > promessas genéricas
- Prova social com resultados reais sempre que possível

ESTRUTURA DE LANÇAMENTO PAGO:
- Evento imersivo presencial/online (ingresso pago R$47-497)
- Order bumps: gravações, debriefing, materiais
- Cashback: quem compra gravações recebe desconto no high ticket
- High ticket vendido NO EVENTO (15-33% conversão)
- 7-9 lotes com escassez progressiva
- 44 dias de comunicação estruturada
`

const TYPE_PROMPTS: Record<string, string> = {
  // ─── Emails (10 subtipos = cronograma) ───
  emails_lancamento: `Crie o EMAIL DE ABERTURA DE VENDAS do evento.
Estrutura: Anúncio impactante → O que é o evento → Para quem é → Preço do 1º lote (mais barato) → Escassez real (vagas limitadas) → CTA direto.
Tom: empolgante, direto, urgente.`,

  emails_conteudo: `Crie um EMAIL DE CONTEÚDO + VALOR.
Estrutura: Hook com insight poderoso → Conteúdo educativo relevante → Conexão sutil com o evento → CTA suave.
Tom: generoso, educativo, sem forçar venda.`,

  emails_prova_social: `Crie um EMAIL DE PROVA SOCIAL com depoimentos e resultados.
Estrutura: Hook com resultado específico → 2-3 depoimentos reais → O que essas pessoas têm em comum → CTA para garantir vaga.
Tom: inspirador, concreto, com números.`,

  emails_virada_lote: `Crie o EMAIL DE VIRADA DE LOTE:
Estrutura: Aviso de esgotamento → Novo preço → Cálculo da economia (quem comprar agora economiza R$X) → Countdown → CTA urgente.
Tom: urgente, escassez real.`,

  emails_lembrete: `Crie 3 EMAILS DE LEMBRETE pré-evento:
1. D-7: Antecipação + o que preparar + cronograma
2. D-3: Detalhes finais + checklist
3. D-1: "Amanhã é o dia!" + link + motivação
Cada email curto e objetivo.`,

  emails_evento: `Crie o EMAIL DA MANHÃ DO EVENTO.
Estrutura: Bom dia empolgante → "Hoje é o dia!" → Link de acesso → Horário → O que esperar → Motivação final.
Curto, direto, com link em destaque.`,

  emails_pos_evento: `Crie o EMAIL DE CARRINHO ABERTO (pós-evento) para o high ticket.
Estrutura: Referência ao que viveram no evento → Apresentação da oferta high ticket → Benefícios → Cashback para quem comprou gravações → Escassez (vagas limitadas) → CTA.
Tom: continuidade do evento, não parecer "venda fria".`,

  emails_follow_up: `Crie o EMAIL DE FOLLOW-UP D+1 pós-evento.
Estrutura: "Você viu o que aconteceu ontem?" → Prova social dos primeiros compradores → Depoimentos rápidos → Lembrete da oferta → CTA.
Tom: social proof pesada, urgência sutil.`,

  emails_urgencia: `Crie o EMAIL DE URGÊNCIA (últimas 24h).
Estrutura: Assunto com urgência real → "Último dia" → Resumo da oferta → FOMO (quem já comprou) → Últimas vagas → CTA direto.
Tom: urgente, direto, sem enrolação. Email CURTO.`,

  emails_encerramento: `Crie 2 EMAILS DE ENCERRAMENTO:
1. Últimas 2h: Email curto, direto, "encerra em X horas", CTA final
2. Encerramento: Agradecimento + resultado final + "portas fechadas"
Tom: urgente no primeiro, grato no segundo.`,

  // ─── WhatsApp (8 subtipos = cronograma) ───
  whatsapp_base: `Crie a MENSAGEM PARA BASE EXISTENTE sobre o evento.
Estrutura: Saudação pessoal → Anúncio do evento → O que é → Link → CTA.
Máx 200 palavras. Tom: próximo, pessoal, como se falasse com um amigo.`,

  whatsapp_conteudo: `Crie uma MENSAGEM DE CONTEÚDO para o grupo de WhatsApp.
Estrutura: Insight ou dica relevante → Conexão com o evento → Pergunta para engajar.
Máx 150 palavras. Tom: casual, educativo.`,

  whatsapp_urgencia: `Crie 2 MENSAGENS DE URGÊNCIA para WhatsApp:
1. Últimas vagas do lote atual — countdown, escassez real
2. Encerramento total das vendas — última chance
Curtas, escassez real, CTA direto. Máx 100 palavras cada.`,

  whatsapp_lembrete: `Crie MENSAGENS DE LEMBRETE para WhatsApp:
1. D-7: Lembrete + cronograma do evento
2. D-1: "Amanhã!" + link + horário
Curtas, diretas, com link em destaque. Máx 100 palavras cada.`,

  whatsapp_evento: `Crie a MENSAGEM 30 MINUTOS ANTES do evento.
"Começamos em 30 min!" → Link de acesso → Lembrete de ter caderno/caneta → Motivação curta.
Máx 80 palavras. Direto ao ponto.`,

  whatsapp_pos_evento: `Crie a MENSAGEM PÓS-EVENTO com oferta.
Estrutura: "O que acharam?" → Oferta do high ticket → Cashback para quem tem gravações → Link → Prazo limitado.
Máx 200 palavras. Tom: empolgado pelo resultado do evento.`,

  whatsapp_follow_up: `Crie a MENSAGEM DE FOLLOW-UP WhatsApp.
Estrutura: Check-in → Resultado de quem já comprou → Oferta ainda disponível → CTA.
Máx 150 palavras. Tom: consultivo, não agressivo.`,

  whatsapp_encerramento: `Crie a MENSAGEM FINAL DE ENCERRAMENTO WhatsApp.
"Última mensagem sobre isso" → Resumo do que perde → CTA final → Agradecimento.
Máx 120 palavras. Tom: urgente mas respeitoso.`,

  // ─── Instagram Feed (3 subtipos = cronograma) ───
  instagram_post: `Crie 3 LEGENDAS PARA POST NO FEED do Instagram (abertura, antecipação, encerramento).
Cada legenda: Hook forte na primeira linha → Corpo → CTA.
Mix: anúncio oficial, "amanhã é o dia", agradecimento final.`,

  instagram_conteudo: `Crie 3 LEGENDAS DE POST DE VALOR/DESEJO para o feed.
Cada legenda: Hook → Conteúdo educativo que gera desejo → CTA sutil.
Tom: generoso, valor real, sem forçar venda.`,

  instagram_reels: `Crie 3 ROTEIROS CURTOS para REELS (30-60 segundos).
Estrutura de cada: Hook (3s) → Conteúdo (20s) → CTA (7s).
Mix: depoimento, resultado, bastidores.`,

  // ─── Stories (6 subtipos = cronograma) ───
  stories_conteudo: `Crie uma sequência de 8 STORIES DE BASTIDORES/ANTECIPAÇÃO.
Cada story: texto principal + CTA + tipo (texto/enquete/caixinha).
Mostrar preparação, bastidores, expectativa.`,

  stories_social_proof: `Crie uma sequência de 6 STORIES DE PROVA SOCIAL.
Cada story: depoimento ou número + contexto + CTA.
Incluir: prints de mensagens, números de vendas, resultados de alunos.`,

  stories_urgencia: `Crie uma sequência de 5 STORIES DE URGÊNCIA.
Para virada de lote ou encerramento. Cada story com countdown, escassez real, CTA direto.
Tom: urgente, FOMO, escassez real.`,

  stories_countdown: `Crie uma sequência de 5 STORIES DE CONTAGEM REGRESSIVA para o evento.
D-7, D-3, D-1, manhã do evento, 30min antes.
Cada story: contexto temporal + expectativa + CTA com link.`,

  stories_live: `Crie o ROTEIRO DE STORIES AO VIVO durante o evento.
5-8 stories: abertura → bastidores → momento do pitch → reações → encerramento.
Dicas de enquadramento e o que mostrar.`,

  stories_oferta: `Crie uma sequência de 6 STORIES DE OFERTA HIGH TICKET pós-evento.
Estrutura: recap do evento → oferta → benefícios → cashback → depoimentos → CTA final.
Tom: resultado do evento como prova, oferta como continuidade natural.`,

  // ─── Ads (2 subtipos = cronograma) ───
  ads_campanha: `Crie um BRIEFING COMPLETO para campanhas de tráfego pago:
1. Objetivo da campanha (conversão/tráfego)
2. Público-alvo (interesses, lookalike, retargeting)
3. 3 variações de copy para anúncios (headline + texto + CTA)
4. Sugestão de criativos (UGC, estático, vídeo expert)
5. Orçamento sugerido e distribuição
6. Métricas-alvo (CPA, CTR, CPC)`,

  ads_otimizacao: `Crie um CHECKLIST DE OTIMIZAÇÃO SEMANAL de campanhas:
1. Métricas para analisar (CPA, CTR, frequência, CPC)
2. Critérios para pausar criativos
3. Critérios para escalar criativos
4. Ajustes de público
5. Novos testes sugeridos
6. Ações corretivas por cenário (CPA alto, CTR baixo, etc.)`,

  // ─── Copy Página de Vendas ───
  copy_pagina_completa: `Crie a copy COMPLETA da página de vendas com as seções:
1. HOOK (headline impactante + sub-headline)
2. PROBLEMA (dor do público, específica)
3. MECANISMO ÚNICO (como o evento resolve)
4. PROVA (resultados, números, depoimentos)
5. OFERTA (o que está incluído, lotes)
6. ORDER BUMPS (gravações com cashback, extras)
7. ESCASSEZ (lotes limitados, preço sobe)
8. GARANTIA (se aplicável)
9. FAQ (3-5 perguntas)
10. CTA FINAL (urgente, direto)`,

  copy_pagina_hook: `Crie 5 variações de HOOK (headline + sub-headline) para a página de vendas.
Cada hook deve usar uma abordagem diferente: curiosidade, resultado, controvérsia, urgência, especificidade.`,

  copy_pagina_oferta: `Crie a seção de OFERTA da página de vendas com:
- Apresentação dos lotes com preços
- O que está incluído em cada ingresso
- Order bumps disponíveis
- Destaque do cashback (se houver)
- Escassez real (vagas limitadas por lote)
- CTA principal`,

  // ─── Scripts Comerciais ───
  scripts_abordagem_cashback: `Crie um script comercial de ABORDAGEM para oferecer o cashback das gravações.
Estrutura: Saudação → Contexto → Benefício do cashback → Cálculo do desconto → Urgência → CTA.
Tom: consultivo, não agressivo.`,

  scripts_follow_up: `Crie 3 scripts de FOLLOW-UP para diferentes cenários:
1. Lead que demonstrou interesse mas não comprou
2. Lead que abandonou o checkout
3. Lead que pediu mais informações
Cada script deve ter 2-3 mensagens na sequência (D+1, D+3, D+5).`,

  scripts_downsell: `Crie um script de DOWNSELL para oferecer após o evento para quem não comprou o high ticket.
Estrutura: Reconhecimento → Alternativa acessível → Benefícios → Prazo limitado → CTA.`,

  scripts_boleto: `Crie scripts de RECUPERAÇÃO DE BOLETO:
1. Lembrete amigável (mesmo dia)
2. Urgência (D+1 - vaga reservada, lote vai virar)
3. Última chance (D+2)`,
}

export async function POST(request: Request) {
  const body: GenerateRequest & { launchId: string } = await request.json()
  const { type, subtype, launchContext, customInstructions, launchId } = body

  const promptKey = `${type}_${subtype}`
  const typePrompt = TYPE_PROMPTS[promptKey] || `Gere conteúdo do tipo ${type} - ${subtype}`

  const userPrompt = `
CONTEXTO DO LANÇAMENTO:
- Nome: ${launchContext.name}
- Nicho: ${launchContext.niche}
- Expert: ${launchContext.expert}
- Big Idea: ${launchContext.bigIdea || 'Não definida'}
- Narrativa: ${launchContext.narrative || 'Não definida'}
- Tema: ${launchContext.theme || 'Não definido'}
- Ticket: R$${launchContext.ticketPrice}
- Produto Principal: ${launchContext.productName} (R$${launchContext.productPrice})
- Data do Evento: ${launchContext.eventDate}
- Plataforma: ${launchContext.eventPlatform}

${typePrompt}

${customInstructions ? `\nINSTRUÇÕES ADICIONAIS: ${customInstructions}` : ''}

Responda em português brasileiro. Formate com markdown.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: SYSTEM_CONTEXT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  })

  const content = completion.choices[0]?.message?.content || ''

  // Salvar no banco
  const saved = await prisma.generatedContent.create({
    data: {
      launchId,
      type,
      subtype,
      prompt: userPrompt,
      content,
    },
  })

  return NextResponse.json({
    id: saved.id,
    content,
    type,
    subtype,
    createdAt: saved.createdAt,
    tokensUsed: completion.usage?.total_tokens || 0,
  })
}
