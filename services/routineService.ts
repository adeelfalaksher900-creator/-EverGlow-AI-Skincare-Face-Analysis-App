import { CustomRoutineStep } from '../types';

const STORAGE_KEYS = {
  AM_ROUTINE: 'everglow_am_routine',
  PM_ROUTINE: 'everglow_pm_routine',
  AM_REMINDER: 'everglow_am_reminder',
  PM_REMINDER: 'everglow_pm_reminder',
};

// Simulate network latency to mimic a real API call
const API_LATENCY = 250;

const fakeApiCall = <T>(data: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), API_LATENCY);
    });
};

export const getRoutines = async (): Promise<{ am: CustomRoutineStep[], pm: CustomRoutineStep[] }> => {
    const amRoutine = JSON.parse(localStorage.getItem(STORAGE_KEYS.AM_ROUTINE) || '[]');
    const pmRoutine = JSON.parse(localStorage.getItem(STORAGE_KEYS.PM_ROUTINE) || '[]');
    return fakeApiCall({ am: amRoutine, pm: pmRoutine });
};

export const saveAmRoutine = async (routine: CustomRoutineStep[]): Promise<void> => {
    localStorage.setItem(STORAGE_KEYS.AM_ROUTINE, JSON.stringify(routine));
    await fakeApiCall(undefined);
};

export const savePmRoutine = async (routine: CustomRoutineStep[]): Promise<void> => {
    localStorage.setItem(STORAGE_KEYS.PM_ROUTINE, JSON.stringify(routine));
    await fakeApiCall(undefined);
};

export const getReminders = async (): Promise<{ am: string, pm: string }> => {
    const amReminder = localStorage.getItem(STORAGE_KEYS.AM_REMINDER) || '';
    const pmReminder = localStorage.getItem(STORAGE_KEYS.PM_REMINDER) || '';
    return fakeApiCall({ am: amReminder, pm: pmReminder });
};

export const saveReminder = async (type: 'am' | 'pm', time: string): Promise<void> => {
    const key = type === 'am' ? STORAGE_KEYS.AM_REMINDER : STORAGE_KEYS.PM_REMINDER;
    localStorage.setItem(key, time);
    await fakeApiCall(undefined);
};
