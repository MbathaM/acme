// import { headers } from "next/headers"
import { NextRequest, NextResponse } from 'next/server';

import { convertToCents } from '@/lib/utils';

export async function POST(request: NextRequest) {
  // const headersList = headers()
  // const domain = headersList.get("host")

  const domain = 'https://www.infobase.co.za';

  const SECRET_KEY = process.env.YOCO_SECRET_KEY as string;
  const SUCCESS_URL = `${domain}/payment/success`;
  const CANCEL_URL = `${domain}/payment/cancel`;
  const FAILURE_URL = `${domain}/payment/failure`;

  if (request.method !== 'POST') {
    return new Response(null, { status: 405 }); // Method Not Allowed
  }

  const checkoutData = await request.json(); // Make sure the request body contains the required fields

  // Convert the amount to cents
  checkoutData.amount = convertToCents(checkoutData.amount);

  try {
    const response = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET_KEY}`,
      },
      body: JSON.stringify({
        ...checkoutData, // Include other checkoutData fields
        successUrl: SUCCESS_URL,
        cancelUrl: CANCEL_URL,
        failureUrl: FAILURE_URL,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return NextResponse.json(responseData, { status: 200 });
    } else {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while creating the checkout.' },
      { status: 500 }
    );
  }
}
