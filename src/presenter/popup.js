import PopupView from "../view/popup.js";
import FilmInfoView from "../view/film-info.js";
import FilmInfoControlView from "../view/film-control.js";
import CommentView from "../view/comment.js";
import {render, RenderPosition} from "../utils/render.js";

export default class Popup {
  constructor(container) {
    this._popupContainer = container;

    this._infoControlComponent = new FilmInfoControlView();

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
    this._renderFilmDetails(film);
  }

  // callback, который запишется в объект callback в popupView,
  // и вызовется при клике на кнопку закрытия попапа
  _handleCloseButtonClick() {
    this._remove();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._remove();
    }
  }

  // метод для рендеринга разделов попапа
  _renderFilmDetails(film) {
    this._renderFilmInfo(film);
    this._renderFilmControl();
    this._renderFilmComment(film);
  }

  // метод для рендеринга информации о фильме
  _renderFilmInfo(film) {
    this._filmInfoComponent = new FilmInfoView(film);
    render(this._filmInfoContainer, this._filmInfoComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендеринга кнопок под информацией о фильме
  _renderFilmControl() {
    render(this._filmInfoContainer, this._infoControlComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендеринга комментариев
  _renderFilmComment(film) {
    this._filmCommentComponent = new CommentView(film);
    render(this._filmInfoContainer, this._filmCommentComponent, RenderPosition.AFTEREND);
  }

  _remove() {
    this._popupContainer.removeChild(this._popupComponent.getElement());
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }
}
