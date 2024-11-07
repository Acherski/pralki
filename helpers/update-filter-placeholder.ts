import { WashingMachineFunction } from "../model/washing-machine-functions.enum.js";
import { washingMachineFunctionDisplayName } from "../pipes/washing-machine-function-pipe.js";

export function updateFilterPlaceholder(
  htmlElement: HTMLElement,
  filterArr: any[],
  isFunctionFilter = false
) {
  if (isFunctionFilter) {
    htmlElement.innerText = washingMachineFunctionDisplayName(
      filterArr as WashingMachineFunction[],
      " +"
    );
  } else if (!filterArr.some(isNaN)) {
    htmlElement!.innerText = filterArr.sort((a, b) => b - a).join(", ");
  } else {
    htmlElement!.innerText = filterArr.sort().join(", ");
  }
}
