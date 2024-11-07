export function createCapacityFilterOptions(capacityArray: number[]): string {
  let resultTemplate = `
    <option value="ALL" class="multiple-select-option">
      Wszystkie
    </option>`;

  capacityArray.map((capacityValue) => {
    resultTemplate += `
      <option value="${capacityValue}" class="multiple-select-option">
        <span
          id="capacity-${capacityValue * 100}"
          style="visibility: hidden"
          class="checkmark"
        >
          <div class="checkmark_stem"></div>
          <div class="checkmark_kick"></div>
        </span>
        ${capacityValue}kg
      </option>`;
  });

  return resultTemplate;
}
