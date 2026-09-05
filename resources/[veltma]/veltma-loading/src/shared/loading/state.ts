import type { LoadingEvent } from './events';
import { parseLoadingEvent } from './events';

export type LoadingPhase = 'connecting' | 'resources' | 'data' | 'map' | 'ready';

export interface LoadingState {
  progress: number;
  phase: LoadingPhase;
  statusText: string;
}

export const initialLoadingState: LoadingState = {
  progress: 0,
  phase: 'connecting',
  statusText: 'Connecting to the server…',
};

function phaseStatus(phase: LoadingPhase): string {
  switch (phase) {
    case 'connecting':
      return 'Connecting to the server…';
    case 'resources':
      return 'Loading server resources…';
    case 'data':
      return 'Loading world data…';
    case 'map':
      return 'Preparing the city…';
    case 'ready':
      return 'Finishing up…';
  }
}

export function reduceLoadingEvent(state: LoadingState, input: unknown): LoadingState {
  const event = parseLoadingEvent(input);
  return event ? reduceParsedLoadingEvent(state, event) : state;
}

function reduceParsedLoadingEvent(state: LoadingState, event: LoadingEvent): LoadingState {
  switch (event.eventName) {
    case 'loadProgress': {
      const progress = Math.max(state.progress, event.loadFraction);
      return {
        progress,
        phase: progress >= 1 ? 'ready' : state.phase,
        statusText: progress >= 1 ? phaseStatus('ready') : state.statusText,
      };
    }
    case 'onLogLine':
      return { ...state, phase: 'resources', statusText: phaseStatus('resources') };
    case 'startDataFileEntries':
      return { ...state, phase: 'data', statusText: phaseStatus('data') };
    case 'onDataFileEntry':
      return { ...state, phase: 'data', statusText: phaseStatus('data') };
    case 'endDataFileEntries':
      return { ...state, phase: 'resources', statusText: phaseStatus('resources') };
    case 'performMapLoadFunction':
      return { ...state, phase: 'map', statusText: phaseStatus('map') };
    case 'startInitFunction':
      return { ...state, phase: 'resources', statusText: phaseStatus('resources') };
    case 'startInitFunctionOrder':
      return { ...state, phase: 'resources', statusText: phaseStatus('resources') };
    case 'initFunctionInvoking':
      return { ...state, phase: 'resources', statusText: phaseStatus('resources') };
    case 'initFunctionInvoked':
      return { ...state, phase: 'resources', statusText: phaseStatus('resources') };
    case 'endInitFunction':
      return { ...state, phase: 'ready', statusText: phaseStatus('ready') };
  }
}
