import * as z from "zod";
import { ENV } from "@/config.js";
import { GAME_STATE } from "@/game/state.js";
import { createDocument, redis } from "@/redis.js";
import { customAlphabet, nanoid } from "nanoid";
import { sign, verify } from "hono/jwt";

// Expected transaction response after creating new document: ["ok", 1]
const TransactionSchema = z.tuple([z.literal("OK"), z.literal(1)]);

// 4 letter alphanumeric code
const getChannelCode = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyz",
  4,
);

export const GAME_STATUS = {
  CREATED: 0,
  STARTED: 1,
  ENDED: 2,
};

export const createSessionToken = async (sessionData) => {
  const payload = {
    ...sessionData,
    exp: Math.floor(Date.now() / 1000) + 60 * ENV.SESSION_EXPIRATION,
  };
  return await sign(payload, ENV.SESSION_SECRET);
};

export const createSession = async (sessionData) => {
  const id = nanoid(8);
  const token = await createSessionToken({ id });
  // Add player to database
  const transaction = await createDocument(
    "player",
    id,
    sessionData,
    ENV.SESSION_EXPIRATION,
  );
  // Validate transaction
  TransactionSchema.parse(transaction);
  return { token, id, user_info: sessionData };
};

export const verifySession = async (sessionToken) => {
  const decodedPayload = await verify(sessionToken, ENV.SESSION_SECRET);
  const result = await redis.json.get(`player:${decodedPayload.id}`);
  if (result) {
    return {
      token: sessionToken,
      id: decodedPayload.id,
      user_info: result,
    };
  }
};

export const createGameSession = async (session) => {
  const id = getChannelCode();
  const gameData = {
    host: session.id,
    status: GAME_STATUS.CREATED,
    players: [],
    // Initial game state
    ...GAME_STATE,
  };
  // Add game to database
  const transaction = await createDocument(
    "game",
    id,
    gameData,
    ENV.SESSION_EXPIRATION,
  );
  // Validate transaction
  TransactionSchema.parse(transaction);
  return { id, gameData };
};

export const verifyGameSession = async (id) => {
  const result = await redis.json.get(`game:${id}`);
  if (result) {
    return {
      id: decodedPayload.id,
      data: result,
    };
  }
};
