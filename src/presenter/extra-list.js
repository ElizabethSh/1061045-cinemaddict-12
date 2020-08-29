import ExtraListView from "../view/extra-list.js";
import {render, RenderPosition} from "../utils/render.js";
import FilmCardPresenter from "../presenter/film-card.js";

const MAX_EXTRA_FILMS_CARD = 2;

export default class ExtraList {
  constructor(container, header) {
    this._filmContainer = container;
    this._header = header;
    this._extraListComponent = new ExtraListView(this._header);
    this._extraListContainer = this._extraListComponent.getElement().querySelector(`.films-list__container`);
  }

  init(films) {
    this._films = films.slice();
    this._renderExtraList();
  }

  _renderExtraList() {
    render(this._filmContainer, this._extraListComponent, RenderPosition.BEFOREEND);
    this._renderFilmCards(0, Math.min(this._films.length, MAX_EXTRA_FILMS_CARD));
  }

  _renderFilmCards(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(film));
  }

  _renderFilmCard(film) {
    const filmCardPresenter = new FilmCardPresenter(this._extraListContainer);
    filmCardPresenter.init(film);
  }
}
