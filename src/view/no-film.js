import AbstractView from "../view/abstract.js";

const createNoTaskTemplate = () => {
  return `<section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`;
};

export default class NoFilm extends AbstractView {
  _getTemplate() {
    return createNoTaskTemplate();
  }
}
