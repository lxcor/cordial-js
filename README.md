# lxcor-cordial (JavaScript)

The [Cordial](https://cordial.lxcor.com) calendar and clock in JavaScript: 13 months of 28 days, a 364-day year with one or two Void Days decided by the equinox, a day of 26 hours of 52 minutes of 52 seconds that begins at noon, weekdays named for the colours of the spectrum, and the year count from Adam (Anno Adami).

No dependencies. Works in browsers, Node (ESM and CommonJS) and Cordova / WebViews, fully offline.

The reference implementation is the Python package [`lxcor-cordial`](https://pypi.org/project/lxcor-cordial/) ([source](https://github.com/lxcor/cordial-core)). This package reproduces its answers; the tests check that against fixtures generated from the Python core (370 instants: every equinox boundary from 2026 to 2050 one second before noon and at noon, Void Days included).

## Use

```js
import { cordialInfo, formatTime } from "lxcor-cordial";      // or: const Cordial = require("lxcor-cordial");

const i = cordialInfo(new Date());
i.monthName + " " + i.dayOfMonth + ", " + i.aaYear + " AA";     // "Sagittarius 16, 6030 AA"
i.weekday.latin + " (" + i.weekday.color + ")  " + i.polarity;  // "Caeruleus (aqua)  −"
formatTime(i.time);                                             // "09:25:19.2"  HH:MM:SS.cron, counted from noon
```

In a page: `<script src="dist/cordial.js"></script>` gives a global `Cordial` (`Cordial.cordialInfo(new Date())`).

### `cordialInfo(date)`

Everything the calendar says about an instant, read on the Date's local clock:

| field | |
|---|---|
| `dayOfYear` | 1-364, then 365 / 366 on the Void Days |
| `aaYear` | Anno Adami year (the Cordial year of March 2026 to March 2027 is 6030) |
| `month`, `monthName`, `dayOfMonth` | 1-13 (Taurus … Aries), 1-28; absent on a Void Day |
| `weekOfYear`, `weekOfMonth` | 1-52, 1-4 |
| `weekday` | `{latin, code, color, css}`: Lividus blue, Caeruleus aqua, Viridis green, Flavus yellow, Aurantium orange, Ruber red, Ostrum purple |
| `polarity` | `"+"` on odd days, `"−"` on even days (182 of each a year), `"0"` on a Void Day |
| `voidDay` | 0, or 1 / 2 on the Void Days |
| `time` | `{h, m, s, c, crons}`: hours 0-25, minutes 0-51, seconds 0-51, the cron 0-6; exact integer arithmetic over the 492,128 crons of the day, truncated |
| `yearLength` | 365 or 366: the days between this year's equinox date and the next |
| `approximate` | true when an equinox date outside the table was assumed |

The Cordial day **begins at Gregorian noon**: before 12:00 the date is still the one that began at noon the day before.

Also exported: `cordialTime`, `formatTime`, `toAA`, `fromAA`, `vernalEquinoxDay(year)`, `equinoxDayNumber`, `dayNumber`, and the constants (`MONTHS`, `WEEKDAYS`, `AA_OFFSET`, `CRONS_IN_DAY`, …).

## Limits

- The equinox table covers **2020-2100** (JPL DE440 through Skyfield; `tools/gen_equinox.py` regenerates it). Outside it the equinox is assumed to fall on 20 March and `approximate` is true.
- The equinox date is the UTC calendar date of the instant; a place far from UTC can see the year turn a day away from its own equinox date.
- This version has the calendar and the time of day. The SVG clock (today in cordial.lxcor.com and the Android app), the converters and the Julian Day Number are not in it yet.

## Develop

```bash
npm test          # builds dist/ and runs the tests (Node 18+; TZ=UTC)
npm run build     # dist/cordial.js (browsers + CommonJS) and dist/cordial.cjs
python3 tools/gen_fixtures.py   # regenerate test/fixtures/cases.json from the Python core (pip install lxcor-cordial)
python3 tools/gen_equinox.py    # regenerate src/equinox_table.js (pip install skyfield)
```

`dist/` is committed so a script tag or a build without npm can use it; `npm test` rebuilds it, and CI fails if it is out of date.

## License

Apache License 2.0, as the Python core. See `LICENSE` and `NOTICE`.
