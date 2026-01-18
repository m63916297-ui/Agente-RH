'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, User, Brain, Database, Send, Loader2 } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  action?: 'knowledge' | 'excel'
  thinking?: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)

  const loadStats = async () => {
    try {
      const response = await fetch('/api/chat')
      const data = await response.json()
      if (data.success) {
        setStats(data.statistics)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: input,
          sessionId: 'demo-session'
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.answer,
          timestamp: new Date().toLocaleTimeString(),
          action: data.action,
          thinking: data.thinking
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.message || 'Failed to get response')
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Lo siento, encontré un error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        timestamp: new Date().toLocaleTimeString(),
        action: 'knowledge',
        thinking: 'Error occurred while processing request'
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const testQuestions = [
    "¿Cuál es el monto de cesantías para el empleado con documento 124473?",
    "¿Cuántos empleados tienen cesantías causadas?",
    "¿Qué son las cesantías y cuándo se pagan?",
    "¿Cuál es el promedio de cesantías pagadas?"
  ]

  const askTestQuestion = (question: string) => {
    setInput(question)
    setTimeout(() => sendMessage(), 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Agente de Chat de Recursos Humanos
          </h1>
          <p className="text-lg text-slate-600">
            Asistente inteligente para gestión de cesantías y consultas de RRHH
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Chat con Asistente de RRHH
                </CardTitle>
                <CardDescription>
                  Haz preguntas sobre cesantías, políticas de RRHH o consulta datos específicos
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center text-slate-500 py-8">
                        <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>¡Hola! Soy tu asistente de RRHH. ¿En qué puedo ayudarte hoy?</p>
                      </div>
                    )}
                    
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.type === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white ml-auto'
                              : 'bg-white border border-slate-200'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          
                          {message.action && (
                            <div className="mt-2 flex items-center gap-2">
                              <Badge
                                variant={message.action === 'excel' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {message.action === 'excel' ? (
                                  <>
                                    <Database className="w-3 h-3 mr-1" />
                                    Base de Datos
                                  </>
                                ) : (
                                  <>
                                    <Brain className="w-3 h-3 mr-1" />
                                    Conocimiento
                                  </>
                                )}
                              </Badge>
                              <span className="text-xs opacity-60">
                                {message.timestamp}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {message.type === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-slate-600" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg p-3">
                          <p className="text-sm text-slate-500">Procesando tu pregunta...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t border-slate-200">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu pregunta aquí..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Test Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preguntas de Prueba</CardTitle>
                <CardDescription>
                  Haz clic en estas preguntas para probar el sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {testQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto p-3 whitespace-normal"
                    onClick={() => askTestQuestion(question)}
                    disabled={isLoading}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas de Datos</CardTitle>
                <CardDescription>
                  Información del archivo de cesantías
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total Empleados:</span>
                      <span className="font-medium">{stats.totalEmployees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Monto Total:</span>
                      <span className="font-medium">
                        ${stats.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Promedio:</span>
                      <span className="font-medium">
                        ${Math.round(stats.averageAmount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Periodo:</span>
                      <span className="font-medium text-sm">{stats.monthRange}</span>
                    </div>
                    <Separator />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadStats}
                      className="w-full"
                    >
                      Actualizar Estadísticas
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-slate-500 mb-2">Cargando estadísticas...</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadStats}
                    >
                      Cargar Datos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cómo Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Brain className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Conocimiento Base</p>
                    <p className="text-xs text-slate-600">
                      Responde preguntas generales de RRHH basadas en políticas y conocimiento empresarial.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Base de Datos</p>
                    <p className="text-xs text-slate-600">
                      Consulta información específica del archivo de cesantías causadas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}