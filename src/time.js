import { CRONS_IN_DAY, CRONS_IN_SECOND, CORDIAL_MINUTES_IN_HOUR, CORDIAL_SECONDS_IN_MINUTE } from "./constants.js";

const SECONDS_IN_HOUR = CORDIAL_MINUTES_IN_HOUR * CORDIAL_SECONDS_IN_MINUTE;   // 2,704

/**
 * The Cordial time of day of a Date (its local clock): hours 0-25, minutes 0-51, seconds 0-51 and the cron 0-6, counted from Gregorian noon,
 * where the Cordial day begins. Exact integer arithmetic over the 492,128 crons of the day, truncated (not rounded), as the Python core.
 */
export function cordialTime(date) {
    const sinceMidnight = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds() + date.getMilliseconds() / 1000;
    const sinceNoon = (sinceMidnight + 43200) % 86400;
    const crons = Math.floor(sinceNoon * CRONS_IN_DAY / 86400);
    const seconds = Math.floor(crons / CRONS_IN_SECOND);
    return {
        h: Math.floor(seconds / SECONDS_IN_HOUR),
        m: Math.floor((seconds % SECONDS_IN_HOUR) / CORDIAL_SECONDS_IN_MINUTE),
        s: seconds % CORDIAL_SECONDS_IN_MINUTE,
        c: crons % CRONS_IN_SECOND,
        crons: crons
    };
}

/** "HH:MM:SS.c" */
export function formatTime(t) {
    const p = (v) => String(v).padStart(2, "0");
    return p(t.h) + ":" + p(t.m) + ":" + p(t.s) + "." + t.c;
}
