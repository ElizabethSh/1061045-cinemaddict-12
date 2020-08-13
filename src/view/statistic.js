import {createElement} from "../utils.js";

const createMovieStatisticTemplate = (films) => {
  const filmsCount = films.length;
  return (
    `<p>${filmsCount} movies inside</p>`
  );
};

export default class Statistic {
  constructor(films) {
    this._element = null;
    this._films = films;
  }

  _getTemplate() {
    return createMovieStatisticTemplate(this._films);
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
