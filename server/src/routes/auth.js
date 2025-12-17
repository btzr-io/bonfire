import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import { pusher } from "@/pusher.js";
import { createSession, verifySession } from "@/session.js";

const AuthSchema = z.object({
  socket_id: z.string().regex(/^\d+\.\d+$/),
  player_name: z.string().trim().min(3).optional(),
  session_token: z.jwt().optional(),
});

export const authRoute = async (c) => {
  const { socket_id, session_token, player_name } = await c.req.valid("json");

  const { token, id, user_info } = session_token
    ? await verifySession(session_token)
    : await createSession({ player_name });

  const presence_data = {
    id,
    user_info,
  };

  const result = pusher.authenticateUser(socket_id, presence_data);
  return c.json({ session_token: token, ...result });
};

export const authValidator = zValidator("json", AuthSchema);
