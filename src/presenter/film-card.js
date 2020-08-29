import FilmCardView from "../view/film-card.js";
import PopupPresenter from "../presenter/popup.js";
import {render, RenderPosition, remove, replace} from "../utils/render.js";
import {Mode} from "../const.js";

const body = document.querySelector(`body`);

export default class FilmCard {
  constructor(container, changeData/*, changeMode*/) {
    this._filmCardContainer = container;

    this._changeData = changeData;
    // this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._popup = null;
    this._mode = Mode.DEFAULT;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(film) {
    this._film = film;
    this._popup = new PopupPresenter(body);

    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardView(film);

    this._filmCardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmCardComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    // если карточка фильма рисуется первый раз, просто отрисуй
    if (prevFilmCardComponent === null) {
      this._render(film);
      return;
    }

    // иначе, замени предыдущую карточку на обновленную
    // if (this._mode === Mode.DEFAULT) {
    if (this._filmCardContainer.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    remove(prevFilmCardComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._popup.remove();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  _render(film) {
    // обработчик открытия попапа на постер
    this._filmCardComponent.setPosterClickHandler(() => {
      this._renderPopup(film);
    });

    // обработчик открытия попапа на title
    this._filmCardComponent.setTitleClickHandler(() => {
      this._renderPopup(film);
    });

    // обработчик открытия попапа на кол-во комментариев в карточке
    this._filmCardComponent.setCommentAmountClickHandler(() => {
      this._renderPopup(film);
    });

    render(this._filmCardContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  _renderPopup(film) {
    this._popup.init(film);
    // this._changeMode();
    // this._mode = Mode.POPUP;
  }

  _handleWatchlistClick() {
    this._changeData(
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
        Object.assign(
            {},
            this._film,
            {
              isFavorites: !this._film.isFavorites
            }
        )
    );
  }
}
