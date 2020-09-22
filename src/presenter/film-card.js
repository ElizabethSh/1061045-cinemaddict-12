import FilmCardView from "../view/film-card.js";
import PopupView from "../view/popup.js";
import FilmInfoView from "../view/film-info.js";
import FilmControlView from "../view/film-control.js";
import FilmCommentsView from "../view/film-comments.js";
import CommentView from "../view/comment.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {UserAction, UpdateType, State} from "../const.js";

const body = document.querySelector(`body`);

export default class FilmCard {
  constructor(filmContainer, changeData, changeMode, commentsModel, api) {
    this._container = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;
    this._api = api;

    this._commentView = {}; // observer

    this._cardComponent = null;
    this._popupComponent = null;
    this._isRequestSent = null;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCommentViewAction = this._handleCommentViewAction.bind(this);
  }

  init(film) {
    this._film = film;

    const prevCardComponent = this._cardComponent;
    const prevPopupComponent = this._popupComponent;

    this._cardComponent = new FilmCardView(film);
    this._popupComponent = new PopupView();

    // обработчик открытия попапа на постер
    this._cardComponent.setPosterClickHandler(() => {
      if (!this._isRequestSent) {
        this._renderPopup();
      }
    });

    // обработчик открытия попапа на title
    this._cardComponent.setTitleClickHandler(() => {
      if (!this._isRequestSent) {
        this._renderPopup();
      }
    });

    // обработчик открытия попапа на кол-во комментариев в карточке
    this._cardComponent.setCommentAmountClickHandler(() => {
      if (!this._isRequestSent) {
        this._renderPopup();
      }
    });

    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._cardComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    // если карточка фильма рисуется первый раз, просто отрисуй
    if (prevCardComponent === null || prevPopupComponent === null) {
      this._renderCard(this._film);

      if (this._film.isPopupOpen) {
        this._renderPopup();
      }
      return;
    }

    // иначе, замени предыдущую карточку на обновленную
    if (this._container.getElement().contains(prevCardComponent.getElement())) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (body.contains(prevPopupComponent.getElement())) {
      this._renderPopup();
    }

    remove(prevPopupComponent);
    remove(prevCardComponent);
  }

  // метод для удаления карточки
  destroy() {
    remove(this._cardComponent);
    this.destroyPopup();
  }

  // метод для удаления попапа
  destroyPopup() {
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._film.isPopupOpen = false;
    this._commentView = {};
  }

  // метод для удаления всех попапов и переключения режима страницы
  resetView() {
    if (this._film.isPopupOpen) {
      this.destroyPopup();
    }
  }

  setViewState(state, comment) {
    const resetFormState = () => {
      this._commentView[comment.id].updateData({
        isDisabled: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.UPDATING:
        this._cardComponent.disableButtons();
        if (body.contains(this._popupComponent.getElement())) {
          this._filmControlComponent.disableButtons();
        }
        break;

      case State.SAVING:
        this._filmCommentsComponent.disableForm();
        break;

      case State.DELETING:
        this._commentView[comment.id].updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;

      case State.ABORTING:
        this._commentView[comment.id].shake(resetFormState);
        break;
    }
  }

  setButtonsAborting() {
    this._cardComponent.enableButtons();
    this._filmControlComponent.enableButtons();
  }

  setAborting() {
    this._filmCommentsComponent.shake();
    this._filmCommentsComponent.enableForm();
  }

  renderPopupDetails() {
    this._changeMode();
    // рендер попапа без содержимого
    render(body, this._popupComponent, RenderPosition.BEFOREEND);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);

    this._filmInfoContainer = this._popupComponent.getElement().querySelector(`.form-details__top-container`);

    // рендер содержимого попапа
    this._renderFilmInfo(this._film);
    this._renderFilmControl(this._film);
    this._renderFilmComments();

    this._film.isPopupOpen = true;
  }

  // метод для рендера карточки фильма
  _renderCard() {
    render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
  }

  _getComments() {
    this._isRequestSent = true;
    this._api.getComments(this._film)
      .then((comments) => {
        this._commentsModel.set(UpdateType.INIT_POPUP, comments, this._film);
        this._isRequestSent = false;
      })
      .catch(() => {
        this._commentsModel.set(UpdateType.INIT_POPUP, []);
        this._isRequestSent = false;
      });
  }

  // метод для рендера попапа
  _renderPopup() {
    this._getComments();
  }

  // метод для рендеринга информации о фильме
  _renderFilmInfo(film) {
    const filmInfoComponent = new FilmInfoView(film);
    render(this._filmInfoContainer, filmInfoComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендеринга кнопок под информацией о фильме
  _renderFilmControl(film) {
    this._filmControlComponent = new FilmControlView(film);
    render(this._filmInfoContainer, this._filmControlComponent, RenderPosition.BEFOREEND);

    this._filmControlComponent.setWatchlistChangeHandler(this._handleWatchlistClick);
    this._filmControlComponent.setAlreadyWatchedChangeHandler(this._handleAlreadyWatchedClick);
    this._filmControlComponent.setFavoriteChangeHandler(this._handleFavoriteClick);
  }

  // метод для рендеринга комментариев
  _renderFilmComments() {
    this._comments = this._commentsModel.get();

    this._filmCommentsComponent = new FilmCommentsView(this._comments, this._film);
    this._commentsContainer = this._filmCommentsComponent.getElement().querySelector(`.film-details__comments-list`);

    this._filmCommentsComponent.setFormSubmitClickHandler(this._handleFormSubmit);

    // рендер секции комментариев к фильму
    render(this._filmInfoContainer, this._filmCommentsComponent, RenderPosition.AFTEREND);

    // рендер каждого комментария
    this._comments.forEach((comment) => this._renderComment(comment));
  }

  // метод для рендера одного комментария
  _renderComment(comment) {
    this._commentComponent = new CommentView(comment);
    this._commentComponent.setDeleteButtonClickHandler(this._handleDeleteClick);
    render(this._commentsContainer, this._commentComponent, RenderPosition.BEFOREEND);

    this._commentView[comment.id] = this._commentComponent;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroyPopup();
    }
  }

  // callback, который запишется в объект callback в popupView,
  // и вызовется при клике на кнопку закрытия попапа
  _handleCloseButtonClick() {
    this.destroyPopup();
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isWatchlist: !this._film.isWatchlist
            }
        )
    );
  }

  _handleAlreadyWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isHistory: !this._film.isHistory
            }
        )
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isFavorites: !this._film.isFavorites
            }
        )
    );
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

  _handleDeleteClick(comment) {
    this._changeData(
        UserAction.DELETE_COMMENT,
        null,
        comment,
        this._film
    );
  }

  // колбек который будет вызывать обновление массива коментариев
  _handleFormSubmit(comment) {
    this._changeData(
        UserAction.ADD_COMMENT,
        null,
        comment,
        this._film
    );
  }
}
