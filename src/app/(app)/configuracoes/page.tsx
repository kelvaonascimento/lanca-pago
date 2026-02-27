'use client'

import { useState } from 'react'
import { Settings, Key, Database, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function ConfiguracoesPage() {
  const [openaiKey, setOpenaiKey] = useState('')
  const [clickupKey, setClickupKey] = useState('')

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Configurações</h2>
        <p className="text-muted-foreground mt-1">Gerencie integrações e preferências</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>Configure as chaves de API para integrações</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>OpenAI API Key</Label>
              <Badge variant="success" className="text-[10px]">Configurada</Badge>
            </div>
            <Input
              type="password"
              placeholder="sk-..."
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Usada para gerar conteúdo com GPT-4o</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>ClickUp API Key</Label>
              <Badge variant="success" className="text-[10px]">Configurada</Badge>
            </div>
            <Input
              type="password"
              placeholder="pk_..."
              value={clickupKey}
              onChange={(e) => setClickupKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Usada para exportar tarefas para o ClickUp</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Banco de Dados
          </CardTitle>
          <CardDescription>Informações sobre o armazenamento local</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tipo</span>
            <span>SQLite (local)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Localização</span>
            <code className="text-xs bg-secondary px-2 py-1 rounded">prisma/dev.db</code>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Estas ações são irreversíveis. Use com cuidado.
          </p>
          <Button
            variant="destructive"
            onClick={() => toast.warning('Funcionalidade disponível em breve')}
          >
            Limpar Todos os Dados
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
