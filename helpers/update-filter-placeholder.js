import { washingMachineFunctionDisplayName } from "../pipes/washing-machine-function-pipe.js";
export function updateFilterPlaceholder(htmlElement, filterArr, isFunctionFilter = false) {
    if (isFunctionFilter) {
        htmlElement.innerText = washingMachineFunctionDisplayName(filterArr, " +");
    }
    else if (!filterArr.some(isNaN)) {
        htmlElement.innerText = filterArr.sort((a, b) => b - a).join(", ");
    }
    else {
        htmlElement.innerText = filterArr.sort().join(", ");
    }
}
