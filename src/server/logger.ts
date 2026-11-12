import "server-only";
type Fields = { requestId?: string; code?: string; durationMs?: number; mode?: string };
const priorities = { info: 0, warn: 1, error: 2 };
export function log(level: keyof typeof priorities, event: string, fields: Fields = {}) {
  const threshold = process.env.LOG_LEVEL;
  if (threshold && threshold in priorities && priorities[level] < priorities[threshold as keyof typeof priorities]) return;
  // Explicitly project fields so tokens, input bodies and credentials cannot enter logs.
  console[level](JSON.stringify({ time: new Date().toISOString(), level, event,
    requestId: fields.requestId, code: fields.code, durationMs: fields.durationMs, mode: fields.mode }));
}
