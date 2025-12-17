import { ENV } from "@/config.js";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: ENV.UPSTASH_REDIS_REST_URL,
  token: ENV.UPSTASH_REDIS_REST_TOKEN,
});

export const mergeDocument = async (document_key, data) => {
  const entries = Object.entries(data).map(([key, value]) => {
    return { key: document_key, path: `$.${key}`, value: value };
  });
  return await redis.json.mset(...entries);
};

export const createDocument = async (prefix, id, data, ttl) => {
  const key = `${prefix}:${id}`;
  const transaction = redis.multi();
  transaction.json.set(key, "$", data, { nx: true });
  transaction.expire(key, ttl, "NX");
  return await transaction.exec();
};
