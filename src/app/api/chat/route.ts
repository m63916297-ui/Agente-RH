import { NextRequest, NextResponse } from 'next/server';
import HRAgent from '@/lib/hr-agent';

const hrAgent = new HRAgent();

export async function POST(request: NextRequest) {
  try {
    const { question, sessionId } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    // Initialize the agent if not already done
    await hrAgent.initialize();

    // Process the question
    const result = await hrAgent.processQuestion(question);

    // Return the response
    return NextResponse.json({
      success: true,
      sessionId: sessionId || 'default',
      question,
      answer: result.answer,
      action: result.action,
      thinking: result.thinking,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await hrAgent.initialize();
    const stats = hrAgent.getSeveranceStats();

    return NextResponse.json({
      success: true,
      message: 'HR Chat Agent API',
      version: '1.0.0',
      endpoints: {
        chat: 'POST /api/chat - Ask HR questions',
        stats: 'GET /api/chat - Get severance data statistics'
      },
      statistics: stats
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}