import { WashingMachineFunction } from "../model/washing-machine-functions.enum.js";
export function washingMachineFunctionDisplayName(funcArr, separator = ",") {
    const result = funcArr.map((func) => functionNameConverter(func));
    return result.join(`${separator} `);
}
export function functionNameConverter(func) {
    switch (func) {
        case WashingMachineFunction.ADD_WASH:
            return "Drzwi AddWash";
        case WashingMachineFunction.ELECTRONIC_DISPLAY:
            return "Wyświetlacz elektroniczny";
        case WashingMachineFunction.INVERTER_DUTY_MOTOR:
            return "Silnik inwerterowy";
        case WashingMachineFunction.PANEL_AI_CONTROL:
            return "Panel AI Control";
    }
}
