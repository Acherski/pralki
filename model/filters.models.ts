import { EnergyEfficiencyClass } from "./energy-efficiency-class.enum.js";
import { WashingMachineFunction } from "./washing-machine-functions.enum.js";

export interface Filters {
  search: string;
  functions: WashingMachineFunction[];
  energyEfficiency: EnergyEfficiencyClass[];
  capacity: number[];
}
