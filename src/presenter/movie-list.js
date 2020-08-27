import MainNavigationView from "../view/main-navigation.js";
import SortView from "../view/sort.js";
import ContentView from "../view/content.js";
import NoFilmView from "../view/no-film.js";
import AllFilmSectionView from "../view/all-film-section.js";
import AllFilmListView from "../view/all-film-list.js";
import ExtraListPresenter from "../presenter/extra-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import FilmCardPresenter from "../presenter/film-card.js";
import {generateFilters} from "../mock/filter-mock";
import {render, RenderPosition, remove} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {SortType} from "../const.js";
import {sortByDate, sortByRating} from "../utils/film.js";

const MAX_FILMS_PER_STEP = 5;
const MAX_EXTRA_FILMS_CARD = 2;
const TOP_RATED_TITLE = `Top Rated`;
const MOST_COMMENT_TITLE = `Most commented`;

export default class MovieList {
  constructor(container) {
    this._filmContainer = container;
    this._renderedFilmAmount = MAX_FILMS_PER_STEP;
    this._topRatedListComponent = null;
    this._mostCommentedListComponent = null;
    this._mainNavigationComponent = null;
    this._curentSortType = SortType.DEFAULT;
    this._filmPresenter = {}; // observer

    this._sortComponent = new SortView();
    this._contentComponent = new ContentView();
    this._allFilmSectionComponent = new AllFilmSectionView();
    this._allFilmListComponent = new AllFilmListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmUpdate = this._handleFilmUpdate.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  // Метод для инициализации (начала работы) модуля
  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice(); // бэкап исходного массива
    this._filters = generateFilters(this._films);
    this._mainNavigationComponent = new MainNavigationView(this._filters);
    this._topRatedListComponent = new ExtraListPresenter(this._contentComponent, TOP_RATED_TITLE);
    this._mostCommentedListComponent = new ExtraListPresenter(this._contentComponent, MOST_COMMENT_TITLE);

    this._renderMovieList();
  }

  // метод для перерендеринга карточки обновленного фильма
  _handleFilmUpdate(updatedFilm) {
    // подставляем обновленный элемент в массивы с фильмами
    // на замену предыдущему
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);

    // для обновленного презентера фильма пересоздаем карточку
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  // метод для рендеринга содержимого <main>
  _renderMovieList() {
    this._renderMainNavigation();
    this._renderSort();
    this._renderMovieFilmContent();
  }

  // метод для рендеринга главного меню
  _renderMainNavigation() {
    render(this._filmContainer, this._mainNavigationComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендеринга панели сортиовки
  _renderSort() {
    render(this._filmContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  // метод для рендеринга <section class="films"
  // (секция после сортировки) со всеми разделами фильмов
  _renderMovieFilmContent() {
    render(this._filmContainer, this._contentComponent, RenderPosition.BEFOREEND);
    this._renderFilmtListContent();
    // this._renderTopRatedList();
    // this._renderMostCommentedList();
  }

  // метод для рендеринга section class="films-list"
  _renderFilmtListContent() {
    if (this._films.length === 0) {
      // если фильмов нет, рендерим заглушку
      this._renderNoFilms();
      return;
    }
    // иначе отобрази контент с фильмами
    render(this._contentComponent, this._allFilmSectionComponent, RenderPosition.BEFOREEND);
    this._renderAllFilmContainer();
  }

  // метод для рендеринга заглушки, вставит один раздел вместо трех
  _renderNoFilms() {
    const noFilmComponent = new NoFilmView();
    render(this._contentComponent, noFilmComponent, RenderPosition.BEFOREEND);
  }

  // метод ля рендеринга раздела div class="films-list__container"
  _renderAllFilmContainer() {
    render(this._allFilmSectionComponent, this._allFilmListComponent, RenderPosition.BEFOREEND);
    this._renderAllFilmList();
  }

  // метод для рендеринга раздела со всеми фильмами
  _renderAllFilmList() {
    this._renderFilmCards(0, Math.min(this._films.length, MAX_FILMS_PER_STEP), this._allFilmListComponent);

    if (this._films.length > MAX_FILMS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  // метод для рендеринга N-карточек за раз
  _renderFilmCards(from, to, container) {
    this._films
      .slice(from, to)
      .forEach((film) => this._renderFilmCard(film, container));
  }

  // метод для рендеринга компонентов карточки с фильмом
  _renderFilmCard(film, container) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleFilmUpdate, this._handleModeChange);
    filmCardPresenter.init(film);
    this._filmPresenter[film.id] = filmCardPresenter;
    // console.log(this._filmPresenter);
  }

  // метод по рендерингу кнопки допоказа карточек фильмов
  _renderShowMoreButton() {
    // отображает кнопку
    render(this._allFilmSectionComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    // навешиваем обработчик для допоказа карточек
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  // рендерит Top Rated раздел
  _renderTopRatedList() {
    const topRatedListContainer = this._topRatedListComponent.getContainer();
    // const topRatedFilms = this._films.slice();

    // topRatedFilms.sort(sortByRating);

    this._topRatedListComponent.init(this._films);
    this._renderFilmCards(0, Math.min(this._films.length, MAX_EXTRA_FILMS_CARD), topRatedListContainer);
  }

  // рендерит Most Commented раздел
  _renderMostCommentedList() {
    const mostCommentedListContainer = this._mostCommentedListComponent.getContainer();

    this._mostCommentedListComponent.init(this._films);
    this._renderFilmCards(0, Math.min(this._films.length, MAX_EXTRA_FILMS_CARD), mostCommentedListContainer);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(sortByDate);
        // console.log(this._films);
        break;

      case SortType.RATING:
        this._films.sort(sortByRating);
        // console.log(this._films);
        break;

      default:
        this._films = this._sourcedFilms.slice();
    }

    this._curentSortType = sortType;
  }

  _handleModeChange() {
    Object.values(this._filmPresenter)
          .forEach((presenter) => presenter.resetView());
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

  _handleSortTypeChange(sortType) {
    // если выбранная сортировка совпадает с текущей, ничего не делай
    if (this._curentSortType === sortType) {
      return;
    }
    // - Сортируем задачи
    this._sortFilms(sortType);

    // - Очищаем список
    this._clearFilmList();

    // - Рендерим список заново
    this._renderAllFilmList();

  }

  // метод для удаления всех карточек внутри div class="films-list__container"
  _clearFilmList() {
    // console.log(`2`, this._filmPresenter);
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());

    // нужно очистить _filmPresenter, т.к. destroy удаляет карточки
    // но не очищает этот объект _filmPresenter и при пересортировке
    // просто дозапишет в этот объект эти же фильмы еще раз
    // console.log(`3`, this._filmPresenter);
    this._filmPresenter = {};
    // console.log(`4`, this._filmPresenter);

    this._renderedFilmAmount = MAX_FILMS_PER_STEP;
  }
}
