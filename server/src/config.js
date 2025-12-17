import z from "zod";

const envSchema = z.object({
  DENO_ENV: z.string(),
  SESSION_SECRET: z.string(),
  SESSION_EXPIRATION: z.string().transform(Number),
  CONCURRENT_CONNECTIONS: z.string().transform(Number),
  PUSHER_KEY: z.string(),
  PUSHER_APP_ID: z.string(),
  PUSHER_SECRET: z.string(),
  PUSHER_CLUSTER: z.string(),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
});

export const ENV = envSchema.parse(Deno.env.toObject());
