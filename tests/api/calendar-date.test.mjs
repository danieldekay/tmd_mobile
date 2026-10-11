import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const script = [
  "import assert from 'node:assert/strict';",
  "import { parseCalendarDate, formatCalendarDate, calendarDay, isFutureCalendarDay } from './src/lib/dates/calendar-date.ts';",
  "const date = parseCalendarDate('2027-01-01');",
  "assert.equal(date?.getFullYear(), 2027);",
  "assert.equal(date?.getMonth(), 0);",
  "assert.equal(date?.getDate(), 1);",
  "assert.equal(calendarDay('2027-01-01'), '2027-01-01');",
  "assert.equal(formatCalendarDate('2027-01-01', { day: 'numeric', month: 'short', year: 'numeric' }, 'en-GB'), '1 Jan 2027');",
  "assert.equal(parseCalendarDate('2027-02-29'), null);",
  "assert.equal(calendarDay('2028-02-29'), '2028-02-29');",
  "assert.equal(isFutureCalendarDay('2027-01-02', new Date(2027, 0, 1, 12)), true);",
  "assert.equal(isFutureCalendarDay('2027-01-01', new Date(2027, 0, 1, 12)), false);",
  "assert.equal(isFutureCalendarDay('2026-12-31', new Date(2027, 0, 1, 12)), false);"
].join('\n');

for (const tz of ['America/Los_Angeles', 'Pacific/Auckland', 'Europe/Berlin', 'UTC']) {
  test('date-only REST fields display as the given civil day in ' + tz, () => {
    const run = spawnSync(process.execPath,
      ['--experimental-strip-types', '--input-type=module', '-e', script],
      { cwd: process.cwd(), encoding: 'utf8', env: { ...process.env, TZ: tz } });
    assert.equal(run.status, 0, run.stderr || run.stdout);
  });
}
