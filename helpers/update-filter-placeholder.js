import { washingMachineFunctionDisplayName } from "../pipes/washing-machine-function-pipe.js";
export function updateFilterPlaceholder(htmlElement, filterArr, isFunctionFilter = false) {
    if (isFunctionFilter) {
        htmlElement.innerText = washingMachineFunctionDisplayName(filterArr, ' +');
    }
    else {
        htmlElement.innerText = filterArr.sort().join(", ");
    }
}
