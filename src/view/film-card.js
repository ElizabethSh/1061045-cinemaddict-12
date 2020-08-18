import AbstractView from "./abstract.js";

const createFilmCardTemplate = (film) => {
  const {title, description, poster} = film;
  const commentAmount = film.comments.length + 1;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">8.3</p>
      <p class="film-card__info">
        <span class="film-card__year">1929</span>
        <span class="film-card__duration">1h 55m</span>
        <span class="film-card__genre">Musical</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentAmount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
    this._posterClickHandler = this._posterClickHandler.bind(this);
    this._titleClickHandler = this._titleClickHandler.bind(this);
    this._commentAmountClickHandler = this._commentAmountClickHandler.bind(this);
  }

  _getTemplate() {
    return createFilmCardTemplate(this._films);
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

  setPosterClickHandler(callback) {
    this._callback.posterClick = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._posterClickHandler);
  }

  setTitleClickHandler(callback) {
    this._callback.titleClick = callback;
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._titleClickHandler);
  }

  setCommentAmountClickHandler(callback) {
    this._callback.commentAmountClick = callback;
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._commentAmountClickHandler);
  }
}

