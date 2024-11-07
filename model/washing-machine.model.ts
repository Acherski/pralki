import { EnergyEfficiencyClass } from "./energy-efficiency-class.enum.js";
import { WashingMachineFunction } from "./washing-machine-functions.enum.js";

export interface WashingMachine {
  name: string;
  model: string;
  color: any;
  functions: WashingMachineFunction[];
  capacity: number;
  dimensions: {
    width: number;
    depth: number;
    height: number;
  };
  energyEfficiency: EnergyEfficiencyClass;
  instalment: {
    availability: boolean;
    value: number;
    amount: number;
  };
  price: {
    value: number;
    date_from: string;
    date_to: string;
  };
  img: string;
  soldAmount: number;
}

export interface WashingMachineWithUuid extends WashingMachine {
  uuid: string;
}
