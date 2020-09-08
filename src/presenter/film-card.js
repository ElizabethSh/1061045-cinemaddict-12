import FilmCardView from "../view/film-card.js";
import PopupView from "../view/popup.js";
import FilmInfoView from "../view/film-info.js";
import FilmInfoControlView from "../view/film-control.js";
import FilmCommentsView from "../view/film-comments.js";
import CommentPresenter from "../presenter/comment.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {Mode, UserAction, UpdateType} from "../const.js";

const body = document.querySelector(`body`);

export default class FilmCard {
  constructor(filmContainer, changeData, changeMode, commentsModel) {
    this._filmCardContainer = filmContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;

    this._mode = Mode.DEFAULT;

    this._filmCardComponent = null;
    this._popupComponent = null;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    // this._handleCommentModelEvent = this._handleCommentModelEvent.bind(this);
    // this._handleCommentViewAction = this._handleCommentViewAction.bind(this);

    // this._commentsModel.addObserver(this._handleCommentModelEvent);
  }

  init(film) {
    this._film = film;
    this._comments = this._commentsModel.getCommentsByFilmId(this._film.id);

    const prevFilmCardComponent = this._filmCardComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmCardComponent = new FilmCardView(film, this._comments);
    this._popupComponent = new PopupView();


    // обработчик открытия попапа на постер
    this._filmCardComponent.setPosterClickHandler(() => {
      this._renderPopup();
    });

    // обработчик открытия попапа на title
    this._filmCardComponent.setTitleClickHandler(() => {
      this._renderPopup();
    });

    // обработчик открытия попапа на кол-во комментариев в карточке
    this._filmCardComponent.setCommentAmountClickHandler(() => {
      this._renderPopup();
    });

    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    // если карточка фильма рисуется первый раз, просто отрисуй
    if (prevFilmCardComponent === null || prevPopupComponent === null) {
      this._renderCard(film);
      return;
    }

    // иначе, замени предыдущую карточку на обновленную
    if (this._mode === Mode.DEFAULT) {
    // if (this._filmCardContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._mode === Mode.POPUP) {
    // if (body.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevPopupComponent);
    remove(prevFilmCardComponent);
  }

  // метод для удаления карточки
  destroyFilmCard() {
    remove(this._filmCardComponent);
  }

  // метод для удаления попапа
  destroyPopup() {
    remove(this._popupComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  // метод для удаления всех попапов и переключения режима страницы
  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this.destroyPopup();
    }
  }

  // метод для рендера карточки фильма
  _renderCard() {
    render(this._filmCardContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  // метод для рендера попапа
  _renderPopup() {
    this._changeMode();
    render(body, this._popupComponent, RenderPosition.BEFOREEND);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);
    this._renderPopupDetails();

    this._mode = Mode.POPUP;
  }

  _renderPopupDetails() {
    this._filmInfoContainer = this._popupComponent.getElement().querySelector(`.form-details__top-container`);
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

  // _handleCommentModelEvent(updateType) {
  //   switch (updateType) {
  //     case UpdateType.PATCH:
  //       // обновляет список комментариев
  //       this._clearCommentsList();
  //       this._renderFilmComments();
  //       break;
  //   }
  // }
}
