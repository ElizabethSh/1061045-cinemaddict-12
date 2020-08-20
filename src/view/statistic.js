import AbstractView from "./abstract.js";

const createMovieStatisticTemplate = (films) => {
  const filmsCount = films.length;
  return (
    `<p>${filmsCount} movies inside</p>`
  );
};

export default class Statistic extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  _getTemplate() {
    return createMovieStatisticTemplate(this._films);
  }
}
