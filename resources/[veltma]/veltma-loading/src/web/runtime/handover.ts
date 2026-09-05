import { z } from 'zod';

const handoverSchema = z.object({
  serverName: z.string().trim().min(1).max(80).optional(),
});

export function getHandoverServerName(input: unknown): string | undefined {
  const parsed = handoverSchema.safeParse(input);
  return parsed.success ? parsed.data.serverName : undefined;
}
