import { EQUINOX_FIRST_YEAR, EQUINOX_LAST_YEAR, EQUINOX_MARCH_DAY } from "./equinox_table.js";

export { EQUINOX_FIRST_YEAR, EQUINOX_LAST_YEAR };

const DAY_MS = 86400000;

/** Days since 1970-01-01 of a calendar date (month 0-based). Pure calendar arithmetic: no time zone, no daylight saving. */
export function dayNumber(year, month, day) {
    return Math.floor(Date.UTC(year, month, day) / DAY_MS);
}

/** The day of March on which the March equinox falls (UTC date), or null outside the table. */
export function vernalEquinoxDay(year) {
    return Object.prototype.hasOwnProperty.call(EQUINOX_MARCH_DAY, year) ? EQUINOX_MARCH_DAY[year] : null;
}

/** The equinox date as a day number. Outside the table the equinox is taken as 20 March (it falls on 19-21 March): `approximate` says so. */
export function equinoxDayNumber(year) {
    const day = vernalEquinoxDay(year);
    return {dn: dayNumber(year, 2, day === null ? 20 : day), approximate: day === null};
}
