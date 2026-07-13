import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lib } from './_extract.mjs';

test('charUuid builds characteristic UUIDs from the base pattern', () => {
  assert.equal(lib.SERVICE_UUID, 'a3300001-0000-1000-8000-00805f9b34fb');
  assert.equal(lib.charUuid(0x01), 'a3300001-0000-1000-8001-00805f9b34fb');
  assert.equal(lib.charUuid(0x14), 'a3300001-0000-1000-8014-00805f9b34fb');
  assert.equal(lib.charUuid(0x21), 'a3300001-0000-1000-8021-00805f9b34fb');
});

test('sensorName matches firmware sensor_name()', () => {
  assert.equal(lib.sensorName(0), 'ADXL');
  assert.equal(lib.sensorName(1), 'LSM_A');
  assert.equal(lib.sensorName(2), 'LSM_G');
  assert.equal(lib.sensorName(3), 'MAG');
  assert.equal(lib.sensorName(7), '???');
  assert.equal(lib.SAMPLE_SIZE, 16);
});
