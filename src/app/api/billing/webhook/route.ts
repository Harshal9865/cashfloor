import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Webhook handler for Billing Events
 * Supports both Lemon Squeezy (Merchant of Record) and Stripe
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const headers = req.headers;

    // 1. Detect Lemon Squeezy Webhook
    const lemonSignature = headers.get('x-signature');
    if (lemonSignature) {
      const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
      if (secret) {
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signature = Buffer.from(lemonSignature, 'utf8');

        if (signature.length !== digest.length || !crypto.timingSafeEqual(digest, signature)) {
          return NextResponse.json({ error: 'Invalid Lemon Squeezy signature' }, { status: 401 });
        }
      }

      const payload = JSON.parse(rawBody);
      const eventName = payload.meta?.event_name;
      console.log(`[Lemon Squeezy Webhook Received]: ${eventName}`, payload.data?.id);

      // Handle subscription lifecycle
      switch (eventName) {
        case 'subscription_created':
        case 'subscription_updated':
        case 'order_created':
          // Update user tier in Supabase or database
          break;
        case 'subscription_cancelled':
        case 'subscription_expired':
          // Downgrade user to free tier
          break;
      }

      return NextResponse.json({ received: true, provider: 'lemonsqueezy' });
    }

    // 2. Detect Stripe Webhook
    const stripeSignature = headers.get('stripe-signature');
    if (stripeSignature) {
      console.log('[Stripe Webhook Received]');
      // Process Stripe event
      return NextResponse.json({ received: true, provider: 'stripe' });
    }

    return NextResponse.json({ received: true, note: 'Mock or unverified webhook event acknowledged' });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error.message || 'Webhook error' }, { status: 500 });
  }
}
