import AbstractView from "./abstract.js";
import {FilterType, MenuItem} from "../const.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return `<a href="#${name}"
    class="main-navigation__item ${type === currentFilterType ? `main-navigation__item--active` : ``}"
    data-filter-type = "${type}">${name}
      ${type === FilterType.ALL ? `` : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`;
};

const createMainNavigationTemplate = (filters, currentFilterType) => {
  const filterTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join(``);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNavigation extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeClickHandler = this._filterTypeClickHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
    this._buttonClickHandler = this._buttonClickHandler.bind(this);

    this.getElement()
        .addEventListener(`click`, this._buttonClickHandler);
  }

  _getTemplate() {
    return createMainNavigationTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeClickHandler(callback) {
    this._callback.filterTypeClick = callback;
    this.getElement()
        .querySelector(`.main-navigation__items`)
        .addEventListener(`click`, this._filterTypeClickHandler);
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this.getElement()
        .querySelector(`.main-navigation__additional`)
        .addEventListener(`click`, this._statsClickHandler);
  }

  _buttonClickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    const buttons = this.getElement()
                        .querySelectorAll(`a`);

    buttons.forEach((it) => it.classList.remove(`main-navigation__item--active`));
    evt.target.classList.add(`main-navigation__item--active`);
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick(MenuItem.STATISTICS);
  }

  _filterTypeClickHandler(evt) {
    if (evt.target.tagName !== `A` && evt.target.tagName !== `SPAN`) {
      return;
    }
    const target = (evt.target.tagName === `SPAN`) ?
      evt.target.parentNode :
      evt.target;

    evt.preventDefault();
    const filterTypes = Object.values(FilterType);
    const filterType = target.dataset.filterType;
    const isFilter = filterTypes.includes(filterType);
    const menuCategory = isFilter ? MenuItem.FILTERS : filterType;

    this._callback.filterTypeClick(menuCategory, filterType);
  }
}
