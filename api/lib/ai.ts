import "dotenv/config";

/**
 * Minimal OpenAI-compatible chat client for the agent-gw backend.
 * Used by the member-facing AI marketing studio.
 */

const BASE = () => (process.env.KIMI_AGENTGW_BASE_URL ?? "").replace(/\/+$/, "");
const KEY = () => process.env.KIMI_AGENTGW_API_KEY ?? "";

export function aiConfigured() {
  return Boolean(BASE() && KEY());
}

export async function chatComplete(opts: {
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
  timeoutMs?: number;
}): Promise<string> {
  if (!aiConfigured()) throw new Error("AI service is not configured");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 60_000);
  try {
    const res = await fetch(`${BASE()}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY()}`,
      },
      body: JSON.stringify({
        model: opts.model ?? "kimi-k2",
        // kimi-k2 rejects any temperature other than 1 — use the default.
        max_tokens: opts.maxTokens ?? 1600,
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`AI request failed (${res.status}): ${body.slice(0, 300)}`);
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("AI returned an empty response");
    return text;
  } finally {
    clearTimeout(timer);
  }
}
