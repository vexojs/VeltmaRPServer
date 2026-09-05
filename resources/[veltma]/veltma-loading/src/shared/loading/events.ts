import { z } from 'zod';

const eventNameSchema = z.object({ eventName: z.string().min(1).max(80) }).passthrough();

const loadProgressSchema = z
  .object({
    eventName: z.literal('loadProgress'),
    loadFraction: z.number().finite().min(0).max(1),
  })
  .passthrough();

const onLogLineSchema = z
  .object({
    eventName: z.literal('onLogLine'),
    message: z.string().max(500),
  })
  .passthrough();

const startDataFileEntriesSchema = z
  .object({
    eventName: z.literal('startDataFileEntries'),
    count: z.number().int().nonnegative(),
  })
  .passthrough();

const onDataFileEntrySchema = z
  .object({
    eventName: z.literal('onDataFileEntry'),
    name: z.string().max(160),
    type: z.number().int(),
    isNew: z.boolean(),
  })
  .passthrough();

const endDataFileEntriesSchema = z
  .object({
    eventName: z.literal('endDataFileEntries'),
  })
  .passthrough();

const startInitFunctionSchema = z
  .object({
    eventName: z.literal('startInitFunction'),
    type: z.string().max(160),
  })
  .passthrough();

const endInitFunctionSchema = z
  .object({
    eventName: z.literal('endInitFunction'),
    type: z.string().max(160),
  })
  .passthrough();

const startInitFunctionOrderSchema = z
  .object({
    eventName: z.literal('startInitFunctionOrder'),
    type: z.string().max(160),
    order: z.number().int().nonnegative(),
    count: z.number().int().nonnegative(),
  })
  .passthrough();

const initFunctionInvokingSchema = z
  .object({
    eventName: z.literal('initFunctionInvoking'),
    type: z.string().max(160),
    name: z.string().max(160),
    idx: z.number().int().nonnegative(),
  })
  .passthrough();

const initFunctionInvokedSchema = z
  .object({
    eventName: z.literal('initFunctionInvoked'),
    type: z.string().max(160),
    name: z.string().max(160),
  })
  .passthrough();

const performMapLoadFunctionSchema = z
  .object({
    eventName: z.literal('performMapLoadFunction'),
    idx: z.number().int().nonnegative(),
  })
  .passthrough();

export const loadingEventSchema = z.union([
  loadProgressSchema,
  onLogLineSchema,
  startDataFileEntriesSchema,
  onDataFileEntrySchema,
  endDataFileEntriesSchema,
  startInitFunctionSchema,
  endInitFunctionSchema,
  startInitFunctionOrderSchema,
  initFunctionInvokingSchema,
  initFunctionInvokedSchema,
  performMapLoadFunctionSchema,
]);

export type LoadingEvent = z.infer<typeof loadingEventSchema>;
export type LoadingEventName = LoadingEvent['eventName'];

export function parseLoadingEvent(input: unknown): LoadingEvent | undefined {
  const parsed = loadingEventSchema.safeParse(input);
  return parsed.success ? parsed.data : undefined;
}

export function isLoadingEventEnvelope(input: unknown): boolean {
  return eventNameSchema.safeParse(input).success;
}
