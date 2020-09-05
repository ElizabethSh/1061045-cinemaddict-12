import PopupView from "../view/popup.js";
import FilmInfoView from "../view/film-info.js";
import FilmInfoControlView from "../view/film-control.js";
import CommentView from "../view/comment.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

export default class Popup {
  constructor(container, watchlistChange, alreadyWatchedChange, favoriteChange) {
    this._popupContainer = container;

    // в попапе изменение контролов должно вызывать перерендер карточек,
    // т.е. изменение массивов и инит измененной карточки.
    // поэтому использую обработчики, описанные в презентере film-card
    this._watchlistChange = watchlistChange;
    this._alreadyWatchedChange = alreadyWatchedChange;
    this._favoriteChange = favoriteChange;
    this._popupComponent = null;

    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  // Метод для инициализации (начала работы) модуля
  init(film, comments) {
    this._film = film;
    this._comments = comments;

    const prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView();

    this._filmInfoContainer = this._popupComponent.getElement().querySelector(`.form-details__top-container`);

    if (prevPopupComponent === null) {
      this._render(film);
      return;
    }

    if (this._popupContainer.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
      this._renderFilmDetails();
    }

    remove(prevPopupComponent);

  }

  destroy() {
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  // метод рендеринга самого попапа без разделов
  _render() {
    render(this._popupContainer, this._popupComponent, RenderPosition.BEFOREEND);

    this._popupComponent.setClickHandler(this._handleCloseButtonClick);
    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._renderFilmDetails();
  }

  // метод для рендеринга разделов попапа
  _renderFilmDetails() {
    this._renderFilmInfo();
    this._renderFilmControl();
    this._renderFilmComment();
  }

  // метод для рендеринга информации о фильме
  _renderFilmInfo() {
    const filmInfoComponent = new FilmInfoView(this._film);
    render(this._filmInfoContainer, filmInfoComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендеринга кнопок под информацией о фильме
  _renderFilmControl() {
    const infoControlComponent = new FilmInfoControlView(this._film);
    render(this._filmInfoContainer, infoControlComponent, RenderPosition.BEFOREEND);

    infoControlComponent.setWatchlistChangeHandler(this._watchlistChange);
    infoControlComponent.setAlreadyWatchedChangeHandler(this._alreadyWatchedChange);
    infoControlComponent.setFavoriteChangeHandler(this._favoriteChange);
  }

  // метод для рендеринга комментариев
  _renderFilmComment() {
    const filmCommentComponent = new CommentView(this._film, this._comments);
    render(this._filmInfoContainer, filmCommentComponent, RenderPosition.AFTEREND);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  // callback, который запишется в объект callback в popupView,
  // и вызовется при клике на кнопку закрытия попапа
  _handleCloseButtonClick() {
    this.destroy();
  }
}
