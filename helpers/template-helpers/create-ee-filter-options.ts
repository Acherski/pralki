import { EnergyEfficiencyClass } from "../../model/energy-efficiency-class.enum.js";

export function createEnergyEfficiencyFilterOptions(
  eeArray: EnergyEfficiencyClass[]
): string {
  let resultTemplate = `
  <option value="ALL" class="multiple-select-option">
    Wszystkie
  </option>`;

  eeArray.map((eeClass) => {
    resultTemplate += `
      <option value="${eeClass}" class="multiple-select-option">
        <span id="ee-${eeClass}" style="visibility: hidden" class="checkmark">
          <div class="checkmark_stem"></div>
          <div class="checkmark_kick"></div>
        </span>
        ${eeClass}
      </option>`;
  });
  return resultTemplate;
}
