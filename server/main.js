import { Hono } from "hono";

// Routes
import { authRoute, authValidator } from "@/routes/auth.js";
import { joinRoute, joinValidator } from "@/routes/join.js";
import { webhookRoute } from "@/routes/webhook.js";

const app = new Hono();

app.get("api", (c) =>
  c.json({
    name: "Bonfire server",
    version: "0.0.1",
  }));

app.post("api/auth", authValidator, authRoute);
app.post("api/join", joinValidator, joinRoute);
app.post("api/webhook", webhookRoute);

Deno.serve(app.fetch);
