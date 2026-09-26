import { NextRequest, NextResponse } from 'next/server';

/**
 * Resend Transactional Email Route
 * Sends read-only CPA audit links and quarterly tax reminders via Resend API
 */
export async function POST(req: NextRequest) {
  try {
    const { to, subject, auditUrl, principalName, floorIncome, runwayMonths } = await req.json();

    if (!to) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: true,
        mode: 'simulation',
        message: 'Resend API key not configured. Simulated email dispatch.',
      });
    }

    // Call Resend REST API (zero extra npm packages needed)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'CashFloor <onboarding@resend.dev>',
        to: [to],
        subject: subject || `Certified Solvency Audit: ${principalName || 'Independent Pro'}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #16232B;">
            <div style="border-bottom: 2px solid #2F6F62; padding-bottom: 12px; margin-bottom: 20px;">
              <h1 style="color: #2F6F62; font-size: 24px; margin: 0;">CashFloor Sovereign Audit</h1>
              <p style="color: #5C6D77; font-size: 13px; margin: 4px 0 0 0;">Independent Professional Liquidity & Runway Verification</p>
            </div>
            
            <p style="font-size: 14px; line-height: 1.6;">
              Hello,
            </p>
            <p style="font-size: 14px; line-height: 1.6;">
              <strong>${principalName || 'The principal'}</strong> has generated a verified, read-only financial solvency statement for your review.
            </p>

            <div style="background: #F1F4F2; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <div style="font-size: 12px; text-transform: uppercase; color: #5C6D77; letter-spacing: 0.05em;">Audit Summary</div>
              <div style="font-size: 18px; font-weight: bold; color: #16232B; margin-top: 4px;">
                Runway Horizon: ${runwayMonths ? `${runwayMonths} Months` : 'Stress-Tested'}
              </div>
              <div style="font-size: 13px; color: #2F6F62; margin-top: 4px;">
                Conservative P20 Income Floor: ${floorIncome ? `$${Number(floorIncome).toLocaleString()}/mo` : 'Active'}
              </div>
            </div>

            <p style="font-size: 14px; line-height: 1.6;">
              This read-only link allows you to review historical invoice performance, tax escrow allocations, and intra-month cash lags without editing permissions:
            </p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${auditUrl || 'https://cashfloor.app/share'}" style="background: #2F6F62; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 14px; display: inline-block;">
                Review Read-Only Audit Statement →
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #E5EAE7; margin: 24px 0;" />
            <p style="font-size: 11px; color: #8E9EA7; line-height: 1.5;">
              Notice: This verification statement was produced via CashFloor mathematical modeling. CashFloor operates with zero bank telemetry and local-first encryption.
            </p>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', data);
      return NextResponse.json({ error: data.message || 'Failed to dispatch email' }, { status: res.status });
    }

    return NextResponse.json({ success: true, id: data.id, provider: 'resend' });
  } catch (error: any) {
    console.error('Resend route error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
