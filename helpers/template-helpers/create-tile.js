import { colorPipe } from "../../pipes/color-pipe.js";
import { formatDatePipe } from "../../pipes/date-pipe.js";
import { washingMachineFunctionDisplayName } from "../../pipes/washing-machine-function-pipe.js";
// Creates a tile with single washing machine data
export function createWashingMachineTile(value, isSelected) {
    return `
      <div class="tile-container">
      <div class="tile">
        <div class="tile__data-and-image">
          <div class="tile__image-container">
            <img src="${value.img}" class="tile__image" alt="Washing machine 
            ${value.model} image" />
          </div>

          <div class="tile__data">
            <div class="tile__data--main">
              <div class="tile__name-description-container">
                <span class="tile__name"
                  >${value.model}, ${value.name}, ${value.capacity} kg,
                  ${colorPipe(value.color)}
                </span>
              </div>

              <span class="tile__description--light">
                Pojemność (kg):
                <span class="tile__description--heavy">
                ${value.capacity}
                </span>
              </span>
              <span class="tile__description--light">
                Wymiary (GxSxW):
                <span class="tile__description--heavy">
                ${value.dimensions.width} x ${value.dimensions.depth} x
                  ${value.dimensions.height} cm
                  </span>
              </span>

              <span class="tile__description--light" style="min-height: 36px;">
                Funkcje:
                <span class="tile__description--heavy">
                  ${washingMachineFunctionDisplayName(value.functions)}
                </span>
              </span>
            </div>

            <div class="tile__energy">
              <span class="tile__description--light">Klasa energetyczna</span>
              <div class="tile__energy-class-container">
                <div class="tile__energy-class">
                  <span class="tile__energy-class-letter">
                  ${value.energyEfficiency}
                  </span>
                </div>
                <div class="title__energy-triangle"></div>
              </div>
            </div>

            <div>
              <span class="tile__description--light">
              Cena obowiązuje: ${formatDatePipe(value.price.date_from)} -
                ${formatDatePipe(value.price.date_to)}
              </span>

              <div class="tile__price-container">
                <span class="tile__price">
                  ${(Math.round(value.price.value * 100) / 100)
        .toFixed(2)
        .toString()
        .slice(0, -3)}
                </span>
                <span class="tile__price-rest">
                  ${(Math.round(value.price.value * 100) / 100)
        .toFixed(2)
        .toString()
        .slice(-2)} zł
                </span>
              </div>
            </div>
            <span class="tile__instalment" style="visibility: ${value.instalment.availability ? "visible" : "hidden"}">
            ${value.instalment.value} zł x ${value.instalment.amount}
              rat
            </span>
          </div>
        </div>
                    
        <div class="btn-container">
          <button id="${value.uuid}" class="${isSelected ? "btn-primary--activated" : "btn-primary"}">
            ${isSelected ? "WYBRANO" : "WYBIERZ"}
          </button>
        </div>
      </div>
    </div>
  `;
}
