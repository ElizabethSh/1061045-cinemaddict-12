import SortView from "../view/sort.js";
import ContentView from "../view/content.js";
import NoFilmView from "../view/no-film.js";
import AllFilmSectionView from "../view/all-film-section.js";
import AllFilmListView from "../view/all-film-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilterPresenter from "../presenter/filter.js";
import FilmCardPresenter from "../presenter/film-card.js";
import ExtraListPresenter from "../presenter/extra-list.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {SortType, UserAction, UpdateType} from "../const.js";
import {sortByDate, sortByRating} from "../utils/film.js";
import {filter} from "../utils/filter.js";

const MAX_FILMS_PER_STEP = 5;
const TOP_RATED_TITLE = `Top Rated`;
const MOST_COMMENT_TITLE = `Most commented`;

export default class MovieList {
  constructor(container, filmsModel, commentsModel, filterModel) {
    this._filmContainer = container;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._renderedFilmAmount = MAX_FILMS_PER_STEP;
    this._topRatedListComponent = null;
    this._mostCommentedListComponent = null;
    this._mainNavigationComponent = null;
    this._curentSortType = SortType.DEFAULT;
    this._filmPresenter = {}; // observer

    this._sortComponent = null;
    this._contentComponent = new ContentView();
    this._allFilmSectionComponent = new AllFilmSectionView();
    this._allFilmListComponent = new AllFilmListView();
    this._noFilmComponent = new NoFilmView();
    this._showMoreButtonComponent = null;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._filterPresenter = new FilterPresenter(this._filmContainer, this._filterModel, this._filmsModel);
    this._topRatedListComponent = new ExtraListPresenter(this._contentComponent, TOP_RATED_TITLE, this._commentsModel);
    this._mostCommentedListComponent = new ExtraListPresenter(this._contentComponent, MOST_COMMENT_TITLE, this._commentsModel);

    this._renderMovieList();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._curentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);

      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }
    return filteredFilms;
  }

  // Здесь будем вызывать обновление модели.
  // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
  // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
  // update - обновленные данные
  _handleViewAction(actionType, updateType, update, film) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;

      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update, film);
        break;

      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update, film);
        break;
    }
  }

  // В зависимости от типа изменений решаем, что делать:
  // - обновить список (например, когда у фильма поменялся признак)
  // - обновить весь верхний раздел (например, при переключении фильтра)
  _handleModelEvent(updateType, data) {
    switch (updateType) {

      case UpdateType.PATCH:
        // обновляет карточку
        this._filmPresenter[data.id].init(data);
        break;

      case UpdateType.MINOR:
        // - обновить список
        this._clearMovieList();
        this._renderAllFilmsList();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску
        this._clearMovieList({resetRenderedFilmCount: true, resetSortType: true});
        this._renderAllFilmsList();
        break;
    }
  }

  // метод для рендеринга содержимого <main>
  _renderMovieList() {
    this._filterPresenter.init();
    this._renderSort();

    // рендер <section class="films" (секция после сортировки)
    // со всеми разделами фильмов
    render(this._filmContainer, this._contentComponent, RenderPosition.BEFOREEND);
    this._renderAllFilmsList();
    this._renderTopRatedList();
    this._renderMostCommentedList();
  }

  // метод для рендеринга панели сортиовки
  _renderSort() {
    this._sortComponent = new SortView();

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендера верхнего раздела с фильмами
  _renderAllFilmsList() {
    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      // если фильмов нет, рендерим заглушку
      this._renderNoFilms();
      return;
    }
    // иначе отобрази контент с фильмами <section class="films-list">
    render(this._contentComponent, this._allFilmSectionComponent, RenderPosition.AFTERBEGIN);

    // рендер раздела div class="films-list__container"
    render(this._allFilmSectionComponent, this._allFilmListComponent, RenderPosition.BEFOREEND);

    // рендер карточек фильмов
    this._renderFilmCards(films.slice(0, Math.min(filmCount, this._renderedFilmAmount)));


    if (filmCount > MAX_FILMS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  // метод для рендеринга заглушки, вставит один раздел вместо трех
  _renderNoFilms() {
    render(this._contentComponent, this._noFilmComponent, RenderPosition.AFTERBEGIN);
  }

  // метод для рендеринга N-карточек за раз
  _renderFilmCards(films) {
    films.forEach((film) => this._renderFilmCard(film));
  }

  // метод для рендеринга компонентов карточки с фильмом
  _renderFilmCard(film) {
    const filmCardPresenter = new FilmCardPresenter(this._allFilmListComponent, this._handleViewAction, this._handleModeChange, this._commentsModel);
    filmCardPresenter.init(film);

    // сохраняет в observer все фильмы с ключами = id
    this._filmPresenter[film.id] = filmCardPresenter;
  }

  // метод по рендерингу кнопки допоказа карточек фильмов
  _renderShowMoreButton() {
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._allFilmSectionComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  // рендерит Top Rated раздел
  _renderTopRatedList() {
    const topRatedFilms = this._getFilms().slice();
    topRatedFilms.sort(sortByRating);

    this._topRatedListComponent.init(topRatedFilms);
  }

  // рендерит Most Commented раздел
  _renderMostCommentedList() {
    const films = this._getFilms();
    this._mostCommentedListComponent.init(films);
  }

  _handleModeChange() {
    Object.values(this._filmPresenter)
          .forEach((presenter) => presenter.resetView());
  }

  // функция обработчик для кнопки Show More
  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmAmount + MAX_FILMS_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmAmount, newRenderedFilmCount);

    this._renderFilmCards(films);
    this._renderedFilmAmount = newRenderedFilmCount;

    // если показаны все имеющиеся карточки, удаляет кнопку
    if (filmCount <= this._renderedFilmAmount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleSortTypeChange(sortType) {
    // если выбранная сортировка совпадает с текущей, ничего не делай
    if (this._curentSortType === sortType) {
      return;
    }
    this._curentSortType = sortType;
    this._sortComponent.setActiveButton(this._curentSortType);

    // - Очищаем список
    this._clearMovieList({resetRenderedFilmCount: true});

    // - Рендерим список заново
    this._renderAllFilmsList();
  }

  _clearMovieList({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    // получаем кол-во задач, доступных на момент очистки movieList
    const filmCount = this._getFilms().length;

    // вызываем у каждого filmPresenter метод destroy
    Object.values(this._filmPresenter)
          .forEach((presenter) => presenter.destroyFilmCard());

    this._filmPresenter = {};

    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);

    // условие, сброшено ли кол-во показанных фильмов
    if (resetRenderedFilmCount) {
      // если да, делаем его снова равным константе
      this._renderedFilmAmount = MAX_FILMS_PER_STEP;
    } else {
      // если нет, нужно оставить то кол-во фильмов, кот. было
      // показано, за исключением случаев переноса фильмов
      // при сбросе признака-фильтра, поэтому число показанных фильмов
      // нужно уменьшать на кол-во перенесенных фильмов
      this._renderedFilmAmount = Math.min(filmCount, this._renderedFilmAmount);
    }

    if (resetSortType) {
      this._curentSortType = SortType.DEFAULT;
      this._sortComponent.setActiveButton(this._curentSortType);
    }
  }


}
