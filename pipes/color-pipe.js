import { WashingMachineColor } from "../model/washing-machine-color.enum.js";
// Transforms english names of colors to polish ones
export function colorPipe(color) {
    switch (color) {
        case WashingMachineColor.BLACK:
            return "czarny";
        case WashingMachineColor.SILVER:
            return "srebrny";
        case WashingMachineColor.WHITE:
            return "biały";
    }
}
