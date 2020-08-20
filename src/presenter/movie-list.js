import ContentView from "../view/content.js";
import AllFilmSectionView from "../view/all-film-section.js";
import TopRatedListView from "../view/top-rated-list.js";
import MostCommentedListView from "../view/most-commented-list.js";
import AllFilmListView from "../view/all-film-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmCardView from "../view/film-card.js";
import NoTaskView from "../view/no-film.js";
import PopupPresenter from "../presenter/popup.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const MAX_FILMS_PER_STEP = 5;
const MAX_EXTRA_FILMS_CARD = 2;

const body = document.querySelector(`body`);

export default class MovieList {
  constructor(container) {
    this._filmContainer = container;
    this._renderedFilmAmount = MAX_FILMS_PER_STEP;
    this._topRatedListContainer = null;
    this._mostCommentedListContainer = null;

    this._contentComponent = new ContentView();
    this._allFilmSectionComponent = new AllFilmSectionView();
    this._topRatedFilmsComponent = new TopRatedListView();
    this._mostCommentedFilmsComponent = new MostCommentedListView();
    this._allFilmListComponent = new AllFilmListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._noTaskComponent = new NoTaskView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  // Метод для инициализации (начала работы) модуля
  init(films) {
    this._topRatedListContainer = this._topRatedFilmsComponent.getElement().querySelector(`.films-list__container`);
    this._mostCommentedListContainer = this._mostCommentedFilmsComponent.getElement().querySelector(`.films-list__container`);
    this._films = films.slice();

    // если фильмов нет, рендерим заглушку
    if (films.length === 0) {
      this._renderNoFilms();
      return;
    }

    // рендерим контент со всеми разделами фильмов
    render(this._filmContainer, this._contentComponent, RenderPosition.BEFOREEND);
    this._renderFilmContent();
  }

  // метод для рендеринга компонентов карточки с фильмом
  _renderFilmCard(film, container) {
    const filmCardComponent = new FilmCardView(film);
    const popup = new PopupPresenter(body);

    // обработчик открытия попапа на постер
    filmCardComponent.setPosterClickHandler(() => {
      popup.init(film);
    });

    // обработчик открытия попапа на title
    filmCardComponent.setTitleClickHandler(() => {
      popup.init(film);
    });

    // обработчик открытия попапа на кол-во комментариев в карточке
    filmCardComponent.setCommentAmountClickHandler(() => {
      popup.init(film);
    });

    render(container, filmCardComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендеринга N-карточек за раз
  _renderFilmCards(from, to, container) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(film, container));
  }

  // метод для рендеринга заглушки, вставит один раздел вместо трех
  _renderNoFilms() {
    render(this._filmContainer, this._noTaskComponent, RenderPosition.BEFOREEND);
  }

  // функция обработчик для кнопки Show More
  _handleShowMoreButtonClick() {
    this._renderFilmCards(this._renderedFilmAmount, this._renderedFilmAmount + MAX_FILMS_PER_STEP, this._allFilmListComponent);
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
    render(this._contentComponent, this._allFilmSectionComponent, RenderPosition.BEFOREEND);
    this._renderAllFilmList();
    this._renderTopRatedList();
    this._renderMostCommentedList();

  }

  // метод для рендеринга раздела со всеми фильмами
  _renderAllFilmList() {
    render(this._allFilmSectionComponent, this._allFilmListComponent, RenderPosition.BEFOREEND);

    this._renderFilmCards(0, Math.min(this._films.length, MAX_FILMS_PER_STEP), this._allFilmListComponent);

    if (this._films.length > MAX_FILMS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  // метод для рендеринга раздела Top Rated
  _renderTopRatedList() {
    render(this._contentComponent, this._topRatedFilmsComponent, RenderPosition.BEFOREEND);
    this._renderFilmCards(0, Math.min(this._films.length, MAX_EXTRA_FILMS_CARD), this._topRatedListContainer);
  }

  // метод для рендеринга раздела Most Commented
  _renderMostCommentedList() {
    render(this._contentComponent, this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
    this._renderFilmCards(0, Math.min(this._films.length, MAX_EXTRA_FILMS_CARD), this._mostCommentedListContainer);
  }

}
