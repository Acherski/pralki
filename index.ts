import { Filters } from "./model/filters.models";
import {
  WashingMachine,
  WashingMachineWithUuid,
} from "./model/washing-machine.model";
import { SortOption } from "./model/sort-options.enum.js";
import { WashingMachineFunction } from "./model/washing-machine-functions.enum.js";
import { EnergyEfficiencyClass } from "./model/energy-efficiency-class.enum.js";

import { createEnergyEfficiencyFilterOptions } from "./helpers/template-helpers/create-ee-filter-options.js";
import { createFunctionsFilterOptions } from "./helpers/template-helpers/create-function-filter-options.js";
import { createCapacityFilterOptions } from "./helpers/template-helpers/create-capacity-filter-options.js";
import { createSortOptions } from "./helpers/template-helpers/create-sorting-options.js";
import { createWashingMachineTile } from "./helpers/template-helpers/create-tile.js";
import { otherThanAllOptionSelected } from "./helpers/select-option-click-helper.js";
import { onClickOutside } from "./helpers/click-outside.js";
import { uuidv4 } from "./helpers/uuid.js";
import {
  hideHTMLElement,
  showHTMLElement,
} from "./helpers/hide-show-element.js";

import { sortOptionsPipe } from "./pipes/sort-options-pipe.js";
import { ignoreTMTagPipe } from "./pipes/ignore-tm-tag.js";

// HTML elements declarations
const tilesContainerElement = document.getElementById("tiles");
const showashingMachineoreBtnElement = document.getElementById("showMoreBtn");
const searchInput = document.getElementById("searchbox") as HTMLInputElement;
const washingMachineAmountLabelElement =
  document.getElementById("resultCounter");

// Other declarations
let amountOfVisibleItems = 6;
let sortOptionsVisible = false;
let functionFiltersVisible = false;
let energyEfficiencyFiltersVisible = false;
let capacityFiltersVisible = false;
let currentSortOption = SortOption.POPULARITY;
const capacityOptionsList: number[] = [];
const originalData: WashingMachineWithUuid[] = [];
const filteredWashingMachineList: WashingMachineWithUuid[] = [];
const selectedMachinesList: WashingMachineWithUuid[] = [];
const visibleTilesList: WashingMachineWithUuid[] = [];
const currentFilters: Filters = {
  search: "",
  functions: [],
  energyEfficiency: [],
  capacity: [],
};

// Fetches data from json on app init
loadData()
  .then(() => _displayData(amountOfVisibleItems))
  .then(() => {
    searchInput.value = "";
    _sort();
  });

// Fetches data from json
async function loadData(): Promise<void> {
  await fetch("db.json")
    .then((data) => data.json())
    .then((data: WashingMachine[]) => {
      data.map((machine) => {
        const machineWithUuid = { ...machine, uuid: uuidv4() };
        originalData.push(machineWithUuid);
        filteredWashingMachineList.push(machineWithUuid);

        // Creates capacity options data array on load
        // other select options are hardcoded in enums
        if (!capacityOptionsList.includes(machine.capacity)) {
          capacityOptionsList.push(machine.capacity);
        }
      });
    });
  _createSortAndFiltersOptions();
}

// Show more items event
showashingMachineoreBtnElement?.addEventListener("click", () => {
  amountOfVisibleItems += 6;
  _displayData(amountOfVisibleItems);
  if (filteredWashingMachineList.length < amountOfVisibleItems) {
    hideHTMLElement(showashingMachineoreBtnElement);
  } else {
    showHTMLElement(showashingMachineoreBtnElement);
  }
});

// Add/remove the washing machine from selectedMachinesList list (cart)
tilesContainerElement?.addEventListener("click", function (evt) {
  const { currentTarget } = evt;
  if (currentTarget instanceof HTMLElement) {
    const clickedUuid = (evt.target as HTMLElement).id;

    // Return if clicked element is NOT a button (button emits unique uuid)
    if (!clickedUuid || clickedUuid === "tiles") return;

    const isSelected = selectedMachinesList.some(
      (washMashine) => washMashine.uuid === clickedUuid
    );
    const selectedMachine = filteredWashingMachineList.find(
      (machine) => machine.uuid === clickedUuid
    );

    const btn = document.getElementById(clickedUuid);
    if (isSelected) {
      const selectedIndex = selectedMachinesList.findIndex(
        (washMachine) => washMachine.uuid == clickedUuid
      );
      selectedMachinesList.splice(selectedIndex, 1);
      if (btn) {
        btn.classList.add("btn-primary");
        btn.classList.remove("btn-primary--activated");
        btn.innerText = "WYBIERZ";
      }
    } else {
      if (btn) {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-primary--activated");
        btn.innerText = "WYBRANE";
      }
      selectedMachinesList.push(selectedMachine!);
    }
  }
});

// Search washing machine (filter by name/model)
searchInput.addEventListener("keyup", _searchValue);
function _searchValue(e: Event) {
  currentFilters.search = (e.target as HTMLInputElement).value.toLowerCase();
  _updateView();
}

// Hide/Show options lists of filter/sort inputs
const capacityFilterElement = document.getElementById("capacityFilter");
const capacityFilterTitleElement = document.getElementById(
  "capacityFilterTitle"
);
const capacityFilterOptionsElement = document.getElementById(
  "capacityFilterOptions"
);
const energyEfficiencyFilterElement = document.getElementById(
  "energyEfficiencyFilter"
);
const energyEfficiencyFilterOptionsElement = document.getElementById(
  "energyEfficiencyFilterOptions"
);
const functionFilterElement = document.getElementById("selectFunctionsFilter");
const sortOptionsElement = document.getElementById("sortOptions");
const sortOptionsContainerElement = document.getElementById(
  "sortOptionsContainer"
);

sortOptionsElement?.addEventListener("click", () => {
  if (!sortOptionsContainerElement) return;
  sortOptionsVisible = !sortOptionsVisible;
  sortOptionsVisible
    ? showHTMLElement(sortOptionsContainerElement)
    : hideHTMLElement(sortOptionsContainerElement);
});
functionFilterElement?.addEventListener("click", () => {
  if (!functionFilterOptionsElement) return;
  functionFiltersVisible = !functionFiltersVisible;
  functionFiltersVisible
    ? showHTMLElement(functionFilterOptionsElement)
    : hideHTMLElement(functionFilterOptionsElement);
});
energyEfficiencyFilterElement?.addEventListener("click", () => {
  if (!energyEfficiencyFilterOptionsElement) return;
  energyEfficiencyFiltersVisible = !energyEfficiencyFiltersVisible;
  energyEfficiencyFiltersVisible
    ? showHTMLElement(energyEfficiencyFilterOptionsElement)
    : hideHTMLElement(energyEfficiencyFilterOptionsElement);
});
capacityFilterElement?.addEventListener("click", () => {
  if (!capacityFilterOptionsElement) return;
  capacityFiltersVisible = !capacityFiltersVisible;
  capacityFiltersVisible
    ? showHTMLElement(capacityFilterOptionsElement)
    : hideHTMLElement(capacityFilterOptionsElement);
});


// Sorting
const sortOptionsTitleElement = document.getElementById("sortOptionsTitle");
sortOptionsContainerElement?.addEventListener("click", (val) => {
  const sortValue = (val.target as HTMLOptionElement).value;
  const sortKeys = Object.keys(SortOption) as Array<keyof typeof SortOption>;
  currentSortOption = sortValue as SortOption;

  if (sortOptionsTitleElement)
    sortOptionsTitleElement.innerText = sortOptionsPipe(currentSortOption);

  _sort();
});

// Filter - Washing machine functions value change
const functionFilterTitleElement = document.getElementById(
  "selectFunctionsTitle"
);
const functionFilterOptionsElement = document.getElementById(
  "selectFunctionsOptions"
);
functionFilterOptionsElement?.addEventListener("click", (val) => {
  const filterFunctionsValue = (val.target as HTMLOptionElement).value;
  const functionKeys = Object.keys(WashingMachineFunction) as Array<
    keyof typeof WashingMachineFunction
  >;
  const filterIdx = currentFilters.functions.indexOf(
    filterFunctionsValue as WashingMachineFunction
  );
  const optionElement = document.getElementById(filterFunctionsValue);

  if (filterFunctionsValue === "ALL") {
    currentFilters.functions.splice(0, currentFilters.functions.length);
    functionKeys.map((key) => hideHTMLElement(document.getElementById(key)!));
    functionFilterTitleElement!.innerText = "Wszystkie";
  } else {
    otherThanAllOptionSelected(
      currentFilters.functions,
      filterFunctionsValue,
      filterIdx,
      optionElement!,
      functionFilterTitleElement!,
      true
    );
  }

  _updateView();
});

// Filter - Energy efficiency class filter value change
energyEfficiencyFilterElement?.addEventListener("click", (val) => {
  const energyEfficiencyFilterValue = (val.target as HTMLOptionElement).value;
  const energyEfficiencyFilterTitleElement = document.getElementById(
    "energyEfficiencyFilterTitle"
  );
  const energyEffifiencyKeys = Object.keys(EnergyEfficiencyClass) as Array<
    keyof typeof EnergyEfficiencyClass
  >;
  const energyEfficiencyOptionElement = document.getElementById(
    `ee-${energyEfficiencyFilterValue}`
  );
  const energyEfficiencyFilterIdx = currentFilters.energyEfficiency.indexOf(
    energyEfficiencyFilterValue as EnergyEfficiencyClass
  );

  if (!energyEfficiencyFilterValue) return;

  if (energyEfficiencyFilterValue === "ALL") {
    currentFilters.energyEfficiency.splice(
      0,
      currentFilters.energyEfficiency.length
    );
    energyEffifiencyKeys.map((key) =>
      hideHTMLElement(document.getElementById(`ee-${key}`)!)
    );
    energyEfficiencyFilterTitleElement!.innerText = "Wszystkie";
  } else {
    otherThanAllOptionSelected(
      currentFilters.energyEfficiency,
      energyEfficiencyFilterValue,
      energyEfficiencyFilterIdx,
      energyEfficiencyOptionElement!,
      energyEfficiencyFilterTitleElement!
    );
  }
  _updateView();
});

// Filter - Capacity filter value change
capacityFilterElement?.addEventListener("click", (val) => {
  const capacityFilterValue = (val.target as HTMLOptionElement).value;
  const capacityOptionElement = document.getElementById(
    `capacity-${+capacityFilterValue * 100}`
  );
  const capacityIdx = currentFilters.capacity.indexOf(+capacityFilterValue);

  if (!capacityFilterValue) return;

  if (capacityFilterValue === "ALL") {
    currentFilters.capacity.splice(0, currentFilters.capacity.length);
    capacityOptionsList.map((key) =>
      hideHTMLElement(document.getElementById(`capacity-${key * 100}`)!)
    );
    capacityFilterTitleElement!.innerText = "Wszystkie";
  } else {
    otherThanAllOptionSelected(
      currentFilters.capacity,
      +capacityFilterValue,
      capacityIdx,
      capacityOptionElement!,
      capacityFilterTitleElement!
    );
  }
  _updateView();
});

// Main filtering function - combines all filters and
// invokes view update
function _updateView() {
  // Filter by name and model (searchbox)
  const filter1 = originalData.filter(
    (machine) =>
      ignoreTMTagPipe(machine.name)
        .toLowerCase()
        .includes(currentFilters.search) ||
      machine.model.toLowerCase().includes(currentFilters.search)
  );

  // Filter by washing machine functions
  const filter2: WashingMachineWithUuid[] = [];
  filter1.map((washingMachine) => {
    if (
      currentFilters.functions.every((val) =>
        washingMachine.functions.includes(val as WashingMachineFunction)
      )
    ) {
      filter2.push(washingMachine);
    }
  });

  // Filter by energy efficiency class
  const filter3: WashingMachineWithUuid[] = [];
  filter2.map((washingMachine) => {
    if (
      currentFilters.energyEfficiency.some((val) =>
        washingMachine.energyEfficiency.includes(val)
      )
    ) {
      filter3.push(washingMachine);
    }
  });

  if (!currentFilters.energyEfficiency.length) {
    filter2.map((item) => filter3.push(item));
  }

  // Filter by capacity
  const filter4: WashingMachineWithUuid[] = [];
  filter3.map((washingMachine) => {
    if (
      currentFilters.capacity.some((val) => val === washingMachine.capacity)
    ) {
      filter4.push(washingMachine);
    }
  });

  if (!currentFilters.capacity.length) {
    filter3.map((item) => filter4.push(item));
  }

  // Remove duplicates (if there are any)
  const result = [...new Map(filter4.map((v) => [v.uuid, v])).values()];

  tilesContainerElement!.innerHTML = "";
  filteredWashingMachineList.length = 0;
  visibleTilesList.length = 0;
  amountOfVisibleItems = 6;

  result.map((item) => filteredWashingMachineList.push(item));

  filteredWashingMachineList
    .slice(0, amountOfVisibleItems)
    .map((item) => visibleTilesList.push(item));
  visibleTilesList.map((vm) => {
    const tile = document.createElement("div");
    const isSelected = selectedMachinesList.some(
      (selectedMachine) => vm.uuid === selectedMachine.uuid
    );
    tile.innerHTML = createWashingMachineTile(vm, isSelected);
    tilesContainerElement?.appendChild(tile);
  });

  if (filteredWashingMachineList.length <= amountOfVisibleItems) {
    hideHTMLElement(showashingMachineoreBtnElement!);
  } else {
    showHTMLElement(showashingMachineoreBtnElement!);
  }
  _countAndDisplayItemsAmount();
  _sort();
}

// Hide filters' dropdowns on outside click
onClickOutside(sortOptionsElement, () => {
  if (sortOptionsContainerElement) hideHTMLElement(sortOptionsContainerElement);
});
onClickOutside(functionFilterElement, () => {
  if (functionFilterOptionsElement)
    hideHTMLElement(functionFilterOptionsElement);
});
onClickOutside(energyEfficiencyFilterElement, () => {
  if (energyEfficiencyFilterOptionsElement)
    hideHTMLElement(energyEfficiencyFilterOptionsElement);
});
onClickOutside(capacityFilterElement, () => {
  if (capacityFilterOptionsElement)
    hideHTMLElement(capacityFilterOptionsElement);
});

function _createSortAndFiltersOptions() {
  // Creates sort options
  const sortOptionsContainerElement = document.getElementById(
    "sortOptionsContainer"
  );
  const sortOptionList = Object.keys(SortOption) as Array<SortOption>;
  sortOptionsContainerElement!.innerHTML += createSortOptions(sortOptionList);

  // Creates functions filter options
  const functionFilterOptionsElement = document.getElementById(
    "selectFunctionsOptions"
  );
  const functionOptionList = Object.keys(
    WashingMachineFunction
  ) as Array<WashingMachineFunction>;
  functionFilterOptionsElement!.innerHTML +=
    createFunctionsFilterOptions(functionOptionList);

  // Creates energy efficiency class filter options
  const energyEfficiencyFilterOptionsElement = document.getElementById(
    "energyEfficiencyFilterOptions"
  );
  const energyEfficiencyOptionList = Object.keys(
    EnergyEfficiencyClass
  ) as Array<EnergyEfficiencyClass>;
  energyEfficiencyFilterOptionsElement!.innerHTML +=
    createEnergyEfficiencyFilterOptions(energyEfficiencyOptionList);

  // Creates capacity filter options
  capacityOptionsList.sort((a, b) => b - a);
  const capacityFilterOptionsElement = document.getElementById(
    "capacityFilterOptions"
  );
  capacityFilterOptionsElement!.innerHTML +=
    createCapacityFilterOptions(capacityOptionsList);
}

function _countAndDisplayItemsAmount() {
  if (washingMachineAmountLabelElement)
    washingMachineAmountLabelElement.innerText = `Liczba wyników: ${filteredWashingMachineList.length}`;
}

function _displayData(amountOfVisibleItems: number): void {
  _countAndDisplayItemsAmount();

  for (let i = visibleTilesList.length; i < amountOfVisibleItems; i++) {
    for (let vm of filteredWashingMachineList) {
      let isDuplicate = visibleTilesList.some(
        (visibleMachine) => visibleMachine.uuid === vm.uuid
      );

      if (!isDuplicate) {
        visibleTilesList.push(vm);
        const tile = document.createElement("div");
        const isSelected = selectedMachinesList.some(
          (selectedMachine) => vm.uuid === selectedMachine.uuid
        );
        tile.innerHTML = createWashingMachineTile(vm, isSelected);
        tilesContainerElement?.appendChild(tile);
        break;
      }
    }
  }
}

function _sort() {
  // Sort by price (lowest to highest)
  if (currentSortOption === SortOption.PRICE) {
    filteredWashingMachineList.sort((a, b) => a.price.value - b.price.value);
    _sortHelper();
  }

  // Sort by capacity (highest to lowest)
  if (currentSortOption === SortOption.CAPACITY) {
    filteredWashingMachineList.sort((a, b) => b.capacity - a.capacity);
    _sortHelper();
  }

  // Sort by pupularity (most popular first)
  if (currentSortOption === SortOption.POPULARITY) {
    filteredWashingMachineList.sort((a, b) => b.soldAmount - a.soldAmount);
    _sortHelper();
  }
}

function _sortHelper() {
  visibleTilesList.length = 0;
  tilesContainerElement!.innerHTML = "";
  visibleTilesList.map((vm) => {
    const tile = document.createElement("div");
    const isSelected = selectedMachinesList.some(
      (selectedMachine) => vm.uuid === selectedMachine.uuid
    );
    tile.innerHTML = createWashingMachineTile(vm, isSelected);
    tilesContainerElement?.appendChild(tile);
  });
  _displayData(amountOfVisibleItems);
}
