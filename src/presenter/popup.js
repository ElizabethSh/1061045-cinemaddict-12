import PopupView from "../view/popup.js";
import FilmInfoView from "../view/film-info.js";
import FilmInfoControlView from "../view/film-control.js";
import FilmCommentsView from "../view/film-comments.js";
import CommentPresenter from "../presenter/comment.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UpdateType, UserAction} from "../const.js";

export default class Popup {
  constructor(container, watchlistChange, alreadyWatchedChange, favoriteChange, commentsModel) {
    this._popupContainer = container;

    // в попапе изменение контролов должно вызывать перерендер карточек,
    // т.е. изменение массивов и инит измененной карточки.
    // поэтому использую обработчики, описанные в презентере film-card
    this._watchlistChange = watchlistChange;
    this._alreadyWatchedChange = alreadyWatchedChange;
    this._favoriteChange = favoriteChange;
    this._commentsModel = commentsModel;
    this._popupComponent = null;

    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCommentModelEvent = this._handleCommentModelEvent.bind(this);
    this._handleCommentViewAction = this._handleCommentViewAction.bind(this);

    this._commentsModel.addObserver(this._handleCommentModelEvent);
  }

  // Метод для инициализации (начала работы) модуля
  init(film) {
    this._film = film;
    this._comments = this._commentsModel.getCommentsByFilmId();

    const prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView();

    this._filmInfoContainer = this._popupComponent.getElement().querySelector(`.form-details__top-container`);

    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);

    if (prevPopupComponent === null) {
      this._render();
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

    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._renderFilmDetails();
  }

  // метод для рендеринга разделов попапа
  _renderFilmDetails() {
    this._renderFilmInfo();
    this._renderFilmControl();
    this._renderFilmComments();
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
  _renderFilmComments() {
    this._filmCommentsComponent = new FilmCommentsView(this._comments, this._handleCommentViewAction);
    this._commentsContainer = this._filmCommentsComponent.getElement().querySelector(`.film-details__comments-list`);

    // рендер секции комментариев к фильму
    render(this._filmInfoContainer, this._filmCommentsComponent, RenderPosition.AFTEREND);

    // рендер каждого комментария
    this._comments.forEach((comment) => this._renderComment(comment));
  }

  // метод для рендера одного комментария
  _renderComment(comment) {
    const commentPresenter = new CommentPresenter(this._commentsContainer, this._handleCommentViewAction);
    commentPresenter.init(comment);
  }

  _clearCommentsList() {
    remove(this._filmCommentsComponent);
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

  _handleCommentViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;

      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleCommentModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        // обновляет список комментариев
        this._clearCommentsList();
        this._renderFilmComments();
        break;
    }
  }
}
