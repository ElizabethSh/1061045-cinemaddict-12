import AllFilmSectionView from "../view/all-film-section.js";
import AllFilmListView from "../view/all-film-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmCardPresenter from "../presenter/film-card.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const MAX_FILMS_PER_STEP = 5;

export default class MovieList {
  constructor(container) {
    this._filmContainer = container;
    this._renderedFilmAmount = MAX_FILMS_PER_STEP;
    this._topRatedListContainer = null;
    this._mostCommentedListContainer = null;

    this._allFilmSectionComponent = new AllFilmSectionView();
    this._allFilmListComponent = new AllFilmListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._filmCardComponent = new FilmCardPresenter(this._allFilmListComponent);

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  // Метод для инициализации (начала работы) модуля
  init(films) {
    this._films = films.slice();

    this._renderFilmContent();
  }

  // метод для рендеринга компонентов карточки с фильмом
  _renderFilmCard(film) {
    this._filmCardComponent.init(film);
  }

  // метод для рендеринга N-карточек за раз
  _renderFilmCards(from, to) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(film));
  }

  // метод для рендеринга заглушки, вставит один раздел вместо трех
  _renderNoFilms() {
    render(this._filmContainer, this._noTaskComponent, RenderPosition.BEFOREEND);
  }

  // функция обработчик для кнопки Show More
  _handleShowMoreButtonClick() {
    this._renderFilmCards(this._renderedFilmAmount, this._renderedFilmAmount + MAX_FILMS_PER_STEP);
    this._renderedFilmAmount += MAX_FILMS_PER_STEP;

    // если показаны все имеющиеся карточки, удаляет кнопку
    if (this._films.length <= this._renderedFilmAmount) {
      remove(this._showMoreButtonComponent);
    }
  }

  // метод по рендерингу кнопки допоказа карточек фильмов
  _renderShowMoreButton() {
    // отображает кнопку
    render(this._allFilmSectionComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    // навешиваем обработчик для допоказа карточек
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  // метод для инициализации (начала работы) модуля
  _renderFilmContent() {
    render(this._filmContainer, this._allFilmSectionComponent, RenderPosition.BEFOREEND);
    this._renderAllFilmList();
  }

  // метод для рендеринга раздела со всеми фильмами
  _renderAllFilmList() {
    render(this._allFilmSectionComponent, this._allFilmListComponent, RenderPosition.BEFOREEND);

    this._renderFilmCards(0, Math.min(this._films.length, MAX_FILMS_PER_STEP), this._allFilmListComponent);

    if (this._films.length > MAX_FILMS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }
}
