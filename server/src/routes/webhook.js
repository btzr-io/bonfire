import { handleEvents } from "@/event.js";
import { pusher, webhookRequest } from "@/pusher.js";


export const webhookRoute = async (c) => {
  const webhookReq = await webhookRequest(req)
  const webhook = pusher.webhook(webhookReq)
  if (webhook.isValid()) {
    await handleEvents(webhook.getEvents())
  }
  return new c.text('OK!')
}
