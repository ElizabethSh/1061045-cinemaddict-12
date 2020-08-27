import PopupView from "../view/popup.js";
import FilmInfoView from "../view/film-info.js";
import FilmInfoControlView from "../view/film-control.js";
import CommentView from "../view/comment.js";
import {render, RenderPosition} from "../utils/render.js";
import {Mode} from "../const.js";

export default class Popup {
  constructor(container) {
    this._popupContainer = container;

    this._popupComponent = null;

    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  // Метод для инициализации (начала работы) модуля
  init(film) {
    this._film = film;
    this._popupComponent = new PopupView();
    this._filmInfoContainer = this._popupComponent.getElement().querySelector(`.form-details__top-container`);

    this._render(film);
  }

  // метод рендеринга самого попапа без разделов
  _render(film) {
    render(this._popupContainer, this._popupComponent, RenderPosition.BEFOREEND);

    this._popupComponent.setClickHandler(this._handleCloseButtonClick);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.POPUP;

    this._renderFilmDetails(film);
  }

  // метод для рендеринга разделов попапа
  _renderFilmDetails(film) {
    this._renderFilmInfo(film);
    this._renderFilmControl(film);
    this._renderFilmComment(film);
  }

  // метод для рендеринга информации о фильме
  _renderFilmInfo(film) {
    const filmInfoComponent = new FilmInfoView(film);
    render(this._filmInfoContainer, filmInfoComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендеринга кнопок под информацией о фильме
  _renderFilmControl(film) {
    const infoControlComponent = new FilmInfoControlView(film);
    render(this._filmInfoContainer, infoControlComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендеринга комментариев
  _renderFilmComment(film) {
    const filmCommentComponent = new CommentView(film);
    render(this._filmInfoContainer, filmCommentComponent, RenderPosition.AFTEREND);
  }

  remove() {
    this._popupContainer.removeChild(this._popupComponent.getElement());
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.remove();
    }
  }

  // callback, который запишется в объект callback в popupView,
  // и вызовется при клике на кнопку закрытия попапа
  _handleCloseButtonClick() {
    this.remove();
  }
}
