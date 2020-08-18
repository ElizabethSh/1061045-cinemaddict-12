import AbstractView from "./abstract.js";

const createAllFilmListTemplate = () => {
  return `<div class="films-list__container"></div>`;
};

export default class AllFilmList extends AbstractView {
  _getTemplate() {
    return createAllFilmListTemplate();
  }
}
