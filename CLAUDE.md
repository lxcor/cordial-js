# cordial-js (npm: lxcor-cordial)

The Cordial calendar and clock in JavaScript. Public repo `github.com/lxcor/cordial-js`, next to the Python reference core `github.com/lxcor/cordial-core` (PyPI `lxcor-cordial`). Apache-2.0.

## Rules

- **The Python core is the reference.** A behaviour change starts there (the cordial-web agent owns it); here we reproduce it. `test/fixtures/cases.json` is generated from the core by `tools/gen_fixtures.py`: regenerate it, never hand-edit it. If a JS answer and the core disagree, the core wins.
- The Cordial day begins at **Gregorian noon**; the year at noon on the March-equinox date; days after 364 are Void Days (neutral, no weekday, no month).
- The blue weekday is **Lividus**.
- `src/equinox_table.js` is generated (`tools/gen_equinox.py`, DE440): do not edit it.
- No dependencies. `scripts/build.mjs` bundles `src/` into `dist/` by concatenation: every top-level name must be unique across the modules, and `src/index.js` must list the public names as `export { ... } from "./x.js"` lines (the bundler reads them).
- `dist/` is committed and must equal the build (`npm test` rebuilds; CI checks `git diff --exit-code dist`).

## Working here

Lives in `/home/cordial-mobile/cordial-js` (user `cordial-mobile`); pushes over SSH with a GitHub deploy key (write) for this repo. Node 22 toolchain: `. scripts/../../cordial-mobile/scripts/activate-android36.sh` puts `node` on the PATH, or use `~/node-22/bin`.

## Consumers

- `cordial-mobile` (offline Android app): today carries its own copy of `cordialInfo` (`app/cordial_info.js`) and the equinox table; to be replaced by this package.
- `cordial-web` (site): `static/cordial_clock.js` has the same logic with two known differences (day hand rolls over at midnight; day count before the equinox off by one in some years): contract filed 2026-11-14.

## Not yet

SVG clock renderer, converters (Gregorian <-> Cordial dates, angles, places), Julian Day Number, npm publication (needs the owner's npm account).
