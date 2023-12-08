// import crypto from 'crypto';
// import dotenv from 'dotenv'
// import path from 'path'

// dotenv.config({
//     path: path.resolve(__dirname, '../../.env'),
// })

// export const verifyYocoWebhook = (
//   rawBody: string,
//   signature: string,
// ): boolean => {

//   const expectedSignature = crypto
//     .createHmac('sha256', process.env.YOCO_SECRET_KEY!)
//     .update(rawBody, 'utf-8')
//     .digest('hex');

//   return crypto.timingSafeEqual(
//     Buffer.from(signature, 'hex'),
//     Buffer.from(expectedSignature, 'hex')
//   );
// };
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

export const verifyYocoWebhook = (
  rawBody: Buffer,
  signature: string,
  id: string,
  timestamp: string
): boolean => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.YOCO_SECRET_KEY!)
    .update(`${id}.${timestamp}.${rawBody}`, 'utf-8')
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
};
