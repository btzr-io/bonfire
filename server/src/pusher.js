import Pusher from "pusher";
import { ENV } from "@/config.js";

export const CHANNEL_PREFIX = {
  HOST: "private-host",
  GAME: "presence-game-",
};

export const pusher = new Pusher({
  key: ENV.PUSHER_KEY,
  appId: ENV.PUSHER_APP_ID,
  cluster: ENV.PUSHER_CLUSTER,
  secret: ENV.PUSHER_SECRET,
  useTLS: true,
});

export const webhookRequest = async (req) => {
  const request = {
    rawBody: await req.text(),
    headers: {},
  };
  const reqHeaders = new Headers(req.header());
  reqHeaders.set("content-type", "application/json");
  reqHeaders.forEach((value, key) => {
    request.headers[key] = value;
  });
  return request;
};

export const getUsers = async (channelId) => {
  const res = await pusher.get({
    path: `/channels/presence-game-${channelId}/users`,
  });
  if (res.status === 200) {
    const body = await res.json();
    const { users } = body;
    console.info(users);
    return users.map((item) => item.id);
  }
  return [];
};
export const GAME_STATUS = {
  CREATED: 0,
  STARTED: 1,
  ENDED: 2,
};
