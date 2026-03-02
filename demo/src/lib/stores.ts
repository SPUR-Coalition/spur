import { writable } from 'svelte/store';
import type { TelemetryEvent } from './types';

export const telemetryEvents = writable<TelemetryEvent[]>([]);
export const currentSessionId = writable<string | null>(null);
export const dashboardRefreshTrigger = writable<number>(0);
