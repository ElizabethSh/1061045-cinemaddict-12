import PopupView from "../view/popup.js";
import FilmInfoView from "../view/film-info.js";
import FilmInfoControlView from "../view/film-control.js";
import CommentView from "../view/comment.js";
import {render, RenderPosition} from "../utils/render.js";

export default class Popup {
  constructor(container) {
    this._popupContainer = container;

    this._popupComponent = new PopupView();
    this._infoControlComponent = new FilmInfoControlView();

    this._filmInfoContainer = this._popupComponent.getElement().querySelector(`.form-details__top-container`);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
  }

  // Метод для инициализации (начала работы) модуля
  init(film) {
    this._film = film;
    this._renderPopup(film);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
  }

  // метод рендеринга самого попапа без разделов
  _renderPopup(film) {
    render(this._popupContainer, this._popupComponent, RenderPosition.BEFOREEND);

    this._popupComponent.setClickHandler(this._handleCloseButtonClick);
    this._renderFilmDetails(film);
  }

  // callback, который запишется в объект callback в popupView,
  // и вызовется при клике на кнопку закрытия попапа
  _handleCloseButtonClick() {
    this._popupContainer.removeChild(this._popupComponent.getElement());
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
}
