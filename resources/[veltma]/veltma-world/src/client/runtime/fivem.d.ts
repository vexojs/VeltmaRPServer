declare function setTick(callback: () => void): number;
declare function PlayerId(): number;
declare function SetPedDensityMultiplierThisFrame(multiplier: number): void;
declare function SetScenarioPedDensityMultiplierThisFrame(
  interiorMultiplier: number,
  exteriorMultiplier: number,
): void;
declare function SetVehicleDensityMultiplierThisFrame(multiplier: number): void;
declare function SetRandomVehicleDensityMultiplierThisFrame(multiplier: number): void;
declare function SetParkedVehicleDensityMultiplierThisFrame(multiplier: number): void;
declare function SetRandomBoats(toggle: boolean): void;
declare function SetRandomTrains(toggle: boolean): void;
declare function SetGarbageTrucks(toggle: boolean): void;
declare function SetCreateRandomCops(toggle: boolean): void;
declare function SetCreateRandomCopsNotOnScenarios(toggle: boolean): void;
declare function SetCreateRandomCopsOnScenarios(toggle: boolean): void;
declare function EnableDispatchService(dispatchService: number, toggle: boolean): void;
declare function SetDispatchCopsForPlayer(player: number, toggle: boolean): void;
declare function ClearPlayerWantedLevel(player: number): void;
declare function SetPlayerWantedLevel(
  player: number,
  wantedLevel: number,
  disableNoMission: boolean,
): void;
declare function SetPlayerWantedLevelNow(player: number, toggle: boolean): void;
