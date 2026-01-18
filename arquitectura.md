# Arquitectura del Agente de Chat de Recursos Humanos

## Diagrama de Arquitectura

```mermaid
graph TB
    subgraph "Frontend - Next.js 15"
        UI[Interfaz de Chat]
        UI --> API
    end
    
    subgraph "Backend - API Routes"
        API[/api/chat]
        API --> Agent
    end
    
    subgraph "Core Logic - HR Agent"
        Agent[HRAgent Class]
        Agent --> LLM[LLM Service]
        Agent --> Excel[Excel Data Service]
        Agent --> Decision[Decision Engine]
    end
    
    subgraph "Data Layer"
        ExcelFile[cesancias_causadas.xlsx]
        Excel --> ExcelFile
    end
    
    subgraph "External Services"
        ZAI[z-ai-web-dev-sdk]
        LLM --> ZAI
    end
    
    Decision --> LLM
    LLM --> Agent
    Excel --> Agent
    Agent --> API
    API --> UI
```

## Componentes Principales

### 1. Frontend (Next.js 15 + TypeScript)
- **Interfaz de Chat**: Componente React con shadcn/ui
- **Gestión de Estado**: useState para mensajes y estado de la aplicación
- **Interacción Usuario**: Input field, botón de envío, preguntas de prueba
- **Visualización**: ScrollArea para historial de conversación
- **Badges**: Indicadores visuales del tipo de respuesta (Base de Datos vs Conocimiento)

### 2. API Layer (Next.js API Routes)
- **Endpoint**: `/api/chat` (POST y GET)
- **Manejo de Errores**: Try-catch con respuestas apropiadas
- **Validación**: Verificación de parámetros de entrada
- **Sesiones**: Soporte para session IDs (aunque en memoria para POC)
- **Estadísticas**: Endpoint GET para obtener datos del archivo Excel

### 3. HR Agent Core Logic
- **HRAgent Class**: Clase principal que orquesta todo el funcionamiento
- **Inicialización**: Carga de datos Excel y configuración del SDK
- **Decision Engine**: Clasificación de preguntas usando LLM
- **Data Processing**: Análisis y respuesta basada en el contexto apropiado

### 4. LLM Integration (z-ai-web-dev-sdk)
- **Clasificación**: Decide si usar base de datos o conocimiento general
- **Generación de Respuesta**: Crea respuestas coherentes y contextualizadas
- **Prompts Específicos**: System prompts optimizados para cada caso de uso
- **Manejo de Contexto**: Información de la compañía y datos relevantes

### 5. Excel Data Service
- **Lectura de Archivos**: Usando xlsx library para parsear archivos
- **Estructuración de Datos**: Conversión a objetos TypeScript tipados
- **Caching**: Datos cargados en memoria para rápido acceso
- **Análisis**: Estadísticas básicas y consultas específicas

## Flujo de Procesamiento

### 1. Flujo de Consulta
```
Usuario pregunta → Frontend → API → HR Agent → Decision Engine → LLM
                                                            ↓
                                                    ¿Excel o Knowledge?
                                                            ↓
                                                    Excel Service ← Excel File
                                                            ↓
                                                    LLM (con contexto) → Respuesta
                                                            ↓
                                                    API → Frontend → Usuario
```

### 2. Flujo de Decisión
1. **Análisis de Pregunta**: LLM clasifica la intención del usuario
2. **Selección de Fuente**: Determina si necesita datos específicos o conocimiento general
3. **Preparación de Contexto**: Formatea los datos apropiados
4. **Generación de Respuesta**: LLM crea respuesta basada en el contexto seleccionado
5. **Retorno de Resultados**: Incluye acción realizada y proceso de pensamiento

## Tecnologías Utilizadas

### Core Framework
- **Next.js 15**: Framework de React con App Router
- **TypeScript**: Tipado estático para mayor robustez
- **Node.js**: Entorno de ejecución del backend

### Frontend
- **React**: Biblioteca para construcción de interfaces
- **shadcn/ui**: Componentes UI modernos y accesibles
- **Tailwind CSS**: Framework de CSS para estilizado
- **Lucide React**: Iconos para la interfaz

### Backend
- **Next.js API Routes**: Endpoints del servidor
- **z-ai-web-dev-sdk**: SDK para integración con LLM
- **xlsx**: Librería para manejo de archivos Excel

### Data Management
- **File System**: Almacenamiento del archivo Excel
- **Memory Caching**: Datos cargados en memoria para rendimiento
- **TypeScript Interfaces**: Tipado de datos para seguridad

## Características Técnicas

### Seguridad
- **Validación de Entrada**: Verificación de parámetros en API
- **Error Handling**: Manejo robusto de errores
- **Type Safety**: TypeScript para prevención de errores en tiempo de compilación

### Performance
- **Memory Caching**: Datos Excel cacheados después de primera carga
- **Lazy Loading**: Inicialización del agente solo cuando se necesita
- **Optimización de Componentes**: React optimizations para renderizado eficiente

### Escalabilidad
- **Modular Architecture**: Componentes desacoplados
- **API Design**: Endpoints RESTful
- **State Management**: Preparado para integración con estado persistente

## Manejo de Errores

### Frontend
- **Catch Errors**: Try-catch en llamadas a API
- **User Feedback**: Mensajes de error amigables
- **Loading States**: Indicadores de progreso

### Backend
- **Validation**: Verificación de inputs
- **Graceful Degradation**: Respuestas por defecto en caso de error
- **Logging**: Console errors para debugging

### LLM Integration
- **Retry Logic**: Reintentos en caso de fallos
- **Fallback Responses**: Respuestas por defecto si LLM falla
- **Error Classification**: Diferenciación de tipos de error

## Mejoras Futuras

### Base de Datos
- **PostgreSQL/MySQL**: Reemplazar archivo Excel por base de datos real
- **Prisma ORM**: Para manejo de datos más robusto
- **Migrations**: Versionado de esquema de datos

### Autenticación
- **NextAuth.js**: Sistema de autenticación completo
- **Role Management**: Permisos por tipo de usuario
- **Session Management**: Manejo persistente de sesiones

### Monitoreo
- **Logging System**: Registro estructurado de eventos
- **Analytics**: Métricas de uso y rendimiento
- **Health Checks**: Monitoreo de estado del sistema

### UI/UX
- **Mobile Responsive**: Optimización para dispositivos móviles
- **Dark Mode**: Soporte para tema oscuro
- **Accessibility**: Mejoras de accesibilidad WCAG

## Decisiones de Diseño

### ¿Por qué Next.js 15?
- **Full-Stack**: Frontend y backend en un solo proyecto
- **App Router**: Sistema de routing moderno
- **Performance**: Optimizaciones automáticas
- **TypeScript Support**: Primera clase con TypeScript

### ¿Por qué z-ai-web-dev-sdk?
- **Backend Only**: Diseñado específicamente para backend
- **MCP Integration**: Soporte para Model Context Protocol
- **Local Processing**: Procesamiento sin depender de APIs externas
- **Security**: Credenciales protegidas en backend

### ¿Por qué shadcn/ui?
- **Modern Design**: Componentes actualizados y accesibles
- **TypeScript**: Nativo con TypeScript
- **Customizable**: Fácil personalización
- **Performance**: Componentes optimizados

## Consideraciones de Producción

### Deployment
- **Vercel**: Optimizado para Next.js
- **Environment Variables**: Configuración segura de credenciales
- **Build Optimization**: Minificación y optimización de assets

### Monitoring
- **Error Tracking**: Sentry o similar
- **Performance**: Web Vitals y métricas
- **Usage Analytics**: Google Analytics o similar

### Security
- **HTTPS**: Conexión segura obligatoria
- **CORS**: Configuración apropiada de orígenes
- **Rate Limiting**: Prevención de abuso
- **Input Sanitization**: Limpieza de datos de entrada