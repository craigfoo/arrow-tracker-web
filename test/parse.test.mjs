import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lib } from './_extract.mjs';

function flightInfoBytes(num, count, dur, downloaded) {
  const dv = new DataView(new ArrayBuffer(16));
  dv.setUint32(0, num, true);
  dv.setUint32(4, count, true);
  dv.setUint32(8, dur, true);
  dv.setUint8(12, downloaded);
  return dv;
}

function putSample(dv, off, ts, x, y, z, sensorId) {
  dv.setUint32(off, ts, true);
  dv.setInt16(off + 4, x, true);
  dv.setInt16(off + 6, y, true);
  dv.setInt16(off + 8, z, true);
  dv.setUint8(off + 10, sensorId);
}

test('parseFlightInfo decodes the 16-byte struct', () => {
  const info = lib.parseFlightInfo(flightInfoBytes(42, 12000, 3456, 1));
  assert.deepEqual(info, { flightNumber: 42, sampleCount: 12000, durationMs: 3456, downloaded: true });
  assert.equal(lib.parseFlightInfo(flightInfoBytes(1, 2, 3, 0)).downloaded, false);
});

test('parseSamples decodes multiple 16-byte records, little-endian, signed xyz', () => {
  const dv = new DataView(new ArrayBuffer(32));
  putSample(dv, 0, 1000, -32768, 32767, -1, 0);
  putSample(dv, 16, 1002, 10, -20, 30, 2);
  const { samples, sawTerminator } = lib.parseSamples(dv);
  assert.equal(sawTerminator, false);
  assert.deepEqual(samples, [
    { timestampMs: 1000, x: -32768, y: 32767, z: -1, sensorId: 0 },
    { timestampMs: 1002, x: 10, y: -20, z: 30, sensorId: 2 },
  ]);
});

test('parseSamples stops at terminator (sensor_id 0xFF) and excludes it', () => {
  const dv = new DataView(new ArrayBuffer(32));
  putSample(dv, 0, 500, 1, 2, 3, 1);
  putSample(dv, 16, 0xFFFFFFFF, 0, 0, 0, 0xFF);
  const { samples, sawTerminator } = lib.parseSamples(dv);
  assert.equal(sawTerminator, true);
  assert.equal(samples.length, 1);
  assert.equal(samples[0].timestampMs, 500);
});

test('parseSamples ignores a trailing partial record', () => {
  const dv = new DataView(new ArrayBuffer(20)); // one sample + 4 stray bytes
  putSample(dv, 0, 7, 1, 1, 1, 3);
  const { samples } = lib.parseSamples(dv);
  assert.equal(samples.length, 1);
});
