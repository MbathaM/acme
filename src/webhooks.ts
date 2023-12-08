// webhook.ts

import express from 'express';
import { verifyYocoWebhook } from './lib/yoco'; // Implement Yoco verification logic
import { WebhookRequest } from './server';
// import { Product } from './payload-types';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const yocoWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {
  const webhookRequest = req as any as WebhookRequest;
  const body = webhookRequest.rawBody; // Use as Buffer directly

  const signature = Array.isArray(req.headers['yoco-signature'])
    ? req.headers['yoco-signature'][0]
    : req.headers['yoco-signature'] || '';

  const id = Array.isArray(req.headers['yoco-id'])
    ? req.headers['yoco-id'][0]
    : req.headers['yoco-id'] || '';

  const timestamp = Array.isArray(req.headers['yoco-timestamp'])
    ? req.headers['yoco-timestamp'][0]
    : req.headers['yoco-timestamp'] || '';

  if (!verifyYocoWebhook(body, signature, id, timestamp)) {
    return res.status(400).send('Webhook Error: Invalid signature');
  }

  const event = JSON.parse(body.toString());

  try {
    switch (event.type) {
      case 'payment.succeeded':
        await handleSuccessfulYocoPayment(event);
        break;
      case 'refund.succeeded':
        await handleSuccessfulYocoRefund(event);
        break;
      case 'refund.failed':
        await handleFailedYocoRefund(event);
        break;
      default:
        // Handle other Yoco events if needed
        break;
    }

    res.status(200).send('Yoco Webhook Received');
  } catch (error) {
    console.error('Error processing Yoco webhook:', error);
    res.status(500).send('Internal Server Error');
  }
};

async function handleSuccessfulYocoPayment(event: any) {
  // Your logic for handling successful Yoco payment event
  console.log('Payment succeeded:', event.payload);

  // Retrieve user and order details, send emails, update database, etc.
}

async function handleSuccessfulYocoRefund(event: any) {
  // Your logic for handling successful Yoco refund event
  console.log('Refund succeeded:', event.payload);

  // Retrieve user and order details, update database, etc.
}

async function handleFailedYocoRefund(event: any) {
  // Your logic for handling failed Yoco refund event
  console.log('Refund failed:', event.payload);

  // Retrieve user and order details, log the failure, etc.
}
