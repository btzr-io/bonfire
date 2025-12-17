import { handleEvents } from "@/event.js";
import { pusher, webhookRequest } from "@/pusher.js";


export const webhookRoute = async (c) => {
  const webhookReq = await webhookRequest(c.req)
  const webhook = pusher.webhook(webhookReq)
  if (webhook.isValid()) {
    await handleEvents(webhook.getEvents())
  }
  return c.text('OK!')
}
