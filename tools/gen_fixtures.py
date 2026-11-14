"""Write test/fixtures/cases.json from the Python reference core: for each instant, the Cordial date (or Void Day), the Anno Adami year and the
time with crons that the core gives. The JS tests must reproduce them exactly.

    pip install lxcor-cordial
    python3 tools/gen_fixtures.py
"""
import datetime, json, os, random
from cordial import cordial_const as K
from cordial.cordial_void_day import CordialVoidDay
from cordial.gregorian_date import GregorianDate
from cordial.gregorian_datetime import GregorianDatetime
from cordial.gregorian_time import GregorianTime

random.seed(7)
instants = []
for y in range(2026, 2051):                       # every equinox boundary: 18-22 March, one second before noon and at noon
    for d in (18, 19, 20, 21, 22):
        for (h, m, s) in ((11, 59, 59), (12, 0, 0)):
            instants.append((y, 3, d, h, m, s))
for _ in range(120):                              # and random instants across a year of years
    t = datetime.datetime(2026, 4, 1) + datetime.timedelta(seconds=random.randint(0, 24 * 365 * 86400))
    instants.append((t.year, t.month, t.day, t.hour, t.minute, t.second))
out = []
for (y, mo, d, h, mi, s) in instants:
    cd = GregorianDatetime(GregorianDate(y, mo, d), GregorianTime(h, mi, s)).to_cordial_datetime()
    if cd is None:
        continue
    e = {"in": [y, mo, d, h, mi, s], "time": GregorianTime(h, mi, s).to_cordial_time_with_crons()}
    if isinstance(cd.date, CordialVoidDay):
        e.update(void=cd.date.void_day, aa=K.to_aa(cd.date.cordial_year))
    else:
        e.update(void=0, month=cd.date.month, day=cd.date.day, aa=K.to_aa(cd.date.year))
    out.append(e)
path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "test", "fixtures", "cases.json")
json.dump(out, open(path, "w"))
print(len(out), "cases,", sum(1 for e in out if e["void"]), "Void Day cases ->", os.path.normpath(path))
