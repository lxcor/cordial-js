// Run with `npm test` (the clock of the machine is read: TZ=UTC is set by the script below for a stable result).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as Cordial from "../src/index.js";

const here = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(readFileSync(join(here, "fixtures", "cases.json"), "utf8"));
const at = (y, mo, d, h = 13, mi = 0, s = 0) => new Date(y, mo - 1, d, h, mi, s);

test("equals the Python reference core in every fixture case (date, Void Day, AA year, time to the cron)", () => {
    assert.ok(cases.length >= 300 && cases.some((c) => c.void), "fixtures present");
    for (const c of cases) {
        const i = Cordial.cordialInfo(at(...c.in));
        assert.equal(i.voidDay, c.void, JSON.stringify(c));
        assert.equal(i.aaYear, c.aa, JSON.stringify(c));
        assert.equal(Cordial.formatTime(i.time), c.time, JSON.stringify(c));
        if (!c.void) { assert.equal(i.month, c.month, JSON.stringify(c)); assert.equal(i.dayOfMonth, c.day, JSON.stringify(c)); }
    }
});

test("the Cordial day begins at Gregorian noon", () => {
    assert.equal(Cordial.cordialInfo(at(2026, 11, 13, 10)).dayOfYear, 238);
    assert.equal(Cordial.cordialInfo(at(2026, 11, 13, 14)).dayOfYear, 239);
    assert.equal(Cordial.formatTime(Cordial.cordialInfo(at(2026, 11, 13, 12, 0, 0)).time), "00:00:00.0");
    assert.equal(Cordial.formatTime(Cordial.cordialInfo(at(2026, 11, 13, 11, 59, 59)).time).slice(0, 8), "25:51:51");
});

test("days before the March equinox count from the previous equinox date, not from the Gregorian year length", () => {
    // the cases where a leap year meets a 19 March equinox: the core says 319 and 357 (a calendar-year length would give 320 and 358)
    assert.equal(Cordial.cordialInfo(at(2044, 2, 1)).dayOfYear, 319);
    assert.equal(Cordial.cordialInfo(at(2044, 3, 10)).dayOfYear, 357);
    assert.equal(Cordial.cordialInfo(at(2048, 2, 1)).dayOfYear, 319);
    assert.equal(Cordial.cordialInfo(at(2043, 2, 1)).dayOfYear, 319);
});

test("the year starts at noon on the equinox date; the days after day 364 are neutral Void Days", () => {
    assert.equal(Cordial.cordialInfo(at(2048, 3, 19, 12, 0, 1)).dayOfYear, 1);
    assert.equal(Cordial.cordialInfo(at(2048, 3, 20, 12, 0, 1)).dayOfYear, 2);
    const v = Cordial.cordialInfo(at(2026, 3, 19, 13));
    assert.equal(v.voidDay, 1); assert.equal(v.polarity, "0"); assert.equal(v.month, undefined); assert.equal(v.weekday, undefined);
    let two = 0;
    for (let y = 2020; y < 2100; y++) {            // a year of 366 days has two Void Days
        const last = Cordial.cordialInfo(at(y + 1, 3, Cordial.vernalEquinoxDay(y + 1), 11, 59, 59));
        if (last.voidDay === 2) two++; else assert.equal(last.voidDay, 1, "year " + y);
    }
    assert.ok(two > 5 && two < 40, "some years have two Void Days: " + two);
});

test("polarity alternates + and -, 182 of each in the 364 days; every month starts + and ends -", () => {
    let plus = 0, minus = 0;
    for (let n = 0; n < 364; n++) {
        const i = Cordial.cordialInfo(at(2026, 3, 20 + n, 13));
        if (i.polarity === "+") plus++; else minus++;
        assert.equal(i.dayOfYear, n + 1);
        if (i.dayOfMonth === 1) assert.equal(i.polarity, "+");
        if (i.dayOfMonth === 28) assert.equal(i.polarity, "−");
    }
    assert.deepEqual([plus, minus], [182, 182]);
});

test("the weekday follows the colours of the spectrum: day 1 is the blue day Lividus; each colour is + twice and - twice a month", () => {
    const d1 = Cordial.cordialInfo(at(2026, 3, 20, 13)), d2 = Cordial.cordialInfo(at(2026, 3, 21, 13)), d8 = Cordial.cordialInfo(at(2026, 3, 27, 13));
    assert.deepEqual([d1.weekday.latin, d1.weekday.color, d1.polarity], ["Lividus", "blue", "+"]);
    assert.deepEqual([d2.weekday.latin, d2.polarity], ["Caeruleus", "−"]);
    assert.deepEqual([d8.weekday.latin, d8.polarity], ["Lividus", "−"]);
    const first = Cordial.cordialInfo(at(2026, 3, 20 + 28 * 4, 13));          // a month in the middle of the year
    assert.equal(first.dayOfMonth, 1);
    const sign = {};
    for (let d = 0; d < 28; d++) { const i = Cordial.cordialInfo(at(2026, 3, 20 + 28 * 4 + d, 13)); sign[i.weekday.color] = (sign[i.weekday.color] || 0) + (i.polarity === "+" ? 1 : -1); }
    assert.deepEqual(Object.values(sign), [0, 0, 0, 0, 0, 0, 0]);
});

test("Anno Adami: the Cordial year of March 2026 to March 2027 is 6030", () => {
    assert.equal(Cordial.cordialInfo(at(2026, 11, 13)).aaYear, 6030);
    assert.equal(Cordial.toAA(2027), 6030);
    assert.equal(Cordial.fromAA(6030), 2027);
});

test("the equinox table covers 2020-2100 and says so when it is outside", () => {
    assert.equal(Cordial.vernalEquinoxDay(2044), 19);
    assert.equal(Cordial.vernalEquinoxDay(2100), 20);
    assert.equal(Cordial.vernalEquinoxDay(2101), null);
    assert.equal(Cordial.cordialInfo(at(2050, 6, 1)).approximate, false);
    assert.equal(Cordial.cordialInfo(at(2105, 6, 1)).approximate, true);
});

test("the browser / CommonJS bundle (dist/) gives the same answers as the source", () => {
    const code = readFileSync(join(here, "..", "dist", "cordial.js"), "utf8");
    const sandbox = { self: {} }; vm.createContext(sandbox); vm.runInContext(code, sandbox);
    const cjs = createRequire(import.meta.url)("../dist/cordial.cjs");
    for (const c of cases.slice(0, 60)) {
        const want = JSON.stringify(Cordial.cordialInfo(at(...c.in)));
        assert.equal(JSON.stringify(sandbox.self.Cordial.cordialInfo(at(...c.in))), want);
        assert.equal(JSON.stringify(cjs.cordialInfo(at(...c.in))), want);
    }
    assert.ok(typeof sandbox.self.Cordial.WEEKDAYS[0].latin === "string");
});
