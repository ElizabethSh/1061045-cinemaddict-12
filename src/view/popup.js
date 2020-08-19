import AbstractView from "./abstract.js";

const createPopupTemplate = () => {
  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
        </div>
      </form>
    </section>`
  );
};

export default class Popup extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  _getTemplate() {
    return createPopupTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    const closeButton = this.getElement().querySelector(`.film-details__close-btn`);
    this._callback.click = callback;
    closeButton.addEventListener(`click`, this._clickHandler);
  }
}
