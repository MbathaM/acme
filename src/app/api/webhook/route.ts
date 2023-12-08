import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = process.env.YOCO_SECRET_KEY as string;

export async function POST(request: NextRequest) {
  if (request.method === 'POST') {
    const signature = request.headers.get('yoco-signature');
    const body = await request.text();

    // Verify webhook event origin
    if (!verifySignature(body, String(signature))) {
      return new NextResponse(null, { status: 403 }); // Forbidden
    }

    // Handle the webhook event
    const eventData = JSON.parse(body);
    const eventType = eventData.type;

    if (eventType === 'payment.succeeded') {
      // Handle successful payment event
      // Update your store's status, redirect the user, etc.
    } else if (eventType === 'payment.failed') {
      // Handle failed payment event
      // Update store status, notify user, etc.
    }

    return new NextResponse(null, { status: 200 }); // OK
  }

  return new NextResponse(null, { status: 405 }); // Method Not Allowed
}

// Verify the signature of the incoming webhook event
function verifySignature(payload: string, signature: string) {
  const expectedSignature = createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}
