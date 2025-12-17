import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import { CHANNEL_PREFIX, pusher } from "@/pusher.js";
import { verifySession, createGameSession } from "@/session.js";

const ChannelNameSchema =
  z.literal(CHANNEL_PREFIX.HOST)
    .or(z.string().startsWith(CHANNEL_PREFIX.GAME))

const JoinSchema = z.object({
  socket_id: z.string().regex(/^\d+\.\d+$/),
  channel_name: ChannelNameSchema,
  session_token: z.jwt(),
});

const ChannelCodeSchema = z
  .string()
  .length(4)
  .regex(/^[a-zA-Z0-9]+$/);

const parseChannelCode = (channelName) => {
  return ChannelCodeSchema.parse(
    channelName.replace(CHANNEL_PREFIX.GAME, ""),
  );
};

export const joinRoute = async (c) => {
  const { socket_id, session_token, channel_name } = await c.req.valid("json");
  const session = await verifySession(session_token);

  let channelName = channel_name

  if (channelName === CHANNEL_PREFIX.HOST) {
    const gameSession = await createGameSession(session)
    channelName = CHANNEL_PREFIX.GAME + gameSession.id
  }

  console.info(channel_name, channelName)



  const { id, user_info } = session

  const channel_id = parseChannelCode(channelName);

  const presence_data = {
    user_id: id,
    user_info,
  };

  const result = pusher.authorizeChannel(
    socket_id,
    channelName,
    presence_data,
  );

  return c.json({ channel_id, channel_name: channelName, ...result });
};

export const joinValidator = zValidator("json", JoinSchema);
