import Abstract from "./abstract.js";

const createFilmCardTemplate = (film, comments) => {
  const {title, description, poster, rating, releaseDate, isWatchlist, isHistory, isFavorites} = film;
  const commentAmount = comments.length;
  const releaseYear = releaseDate.getFullYear();

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
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseYear}</span>
        <span class="film-card__duration">1h 55m</span>
        <span class="film-card__genre">Musical</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
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
  constructor(film, comments) {
    super();

    this._data = film;
    this._comments = comments;

    this._posterClickHandler = this._posterClickHandler.bind(this);
    this._titleClickHandler = this._titleClickHandler.bind(this);
    this._commentAmountClickHandler = this._commentAmountClickHandler.bind(this);

    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  _getTemplate() {
    return createFilmCardTemplate(this._data, this._comments);
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
