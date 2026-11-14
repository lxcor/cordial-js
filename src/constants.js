// Cordial constants. The reference implementation is lxcor-cordial (Python): https://github.com/lxcor/cordial-core

/** The thirteen months, named for the constellations the sun crosses from the March equinox. */
export const MONTHS = ["Taurus", "Orion", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces", "Aries"];

/** The seven weekdays, named for the colours of the spectrum from the short waves to the long, closed by purple (not in the spectrum). */
export const WEEKDAYS = [
    {latin: "Lividus",   code: "Li", color: "blue",   css: "#1f5fff"},
    {latin: "Caeruleus", code: "Cy", color: "aqua",   css: "#00b7c3"},
    {latin: "Viridis",   code: "Vi", color: "green",  css: "#1a9a3a"},
    {latin: "Flavus",    code: "Fl", color: "yellow", css: "#f2c200"},
    {latin: "Aurantium", code: "Au", color: "orange", css: "#ff8a00"},
    {latin: "Ruber",     code: "Ru", color: "red",    css: "#e01b1b"},
    {latin: "Ostrum",    code: "Os", color: "purple", css: "#9b27b0"}
];

export const DAYS_IN_MONTH = 28;
export const MONTHS_IN_YEAR = 13;
export const DAYS_IN_YEAR = 364;                 // 13 x 28 = 52 x 7; the 1 or 2 Void Days after it are decided by the equinox
export const DAYS_IN_WEEK = 7;

export const CORDIAL_HOURS_IN_DAY = 26;
export const CORDIAL_MINUTES_IN_HOUR = 52;
export const CORDIAL_SECONDS_IN_MINUTE = 52;
export const CRONS_IN_SECOND = 7;                // a cron is one division of the dial: a seventh of a Cordial second
export const SECONDS_IN_DAY = 70304;             // 26 x 52 x 52
export const CRONS_IN_DAY = 492128;              // 70,304 x 7: the number of crons in a day is fixed, the length of one is a measurement

/** Anno Adami: the Cordial year that closes at the equinox of Gregorian year Y is Y + AA_OFFSET (Year 1 = 4004 BC). */
export const AA_OFFSET = 4003;
