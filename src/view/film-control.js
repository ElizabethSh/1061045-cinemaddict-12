import AbstractView from "./abstract.js";

const createFilmInfoControlsTemplate = (film) => {
  const {isWatchlist, isHistory, isFavorites} = film;
  return (
    `<section class="film-details__controls">
      <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? `checked` : ``}>
      <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isHistory ? `checked` : ``}>
      <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

      <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorites ? `checked` : ``}>
      <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
    </section>`
  );
};

export default class FilmControl extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._buttons = this.getElement()
                        .querySelectorAll(`.film-details__control-input`);

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
    return createFilmInfoControlsTemplate(this._film);
  }

  setWatchlistChangeHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement()
        .querySelector(`#watchlist`)
        .addEventListener(`change`, this._watchlistClickHandler);
  }

  setAlreadyWatchedChangeHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement()
        .querySelector(`#watched`)
        .addEventListener(`change`, this._alreadyWatchedClickHandler);
  }

  setFavoriteChangeHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement()
        .querySelector(`#favorite`)
        .addEventListener(`change`, this._favoriteClickHandler);
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
}
