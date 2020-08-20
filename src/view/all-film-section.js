import AbstractView from "./abstract.js";

const createAllFilmSectionTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`
  );
};

export default class AllFilmSection extends AbstractView {
  _getTemplate() {
    return createAllFilmSectionTemplate();
  }
}
