import { describe, expect, it } from 'vitest';
import { createWorldConfig } from '../src/shared/config/index.js';
import { WorldController, type WorldNativeBindings } from '../src/client/world/index.js';

function createNatives() {
  const calls: Array<[string, ...unknown[]]> = [];
  const natives: WorldNativeBindings = {
    setTick: (callback) => {
      calls.push(['setTick', callback]);
      return 1;
    },
    playerId: () => 7,
    setPedDensityThisFrame: (value) => calls.push(['pedDensity', value]),
    setScenarioPedDensityThisFrame: (interior, exterior) =>
      calls.push(['scenarioDensity', interior, exterior]),
    setVehicleDensityThisFrame: (value) => calls.push(['vehicleDensity', value]),
    setRandomVehicleDensityThisFrame: (value) => calls.push(['randomVehicleDensity', value]),
    setParkedVehicleDensityThisFrame: (value) => calls.push(['parkedVehicleDensity', value]),
    setRandomBoats: (value) => calls.push(['randomBoats', value]),
    setRandomTrains: (value) => calls.push(['randomTrains', value]),
    setGarbageTrucks: (value) => calls.push(['garbageTrucks', value]),
    setCreateRandomCops: (value) => calls.push(['randomCops', value]),
    setCreateRandomCopsNotOnScenarios: (value) => calls.push(['randomCopsNotScenarios', value]),
    setCreateRandomCopsOnScenarios: (value) => calls.push(['randomCopsOnScenarios', value]),
    enableDispatchService: (service, value) => calls.push(['dispatch', service, value]),
    setDispatchCopsForPlayer: (player, value) => calls.push(['dispatchCops', player, value]),
    clearPlayerWantedLevel: (player) => calls.push(['clearWanted', player]),
    setPlayerWantedLevel: (player, level, disableNoMission) =>
      calls.push(['wanted', player, level, disableNoMission]),
    setPlayerWantedLevelNow: (player, value) => calls.push(['wantedNow', player, value]),
  };
  return { calls, natives };
}

describe('WorldController', () => {
  it('applies empty-world controls without deleting entities', () => {
    const { calls, natives } = createNatives();
    const controller = new WorldController(createWorldConfig(), natives);

    controller.start();
    const tick = calls.find(([name]) => name === 'setTick')?.[1] as (() => void) | undefined;
    tick?.();

    expect(calls).toContainEqual(['pedDensity', 0]);
    expect(calls).toContainEqual(['scenarioDensity', 0, 0]);
    expect(calls).toContainEqual(['vehicleDensity', 0]);
    expect(calls).toContainEqual(['randomVehicleDensity', 0]);
    expect(calls).toContainEqual(['parkedVehicleDensity', 0]);
    expect(calls).toContainEqual(['randomBoats', false]);
    expect(calls).toContainEqual(['randomTrains', false]);
    expect(calls).toContainEqual(['garbageTrucks', false]);
    expect(calls.filter(([name]) => name === 'dispatch')).toHaveLength(16);
    expect(calls).toContainEqual(['dispatchCops', 7, false]);
    expect(calls).toContainEqual(['clearWanted', 7]);
    expect(calls).not.toContainEqual(expect.arrayContaining(['delete']));
  });

  it('does not start a frame loop when all controls are enabled', () => {
    const { calls, natives } = createNatives();
    const config = createWorldConfig({
      disablePedestrians: false,
      disableTraffic: false,
      disableParkedVehicles: false,
      disableRandomVehicles: false,
      disableEmergencyServices: false,
      disableDispatch: false,
      disableWantedLevel: false,
      disableScenarios: false,
    });
    const controller = new WorldController(config, natives);

    controller.start();

    expect(calls).toEqual([]);
  });

  it('is idempotent across repeated starts', () => {
    const { calls, natives } = createNatives();
    const controller = new WorldController(createWorldConfig(), natives);

    controller.start();
    controller.start();

    expect(calls.filter(([name]) => name === 'setTick')).toHaveLength(1);
  });
});
