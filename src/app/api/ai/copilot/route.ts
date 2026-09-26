import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Gemini AI Financial Copilot Route
 * Provides quantitative advice, runway stress-testing explanations, and tax planning
 */
export async function POST(req: NextRequest) {
  try {
    const { prompt, context } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        fallback: true,
        message: 'No Gemini API key detected. Using local deterministic financial engine.',
      });
    }

    const systemInstruction = `You are CashFloor's AI Financial Copilot — an expert mathematical advisor for independent contractors, freelancers, and agency owners.
You analyze cash flows using quantitative 20th-percentile (P20) income floors, intra-month invoice lag buffers (DSO), and mandatory tax escrow.
Never advise relying on "average income". Emphasize conservative solvency, safe-to-spend limits, and survival runway. Keep answers concise, actionable, and formatted in clean markdown.`;

    const fullPrompt = `${systemInstruction}

Financial Context:
- Monthly Income Floor (P20): $${context?.p20Income ?? 'N/A'}
- Average Living & Biz Burn: $${context?.meanExpenses ?? 'N/A'}
- Current Liquid Cash: $${context?.savings ?? 'N/A'}
- Estimated Runway: ${context?.runway ?? 'N/A'} Months
- Stressed Runway (-30% loss): ${context?.stressedRunway ?? 'N/A'} Months
- Tax Escrow Rate: ${Math.round((context?.taxReservePct ?? 0.25) * 100)}%

User Question: ${prompt}`;

    // Call Google Gemini API
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 600,
        },
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn('Gemini API call returned non-200:', res.status, errData);
      return NextResponse.json({
        success: false,
        fallback: true,
        status: res.status,
        message: errData.error?.message || 'Gemini API call failed. Using local deterministic calculations.',
      });
    }

    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json({ success: false, fallback: true });
    }

    return NextResponse.json({
      success: true,
      text: candidateText,
      provider: 'gemini',
    });
  } catch (error: any) {
    console.error('Gemini copilot error:', error);
    return NextResponse.json({
      success: false,
      fallback: true,
      error: error.message,
    });
  }
}
