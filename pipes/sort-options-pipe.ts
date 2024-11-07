import { SortOption } from "../model/sort-options.enum.js";

export function sortOptionsPipe(opt: SortOption) {
  switch (opt) {
    case SortOption.POPULARITY:
      return "Popularność";
    case SortOption.PRICE:
      return "Cena";
    case SortOption.CAPACITY:
      return "Pojemność";
  }
}
