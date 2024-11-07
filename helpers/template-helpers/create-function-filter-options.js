import { functionNameConverter } from "../../pipes/washing-machine-function-pipe.js";
export function createFunctionsFilterOptions(functionsArray) {
    let resultTemplate = `
  <option value="ALL" class="multiple-select-option">
    Wszystkie
  </option>`;
    functionsArray.map((func) => {
        resultTemplate += `
    <option value="${func}" class="multiple-select-option">
      <span
        id="${func}"
        style="visibility: hidden"
        class="checkmark"
      >
        <div class="checkmark_stem"></div>
        <div class="checkmark_kick"></div>
      </span>
      ${functionNameConverter(func)}
    </option>`;
    });
    return resultTemplate;
}
