import { z } from 'zod';

export const worldConfigSchema = z
  .object({
    disablePedestrians: z.boolean().default(true),
    disableTraffic: z.boolean().default(true),
    disableParkedVehicles: z.boolean().default(true),
    disableRandomVehicles: z.boolean().default(true),
    disableEmergencyServices: z.boolean().default(true),
    disableDispatch: z.boolean().default(true),
    disableWantedLevel: z.boolean().default(true),
    disableScenarios: z.boolean().default(true),
  })
  .strict();

export type WorldConfig = z.infer<typeof worldConfigSchema>;

export function createWorldConfig(input: unknown = {}): WorldConfig {
  return worldConfigSchema.parse(input);
}
