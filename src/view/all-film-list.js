import {createElement} from "../utils.js";

const createAllFilmListTemplate = () => {
  return `<div class="films-list__container"></div>`;
};

export default class AllFilmList {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createAllFilmListTemplate();
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
