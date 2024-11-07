import { hideHTMLElement, showHTMLElement } from "./hide-show-element.js";
import { updateFilterPlaceholder } from "./update-filter-placeholder.js";

export function otherThanAllOptionSelected<T>(
  filterArr: T[],
  filterVal: T,
  filterIdx: number,
  optionElement: HTMLElement,
  titleElement: HTMLElement,
  isFunctionFilter = false,
) {
    if (filterArr.includes(filterVal)) {
      filterArr.splice(filterIdx, 1);
      hideHTMLElement(optionElement);
    } else {
      filterArr.push(filterVal);
      showHTMLElement(optionElement, true);
    }
    updateFilterPlaceholder(titleElement, filterArr, isFunctionFilter);

    if (!filterArr.length) {
      titleElement!.innerText = "Wszystkie";
    }
  // }
}
