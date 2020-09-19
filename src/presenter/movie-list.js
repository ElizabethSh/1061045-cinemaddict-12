import SortView from "../view/sort.js";
import ContentView from "../view/content.js";
import NoFilmView from "../view/no-film.js";
import AllFilmSectionView from "../view/all-film-section.js";
import AllFilmListView from "../view/all-film-list.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import LoadingView from "../view/loading.js";
import FilmCardPresenter from "../presenter/film-card.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {SortType, UserAction, UpdateType} from "../const.js";
import {sortByDate, sortByRating} from "../utils/film.js";
import {filter} from "../utils/filter.js";
import {State} from "./film-card.js";

import ProfileView from "../view/profile.js";

const MAX_FILMS_PER_STEP = 5;

const siteHeader = document.querySelector(`.header`);

export default class MovieList {
  constructor(container, filmsModel, commentsModel, filterModel, api) {
    this._filmContainer = container;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._renderedFilmAmount = MAX_FILMS_PER_STEP;

    this._curentSortType = SortType.DEFAULT;
    this._filmPresenter = {}; // observer
    this._isLoading = true;

    this._sortComponent = null;
    this._contentComponent = new ContentView();
    this._allFilmSectionComponent = new AllFilmSectionView();
    this._allFilmListComponent = new AllFilmListView();
    this._noFilmComponent = new NoFilmView();
    this._loadingComponent = new LoadingView();
    this._showMoreButtonComponent = null;
    this._profileComponent = null;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
  }

  init() {
    this._filmsModel.add(this._handleModelEvent);
    this._filterModel.add(this._handleModelEvent);
    this._commentsModel.add(this._handleModelEvent);

    this._render();
  }

  destroy() {
    this._clear({resetRenderedFilmCount: true, resetSortType: true});

    remove(this._sortComponent);
    remove(this._contentComponent);

    this._filmsModel.remove(this._handleModelEvent);
    this._filterModel.remove(this._handleModelEvent);
    this._commentsModel.remove(this._handleModelEvent);
  }

  renderProfile() {
    const prevProfileComponent = this._profileComponent;
    this._profileComponent = new ProfileView(this._filmsModel.get());

    if (prevProfileComponent === null) {
      render(siteHeader, this._profileComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._profileComponent, prevProfileComponent);
    remove(prevProfileComponent);
  }

  _getFilms() {
    const filterType = this._filterModel.get();
    const films = this._filmsModel.get();
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
  _handleViewAction(actionType, updateType, update, film = {}) {
    if (update.isPopupOpen) {
      this._filmsModel.setOpenedPopup(update.id);
    } else if (film.isPopupOpen) {
      this._filmsModel.setOpenedPopup(film.id);
    } else {
      this._filmsModel.setOpenedPopup(null);
    }

    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmPresenter[update.id].setViewState(State.UPDATING);
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        })
        .catch(() => {
          this._filmPresenter[update.id].setButtonsAborting();
        });
        break;

      case UserAction.ADD_COMMENT:
        this._filmPresenter[film.id].setViewState(State.SAVING);
        this._api.addComment(update, film)
          .then((responce) => {
            this._commentsModel.addComment(updateType, responce, film);
            this._api.getFilms()
            .then((films) => {
              this._filmsModel.set(UpdateType.MINOR, films);
            });
          })
          .catch(() => {
            this._filmPresenter[film.id].setAborting();
          });
        break;

      case UserAction.DELETE_COMMENT:
        this._filmPresenter[film.id].setViewState(State.DELETING, update);
        // метод удаления комментария на сервере
        // ничего не возвращает.
        // Ведь что можно вернуть при удалении комментария?
        // Поэтому в модель мы всё также передаем update
        this._api.deleteComment(update, film)
          .then(() => {
            this._api.getFilms()
              .then((films) => {
                this._filmsModel.set(UpdateType.MINOR, films);
              });
            this._commentsModel.deleteComment(updateType, update, film);
          })
          .catch(() => {
            this._filmPresenter[film.id].setViewState(State.ABORTING, update);
          });
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
        this._clear();
        this.renderProfile();
        this._renderAllFilmsList();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску
        this._clear({resetRenderedFilmCount: true, resetSortType: true});
        this.renderProfile();
        this._renderAllFilmsList();
        break;

      case UpdateType.INIT:
        // загрузка MovieList первый раз
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderAllFilmsList();
        break;

      case UpdateType.INIT_POPUP:
        this._filmPresenter[data.id].renderPopupDetails(data);
        break;
    }
  }

  // метод для рендеринга содержимого <main>
  _render() {
    this._renderSort();

    // рендер <section class="films" (секция после сортировки)
    // со всеми разделами фильмов
    render(this._filmContainer, this._contentComponent, RenderPosition.BEFOREEND);
    this._renderAllFilmsList();
  }

  // метод для рендеринга панели сортиовки
  _renderSort() {
    this._sortComponent = new SortView();

    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендера верхнего раздела с фильмами
  _renderAllFilmsList() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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


    if (filmCount > this._renderedFilmAmount) {
      this._renderShowMoreButton();
    }
  }

  _renderLoading() {
    render(this._contentComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
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
    const filmCardPresenter = new FilmCardPresenter(this._allFilmListComponent, this._handleViewAction, this._handleModeChange, this._commentsModel, this._api);
    if (this._filmsModel.getOpenedPopup() === film.id) {
      film.isPopupOpen = true;
    }
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

  _handleModeChange() {
    this._filmsModel.setOpenedPopup(null);
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
    this._clear({resetRenderedFilmCount: true});

    // - Рендерим список заново
    this._renderAllFilmsList();
  }

  _clear({resetRenderedFilmCount = false, resetSortType = false} = {}) {
    // получаем кол-во задач, доступных на момент очистки movieList
    const filmCount = this._getFilms().length;

    // вызываем у каждого filmPresenter метод destroy
    Object.values(this._filmPresenter)
          .forEach((presenter) => presenter.destroy());

    this._filmPresenter = {};

    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);

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
