import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lib } from './_extract.mjs';

const meta = { flightNumber: 42, slot: 3, sampleCount: 2, durationMs: 1234 };
const samples = [
  { timestampMs: 100, x: -1, y: 2, z: 3, sensorId: 0 },
  { timestampMs: 102, x: 4, y: 5, z: -6, sensorId: 2 },
];

test('buildCsv matches firmware recorder_dump_csv format (no ODR line)', () => {
  assert.equal(lib.buildCsv(meta, samples),
`# Arrow Tracker Flight Log
# Flight: 42 (slot 3)
# Samples: 2
# Duration: 1.234 s
timestamp_ms,sensor,x,y,z
100,ADXL,-1,2,3
102,LSM_G,4,5,-6
# End of recording
`);
});

test('buildCsv pads sub-second durations to three digits', () => {
  const csv = lib.buildCsv({ ...meta, durationMs: 5007 }, []);
  assert.ok(csv.includes('# Duration: 5.007 s\n'));
});

test('buildCsv partial adds a PARTIAL comment with received vs expected', () => {
  const csv = lib.buildCsv({ ...meta, sampleCount: 9000 }, samples, { partial: true });
  assert.ok(csv.includes('# PARTIAL: received 2 of 9000 samples\n'));
});
