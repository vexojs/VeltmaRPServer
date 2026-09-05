import { describe, expect, it } from 'vitest';
import { createWorldConfig } from '../src/shared/config/index.js';

describe('world configuration', () => {
  it('defaults every blank-world control to disabled', () => {
    expect(createWorldConfig()).toEqual({
      disablePedestrians: true,
      disableTraffic: true,
      disableParkedVehicles: true,
      disableRandomVehicles: true,
      disableEmergencyServices: true,
      disableDispatch: true,
      disableWantedLevel: true,
      disableScenarios: true,
    });
  });

  it('rejects unknown configuration keys', () => {
    expect(() => createWorldConfig({ disablePeds: true })).toThrow();
  });
});
