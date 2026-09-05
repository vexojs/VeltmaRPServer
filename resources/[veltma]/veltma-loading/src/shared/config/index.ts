import { z } from 'zod';

const assetPathSchema = z
  .string()
  .trim()
  .min(1)
  .max(512)
  .refine((value) => !/["'<>\r\n]/.test(value), 'Asset paths cannot contain markup characters')
  .refine(
    (value) => value.startsWith('./') || value.startsWith('/') || /^https:\/\//.test(value),
    'Asset paths must be local or HTTPS URLs',
  );

const linkSchema = z.object({
  label: z.string().trim().min(1).max(40),
  href: z
    .string()
    .trim()
    .url()
    .max(512)
    .refine((value) => /^https:\/\//.test(value), {
      message: 'Links must use HTTPS',
    }),
});

export const loadingConfigSchema = z.object({
  serverName: z.string().trim().min(1).max(80).default('Veltma Roleplay'),
  tagline: z.string().trim().min(1).max(160).default('A living world, built together.'),
  logoUrl: assetPathSchema.optional(),
  backgroundImageUrl: assetPathSchema.optional(),
  backgroundVideoUrl: assetPathSchema.optional(),
  links: z.array(linkSchema).max(6).default([]),
  rules: z
    .array(z.string().trim().min(1).max(160))
    .max(8)
    .default([
      'Respect other players and keep the world welcoming.',
      'Follow the server rules and staff guidance.',
      'Keep roleplay fair, grounded, and fun.',
    ]),
  messages: z
    .array(z.string().trim().min(1).max(160))
    .min(1)
    .max(8)
    .default([
      'The city is getting ready for you.',
      'Checking the latest world updates.',
      'Almost there. Thanks for your patience.',
    ]),
});

export type LoadingConfig = z.infer<typeof loadingConfigSchema>;

export function createLoadingConfig(input: unknown = {}): LoadingConfig {
  return loadingConfigSchema.parse(input);
}

export const loadingConfig = createLoadingConfig({
  serverName: 'Veltma Roleplay',
  tagline: 'A living world, built together.',
  links: [],
});
