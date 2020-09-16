import AbstractView from "./abstract.js";

const createFooterStatisticTemplate = (films) => {
  const filmsCount = films.length;
  return (
    `<p>${filmsCount} movies inside</p>`
  );
};

export default class FooterStatistic extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  _getTemplate() {
    return createFooterStatisticTemplate(this._films);
  }
}
