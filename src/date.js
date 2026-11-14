import { AA_OFFSET, DAYS_IN_MONTH, DAYS_IN_YEAR, DAYS_IN_WEEK, MONTHS, WEEKDAYS } from "./constants.js";
import { dayNumber, equinoxDayNumber } from "./equinox.js";
import { cordialTime } from "./time.js";

const MS_PER_DAY = 86400000;

/** Anno Adami year of the Cordial year that closes at the equinox of Gregorian year `closingYear`. */
export function toAA(closingYear) { return closingYear + AA_OFFSET; }
export function fromAA(aaYear) { return aaYear - AA_OFFSET; }

/**
 * Everything the Cordial calendar says about an instant (a Date, read on its local clock).
 *
 * The Cordial day BEGINS AT GREGORIAN NOON, so before 12:00 the date is still the one that began at noon the day before. The year begins at noon on
 * the March-equinox date; the days after day 364 (one, or two when the equinox is 366 days after the last) are Void Days: no month, no weekday, neutral.
 *
 * Returns {dayOfYear, aaYear, yearLength, time:{h,m,s,c,crons}, polarity, approximate, voidDay, ...}; an ordinary day also has
 * month (1-13), monthName, dayOfMonth, weekOfYear, weekOfMonth and weekday ({latin, code, color, css}). polarity is "+" on odd days, "−" on even
 * days and "0" on a Void Day (182 + and 182 - in the year). `approximate` is true when an equinox date outside the table (2020-2100) was assumed.
 */
export function cordialInfo(date) {
    let dn = dayNumber(date.getFullYear(), date.getMonth(), date.getDate());
    if (date.getHours() < 12) dn -= 1;                                    // the Cordial day began at the previous noon

    let y = new Date(dn * MS_PER_DAY).getUTCFullYear();
    let start = equinoxDayNumber(y);
    if (dn < start.dn) { y -= 1; start = equinoxDayNumber(y); }
    const next = equinoxDayNumber(y + 1);
    const n = dn - start.dn + 1;                                          // day of the Cordial year, 1-based

    const info = {
        dayOfYear: n,
        aaYear: toAA(y + 1),                                              // the year that starts in March of y closes at the equinox of y + 1
        yearLength: next.dn - start.dn,                                   // 365 or 366
        time: cordialTime(date),
        approximate: start.approximate || next.approximate
    };
    if (n > DAYS_IN_YEAR) {
        info.voidDay = n - DAYS_IN_YEAR;
        info.polarity = "0";
        return info;
    }
    info.voidDay = 0;
    info.month = Math.ceil(n / DAYS_IN_MONTH);
    info.monthName = MONTHS[info.month - 1];
    info.dayOfMonth = (n - 1) % DAYS_IN_MONTH + 1;
    info.weekOfYear = Math.ceil(n / DAYS_IN_WEEK);
    info.weekOfMonth = Math.ceil(info.dayOfMonth / DAYS_IN_WEEK);
    info.weekday = WEEKDAYS[(n - 1) % DAYS_IN_WEEK];
    info.polarity = n % 2 === 1 ? "+" : "−";
    return info;
}
