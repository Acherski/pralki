import { sortOptionsPipe } from "../../pipes/sort-options-pipe.js";
export function createSortOptions(sortingOptionsArray) {
    let resultTemplate = ``;
    sortingOptionsArray.map((opt) => {
        resultTemplate += `
    <option value="${opt}" class="multiple-select-option">
      ${sortOptionsPipe(opt)}
    </option>`;
    });
    return resultTemplate;
}
