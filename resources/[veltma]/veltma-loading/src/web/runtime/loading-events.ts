import { isLoadingEventEnvelope } from '../../shared/loading/events';

export type LoadingEventListener = (event: unknown) => void;

const mockEvents: ReadonlyArray<{ delay: number; event: unknown }> = [
  { delay: 250, event: { eventName: 'onLogLine', message: 'Loading resources' } },
  { delay: 900, event: { eventName: 'startDataFileEntries', count: 12 } },
  { delay: 1600, event: { eventName: 'loadProgress', loadFraction: 0.42 } },
  { delay: 2500, event: { eventName: 'performMapLoadFunction', idx: 0 } },
  { delay: 3400, event: { eventName: 'loadProgress', loadFraction: 1 } },
];

export function subscribeToLoadingEvents(listener: LoadingEventListener): () => void {
  const onMessage = (message: MessageEvent<unknown>) => {
    if (isLoadingEventEnvelope(message.data)) listener(message.data);
  };

  window.addEventListener('message', onMessage);

  const timers = import.meta.env.DEV
    ? mockEvents.map(({ delay, event }) => window.setTimeout(() => listener(event), delay))
    : [];

  return () => {
    window.removeEventListener('message', onMessage);
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}
