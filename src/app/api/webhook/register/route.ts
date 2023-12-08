import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.YOCO_SECRET_KEY as string;

export async function POST() {
  const headersList = headers();
  const domain = headersList.get('host');
  const webhookData = {
    name: 'infobase',
    url: `${domain}/api/webhook`, // Update with your actual endpoint
  };

  try {
    const response = await fetch('https://payments.yoco.com/api/webhooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET_KEY}`,
      },
      body: JSON.stringify(webhookData),
    });

    if (response.ok) {
      const responseData = await response.json();
      return new NextResponse(
        JSON.stringify({ success: true, data: responseData }),
        { status: 200 }
      );
    } else {
      const errorData = await response.json();
      return new NextResponse(
        JSON.stringify({ success: false, error: errorData }),
        { status: response.status }
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, error: 'An error occurred' }),
      { status: 500 }
    );
  }
}
