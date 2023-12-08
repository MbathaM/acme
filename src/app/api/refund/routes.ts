import { NextRequest } from 'next/server';

const SECRET_KEY = process.env.YOCO_SECRET_KEY as string;

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405 }); // Method Not Allowed
  }

  const { checkoutId } = await request.json();

  try {
    const response = await fetch(
      `https://payments.yoco.com/api/checkouts/${checkoutId}/refund`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SECRET_KEY}`,
        },
      }
    );

    if (response.ok) {
      return new Response(null, { status: 204 }); // Refund Successful
    } else {
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      }); // Return the error response
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An error occurred during refund.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
