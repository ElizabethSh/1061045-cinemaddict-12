import {createElement} from "../utils.js";

const createContentTemplate = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class Content {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return createContentTemplate();
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
