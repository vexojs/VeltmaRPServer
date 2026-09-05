import { describe, expect, it } from 'vitest';
import { parseLoadingEvent } from '../src/shared/loading/events';
import { initialLoadingState, reduceLoadingEvent } from '../src/shared/loading/state';

describe('loading events', () => {
  it('accepts the official progress event shape', () => {
    expect(parseLoadingEvent({ eventName: 'loadProgress', loadFraction: 0.5 })).toEqual({
      eventName: 'loadProgress',
      loadFraction: 0.5,
    });
  });

  it('accepts documented initialization event payloads', () => {
    expect(
      parseLoadingEvent({
        eventName: 'startInitFunctionOrder',
        type: 'INIT_FUNCTION',
        order: 0,
        count: 1,
      }),
    ).toMatchObject({ eventName: 'startInitFunctionOrder', order: 0, count: 1 });
  });

  it('ignores malformed or unknown browser messages', () => {
    expect(parseLoadingEvent({ eventName: 'loadProgress', loadFraction: 3 })).toBeUndefined();
    expect(parseLoadingEvent({ eventName: 'unknown', value: 'ignored' })).toBeUndefined();
    expect(reduceLoadingEvent(initialLoadingState, { eventName: 'unknown' })).toEqual(
      initialLoadingState,
    );
  });

  it('does not move progress backward and reports major loading phases', () => {
    const afterProgress = reduceLoadingEvent(initialLoadingState, {
      eventName: 'loadProgress',
      loadFraction: 0.7,
    });
    const afterMap = reduceLoadingEvent(afterProgress, {
      eventName: 'performMapLoadFunction',
      idx: 0,
    });
    const afterBackwardProgress = reduceLoadingEvent(afterMap, {
      eventName: 'loadProgress',
      loadFraction: 0.3,
    });

    expect(afterMap.phase).toBe('map');
    expect(afterBackwardProgress.progress).toBe(0.7);
    expect(reduceLoadingEvent(afterMap, { eventName: 'loadProgress', loadFraction: 1 }).phase).toBe(
      'ready',
    );
  });
});
