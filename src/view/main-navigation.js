import {createElement} from "../utils.js";

const MAX_FILMS_AMOUNT = 5;

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  return `<a href="#${name}" class="main-navigation__item">${name}
      ${count < MAX_FILMS_AMOUNT ? `<span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`;
};

const createMainNavigationTemplate = (filters) => {
  const filterTemplate = filters.map((filter) => createFilterItemTemplate(filter)).join(``);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
        ${filterTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNavigation {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  _getTemplate() {
    return createMainNavigationTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
