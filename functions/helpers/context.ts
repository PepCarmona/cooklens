import { HandlerContext, HandlerEvent } from '@netlify/functions';

export function getFunctionUrl(
  event: HandlerEvent,
  context: HandlerContext
): string {
  const data = context.clientContext?.custom?.netlify;

  if (!data) {
    console.log('development', event.rawUrl);
    return event.rawUrl;
  }
  const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
  console.log('production', decoded);
  return decoded;
}
