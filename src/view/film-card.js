import Abstract from "./abstract.js";
import {formatFilmDuration, formatDescription, capitalizeFirstLetter} from "../utils/common.js";

const createFilmCardTemplate = (film) => {
  const {
    title,
    description,
    poster,
    rating,
    releaseDate,
    runtime,
    genres,
    isWatchlist,
    isHistory,
    isFavorites
  } = film;

  const commentAmount = film.comments.length;
  const releaseYear = releaseDate.getFullYear();
  const filmDuration = formatFilmDuration(runtime);
  const filmRating = rating.toFixed(1);
  const filmDescription = capitalizeFirstLetter(formatDescription(description));
  const filmGenres = [...genres].join(` `);

  const watchlistClassName = isWatchlist
    ? `film-card__controls-item--add-to-watchlist film-card__controls-item--active`
    : `film-card__controls-item--add-to-watchlist`;

  const alreadyWatchedClassName = isHistory
    ? `film-card__controls-item--mark-as-watched film-card__controls-item--active`
    : `film-card__controls-item--mark-as-watched`;

  const favoriteClassName = isFavorites
    ? `film-card__controls-item--favorite film-card__controls-item--active`
    : `film-card__controls-item--favorite`;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${filmRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">${filmDuration}</span>
        <span class="film-card__genre">${filmGenres}</span>
      </p>
      <img src="./${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmDescription}</p>
      <a class="film-card__comments">${commentAmount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button ${watchlistClassName}">Add to watchlist</button>
        <button class="film-card__controls-item button ${alreadyWatchedClassName}">Mark as watched</button>
        <button class="film-card__controls-item button ${favoriteClassName}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();

    this._data = film;
    this._buttons = this.getElement()
                        .querySelectorAll(`.film-card__controls-item`);

    this._posterClickHandler = this._posterClickHandler.bind(this);
    this._titleClickHandler = this._titleClickHandler.bind(this);
    this._commentAmountClickHandler = this._commentAmountClickHandler.bind(this);

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  disableButtons() {
    this._buttons.forEach((button) => {
      button.disabled = true;
    });
  }

  enableButtons() {
    this._buttons.forEach((button) => {
      button.disabled = false;
    });
  }

  _getTemplate() {
    return createFilmCardTemplate(this._data);
  }

  _posterClickHandler(evt) {
    evt.preventDefault();
    this._callback.posterClick();
  }

  _titleClickHandler(evt) {
    evt.preventDefault();
    this._callback.titleClick();
  }

  _commentAmountClickHandler(evt) {
    evt.preventDefault();
    this._callback.commentAmountClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _alreadyWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setPosterClickHandler(callback) {
    this._callback.posterClick = callback;
    this.getElement()
        .querySelector(`.film-card__poster`)
        .addEventListener(`click`, this._posterClickHandler);
  }

  setTitleClickHandler(callback) {
    this._callback.titleClick = callback;
    this.getElement()
        .querySelector(`.film-card__title`)
        .addEventListener(`click`, this._titleClickHandler);
  }

  setCommentAmountClickHandler(callback) {
    this._callback.commentAmountClick = callback;
    this.getElement()
        .querySelector(`.film-card__comments`)
        .addEventListener(`click`, this._commentAmountClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement()
        .querySelector(`.film-card__controls-item--add-to-watchlist`)
        .addEventListener(`click`, this._watchlistClickHandler);

  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement()
        .querySelector(`.film-card__controls-item--mark-as-watched`)
        .addEventListener(`click`, this._alreadyWatchedClickHandler);

  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
        .querySelector(`.film-card__controls-item--favorite`)
        .addEventListener(`click`, this._favoriteClickHandler);
  }
}
