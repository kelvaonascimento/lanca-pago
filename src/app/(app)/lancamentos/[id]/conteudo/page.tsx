'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Sparkles, Copy, Loader2, FileText, MessageSquare, Mail, Phone, Palette, Star, CheckCircle, Trash2, ChevronDown, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CONTENT_TEMPLATES, type ContentType } from '@/types/ai'
import { toast } from 'sonner'

interface SavedContent {
  id: string
  type: string
  subtype: string
  content: string
  isApproved: boolean
  createdAt: string
  communication?: { id: string; day: number; channel: string; title: string } | null
}

interface CommunicationOption {
  id: string
  day: number
  channel: string
  type: string
  title: string
  approvedContentId: string | null
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText, MessageSquare, Mail, Phone, Palette, Instagram: Star,
}

export default function ConteudoIAPage() {
  const { id } = useParams<{ id: string }>()
  const [launch, setLaunch] = useState<Record<string, unknown> | null>(null)
  const [selectedType, setSelectedType] = useState<ContentType>('copy_pagina')
  const [selectedSubtype, setSelectedSubtype] = useState('')
  const [customInstructions, setCustomInstructions] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [resultId, setResultId] = useState<string | null>(null)
  const [history, setHistory] = useState<SavedContent[]>([])
  const [communications, setCommunications] = useState<CommunicationOption[]>([])
  const [expandedHistory, setExpandedHistory] = useState<Set<string>>(new Set())

  const [approving, setApproving] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [id])

  async function loadData() {
    const [launchRes, contentRes, commRes] = await Promise.all([
      fetch(`/api/launches/${id}`),
      fetch(`/api/launches/${id}/content`),
      fetch(`/api/launches/${id}/communications`),
    ])
    const launchData = await launchRes.json()
    const contentData = await contentRes.json()
    const commData = await commRes.json()

    setLaunch(launchData)
    setHistory(contentData)
    setCommunications(commData)

    // Initialize communications if empty
    if (Array.isArray(commData) && commData.length === 0) {
      await fetch(`/api/launches/${id}/communications`, { method: 'POST' })
      const reRes = await fetch(`/api/launches/${id}/communications`)
      setCommunications(await reRes.json())
    }
  }

  const currentTemplate = CONTENT_TEMPLATES.find((t) => t.type === selectedType)

  useEffect(() => {
    if (currentTemplate?.subtypes[0]) {
      setSelectedSubtype(currentTemplate.subtypes[0].value)
    }
  }, [selectedType])

  async function handleGenerate() {
    if (!launch || !selectedSubtype) return

    setGenerating(true)
    setResult('')
    setResultId(null)

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          subtype: selectedSubtype,
          launchId: id,
          launchContext: {
            name: launch.name,
            niche: launch.niche,
            expert: launch.expert,
            bigIdea: launch.bigIdea || '',
            narrative: launch.narrative || '',
            theme: launch.theme || '',
            ticketPrice: (launch as Record<string, unknown>).ticketBatches
              ? ((launch as Record<string, unknown>).ticketBatches as Array<{ price: number }>)?.[0]?.price || 97
              : 97,
            productName: (launch as Record<string, unknown>).products
              ? ((launch as Record<string, unknown>).products as Array<{ name: string }>)?.[0]?.name || ''
              : '',
            productPrice: (launch as Record<string, unknown>).products
              ? ((launch as Record<string, unknown>).products as Array<{ price: number }>)?.[0]?.price || 997
              : 997,
            eventDate: (launch.eventDate as string) || '',
            eventPlatform: (launch.eventPlatform as string) || 'zoom',
          },
          customInstructions,
        }),
      })

      const data = await res.json()
      setResult(data.content)
      setResultId(data.id)

      // Reload history from DB
      const contentRes = await fetch(`/api/launches/${id}/content`)
      setHistory(await contentRes.json())

      toast.success('Conteudo gerado e salvo!')
    } catch {
      toast.error('Erro ao gerar conteudo. Verifique sua API key.')
    } finally {
      setGenerating(false)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('Copiado!')
  }

  async function handleAutoApprove(contentId: string) {
    const content = history.find((h) => h.id === contentId)
    if (!content) return

    setApproving(contentId)

    // Find first matching comm without content (1:1 match by channel+type)
    const channelMap: Record<string, string> = {
      emails: 'email', whatsapp: 'whatsapp', instagram: 'instagram', stories: 'stories', ads: 'ads',
    }
    const channel = channelMap[content.type]
    const match = communications.find(
      (c) => c.channel === channel && c.type === content.subtype && !c.approvedContentId
    )

    if (!match) {
      toast.error('Nenhuma ação disponível no cronograma para este tipo de conteúdo')
      setApproving(null)
      return
    }

    try {
      await fetch(`/api/launches/${id}/content`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId,
          communicationId: match.id,
          isApproved: true,
        }),
      })

      const [contentRes, commRes] = await Promise.all([
        fetch(`/api/launches/${id}/content`),
        fetch(`/api/launches/${id}/communications`),
      ])
      setHistory(await contentRes.json())
      setCommunications(await commRes.json())
      toast.success(`Aprovado e vinculado ao Dia ${match.day}: ${match.title}`)
    } catch {
      toast.error('Erro ao aprovar conteúdo')
    } finally {
      setApproving(null)
    }
  }

  async function handleUnapprove(contentId: string) {
    try {
      await fetch(`/api/launches/${id}/content`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, isApproved: false }),
      })

      const [contentRes, commRes] = await Promise.all([
        fetch(`/api/launches/${id}/content`),
        fetch(`/api/launches/${id}/communications`),
      ])
      setHistory(await contentRes.json())
      setCommunications(await commRes.json())
      toast.success('Conteudo desvinculado do cronograma')
    } catch {
      toast.error('Erro ao desaprovar conteudo')
    }
  }

  async function handleDelete(contentId: string) {
    try {
      await fetch(`/api/launches/${id}/content`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId }),
      })

      setHistory((prev) => prev.filter((h) => h.id !== contentId))
      if (resultId === contentId) {
        setResult('')
        setResultId(null)
      }
      toast.success('Conteudo removido')
    } catch {
      toast.error('Erro ao remover conteudo')
    }
  }

  const subtypeLabel = (type: string, subtype: string) => {
    const t = CONTENT_TEMPLATES.find((t) => t.type === type)
    const s = t?.subtypes.find((s) => s.value === subtype)
    return s ? `${t?.label} - ${s.label}` : `${type}/${subtype}`
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Template Selector */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Gerador de Conteudo
              </CardTitle>
              <CardDescription>
                Selecione o tipo de conteudo para gerar com IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {CONTENT_TEMPLATES.map((template) => {
                const Icon = ICONS[template.icon] || FileText
                const isSelected = selectedType === template.type
                const count = history.filter((h) => h.type === template.type).length

                return (
                  <button
                    key={template.type}
                    onClick={() => setSelectedType(template.type)}
                    className={`w-full flex items-center gap-3 rounded-lg p-3 text-left transition-colors cursor-pointer ${
                      isSelected ? 'bg-primary/10 border border-primary' : 'border border-border hover:bg-accent'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>{template.label}</p>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                    {count > 0 && (
                      <Badge variant="secondary" className="text-[10px]">{count}</Badge>
                    )}
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuracao</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Subtipo</Label>
                <Select value={selectedSubtype} onValueChange={setSelectedSubtype}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {currentTemplate?.subtypes.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>{sub.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentTemplate?.subtypes.find((s) => s.value === selectedSubtype) && (
                  <p className="text-xs text-muted-foreground">
                    {currentTemplate.subtypes.find((s) => s.value === selectedSubtype)?.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Instrucoes Adicionais (opcional)</Label>
                <Textarea
                  placeholder="Ex: Foque em urgencia, use tom mais informal..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating || !selectedSubtype}
                className="w-full gap-2"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Gerar Conteudo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Context Preview */}
          {launch && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Contexto do Lancamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Nome</span><span>{launch.name as string}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Nicho</span><span>{launch.niche as string}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Expert</span><span>{launch.expert as string}</span></div>
                {(launch.bigIdea as string) && <div className="flex justify-between"><span className="text-muted-foreground">Big Idea</span><span className="text-right max-w-[200px] truncate">{launch.bigIdea as string}</span></div>}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Output */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Resultado</CardTitle>
                  {result && (
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(result)} className="gap-1 shrink-0">
                      <Copy className="h-3 w-3" />
                      Copiar
                    </Button>
                  )}
                </div>
                {result && resultId && !history.find((h) => h.id === resultId)?.isApproved && (
                  <Button variant="default" size="sm" onClick={() => handleAutoApprove(resultId)} disabled={approving === resultId} className="gap-1 w-full">
                    {approving === resultId ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                    Aprovar para Cronograma
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="prose prose-invert prose-sm max-w-none max-h-[600px] overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{result}</div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Sparkles className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Selecione um tipo de conteudo e clique em &quot;Gerar&quot;
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    O conteudo sera gerado com base nas diretrizes Willian Baldan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Persistent History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Historico de Conteudos ({history.length})</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {history.filter((h) => h.isApproved).length} aprovados
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.map((item) => {
                const isExpanded = expandedHistory.has(item.id)

                return (
                  <div key={item.id} className="rounded-lg border">
                    <div className="flex items-center justify-between p-3">
                      <button
                        className="flex items-center gap-3 text-left cursor-pointer flex-1"
                        onClick={() => {
                          setExpandedHistory((prev) => {
                            const next = new Set(prev)
                            next.has(item.id) ? next.delete(item.id) : next.add(item.id)
                            return next
                          })
                        }}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">{subtypeLabel(item.type, item.subtype)}</Badge>
                          {item.isApproved && (
                            <Badge variant="success" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Aprovado
                              {item.communication && ` - Dia ${item.communication.day}: ${item.communication.title}`}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </button>
                      <div className="flex gap-1 shrink-0 ml-2">
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.content)} title="Copiar">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setResult(item.content); setResultId(item.id) }}
                          title="Visualizar"
                        >
                          Ver
                        </Button>
                        {item.isApproved ? (
                          <Button variant="ghost" size="sm" onClick={() => handleUnapprove(item.id)} className="text-warning" title="Desaprovar">
                            Desvincular
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => handleAutoApprove(item.id)} disabled={approving === item.id} className="text-success" title="Aprovar para cronograma">
                            {approving === item.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                            Aprovar
                          </Button>
                        )}
                        {!item.isApproved && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-destructive" title="Remover">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t px-3 py-3">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed max-h-[400px] overflow-y-auto">
                          {item.content}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
