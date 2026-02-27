import { NextResponse } from 'next/server'

const CLICKUP_API = 'https://api.clickup.com/api/v2'
const API_KEY = process.env.CLICKUP_API_KEY || ''
const SPACE_ID = process.env.CLICKUP_SPACE_ID || ''

interface ClickUpTask {
  name: string
  description: string
  status: string
  priority: number
  due_date?: number
  tags: string[]
  custom_fields?: Array<{ id: string; value: unknown }>
}

export async function GET() {
  // Get lists from space
  try {
    const res = await fetch(`${CLICKUP_API}/space/${SPACE_ID}/folder`, {
      headers: { Authorization: API_KEY },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados do ClickUp' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { listId, tasks, launchName } = await request.json()

  if (!listId || !tasks || !Array.isArray(tasks)) {
    return NextResponse.json({ error: 'listId e tasks são obrigatórios' }, { status: 400 })
  }

  const results = []

  for (const task of tasks) {
    try {
      const res = await fetch(`${CLICKUP_API}/list/${listId}/task`, {
        method: 'POST',
        headers: {
          Authorization: API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: task.name,
          description: task.description || '',
          status: 'to do',
          priority: task.priority || 3,
          due_date: task.dueDate ? new Date(task.dueDate).getTime() : undefined,
          tags: [launchName, `fase-${task.phase}`, task.role].filter(Boolean),
        }),
      })

      const data = await res.json()
      results.push({ success: true, taskId: data.id, name: task.name })
    } catch {
      results.push({ success: false, name: task.name, error: 'Falha ao criar tarefa' })
    }
  }

  return NextResponse.json({
    total: tasks.length,
    created: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  })
}
