import type { WorldConfig } from '../../shared/config/index.js';

const DISPATCH_SERVICE_COUNT = 16;
const EMPTY_DENSITY = 0;

export interface WorldNativeBindings {
  readonly setTick: (callback: () => void) => unknown;
  readonly playerId: () => number;
  readonly setPedDensityThisFrame: (multiplier: number) => void;
  readonly setScenarioPedDensityThisFrame: (
    interiorMultiplier: number,
    exteriorMultiplier: number,
  ) => void;
  readonly setVehicleDensityThisFrame: (multiplier: number) => void;
  readonly setRandomVehicleDensityThisFrame: (multiplier: number) => void;
  readonly setParkedVehicleDensityThisFrame: (multiplier: number) => void;
  readonly setRandomBoats: (toggle: boolean) => void;
  readonly setRandomTrains: (toggle: boolean) => void;
  readonly setGarbageTrucks: (toggle: boolean) => void;
  readonly setCreateRandomCops: (toggle: boolean) => void;
  readonly setCreateRandomCopsNotOnScenarios: (toggle: boolean) => void;
  readonly setCreateRandomCopsOnScenarios: (toggle: boolean) => void;
  readonly enableDispatchService: (dispatchService: number, toggle: boolean) => void;
  readonly setDispatchCopsForPlayer: (player: number, toggle: boolean) => void;
  readonly clearPlayerWantedLevel: (player: number) => void;
  readonly setPlayerWantedLevel: (
    player: number,
    wantedLevel: number,
    disableNoMission: boolean,
  ) => void;
  readonly setPlayerWantedLevelNow: (player: number, toggle: boolean) => void;
}

export class WorldController {
  private started = false;

  constructor(
    private readonly config: WorldConfig,
    private readonly natives: WorldNativeBindings,
  ) {}

  start(): void {
    if (this.started) {
      return;
    }

    this.started = true;
    this.applyPersistentControls();
    if (this.needsFrameControls()) {
      this.natives.setTick(() => this.applyFrameControls());
    }
  }

  applyFrameControls(): void {
    if (this.config.disablePedestrians) {
      this.natives.setPedDensityThisFrame(EMPTY_DENSITY);
    }
    if (this.config.disableScenarios) {
      this.natives.setScenarioPedDensityThisFrame(EMPTY_DENSITY, EMPTY_DENSITY);
    }
    if (this.config.disableTraffic) {
      this.natives.setVehicleDensityThisFrame(EMPTY_DENSITY);
    }
    if (this.config.disableRandomVehicles) {
      this.natives.setRandomVehicleDensityThisFrame(EMPTY_DENSITY);
    }
    if (this.config.disableParkedVehicles) {
      this.natives.setParkedVehicleDensityThisFrame(EMPTY_DENSITY);
    }
    if (this.config.disableWantedLevel) {
      const player = this.natives.playerId();
      this.natives.clearPlayerWantedLevel(player);
      this.natives.setPlayerWantedLevel(player, 0, false);
      this.natives.setPlayerWantedLevelNow(player, false);
    }
  }

  private applyPersistentControls(): void {
    if (this.config.disableTraffic || this.config.disableRandomVehicles) {
      this.natives.setRandomBoats(false);
      this.natives.setRandomTrains(false);
      this.natives.setGarbageTrucks(false);
    }

    if (this.config.disableEmergencyServices) {
      this.natives.setCreateRandomCops(false);
      this.natives.setCreateRandomCopsNotOnScenarios(false);
      this.natives.setCreateRandomCopsOnScenarios(false);
    }

    if (this.config.disableDispatch) {
      for (let service = 0; service < DISPATCH_SERVICE_COUNT; service += 1) {
        this.natives.enableDispatchService(service, false);
      }
      this.natives.setDispatchCopsForPlayer(this.natives.playerId(), false);
    }
  }

  private needsFrameControls(): boolean {
    return (
      this.config.disablePedestrians ||
      this.config.disableScenarios ||
      this.config.disableTraffic ||
      this.config.disableRandomVehicles ||
      this.config.disableParkedVehicles ||
      this.config.disableWantedLevel
    );
  }
}

export function createWorldController(config: WorldConfig): WorldController {
  return new WorldController(config, {
    setTick: (callback) => setTick(callback),
    playerId: () => PlayerId(),
    setPedDensityThisFrame: (multiplier) => SetPedDensityMultiplierThisFrame(multiplier),
    setScenarioPedDensityThisFrame: (interiorMultiplier, exteriorMultiplier) =>
      SetScenarioPedDensityMultiplierThisFrame(interiorMultiplier, exteriorMultiplier),
    setVehicleDensityThisFrame: (multiplier) => SetVehicleDensityMultiplierThisFrame(multiplier),
    setRandomVehicleDensityThisFrame: (multiplier) =>
      SetRandomVehicleDensityMultiplierThisFrame(multiplier),
    setParkedVehicleDensityThisFrame: (multiplier) =>
      SetParkedVehicleDensityMultiplierThisFrame(multiplier),
    setRandomBoats: (toggle) => SetRandomBoats(toggle),
    setRandomTrains: (toggle) => SetRandomTrains(toggle),
    setGarbageTrucks: (toggle) => SetGarbageTrucks(toggle),
    setCreateRandomCops: (toggle) => SetCreateRandomCops(toggle),
    setCreateRandomCopsNotOnScenarios: (toggle) =>
      SetCreateRandomCopsNotOnScenarios(toggle),
    setCreateRandomCopsOnScenarios: (toggle) => SetCreateRandomCopsOnScenarios(toggle),
    enableDispatchService: (dispatchService, toggle) =>
      EnableDispatchService(dispatchService, toggle),
    setDispatchCopsForPlayer: (player, toggle) => SetDispatchCopsForPlayer(player, toggle),
    clearPlayerWantedLevel: (player) => ClearPlayerWantedLevel(player),
    setPlayerWantedLevel: (player, wantedLevel, disableNoMission) =>
      SetPlayerWantedLevel(player, wantedLevel, disableNoMission),
    setPlayerWantedLevelNow: (player, toggle) => SetPlayerWantedLevelNow(player, toggle),
  });
}
