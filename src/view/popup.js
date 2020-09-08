import SmartView from "./smart.js";

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

export default class Popup extends SmartView {
  constructor() {
    super();

    this._clickCloseButtonHandler = this._clickCloseButtonHandler.bind(this);
  }

  _getTemplate() {
    return createPopupTemplate();
  }

  restoreHandlers() {
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
  }

  _clickCloseButtonHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement()
        .querySelector(`.film-details__close-btn`)
        .addEventListener(`click`, this._clickCloseButtonHandler);
  }

  // приехало из смарт компонента

  // updateData(update) {
  //   if (!update) {
  //     return;
  //   }

  //   this._data = Object.assign(
  //       {},
  //       this._data,
  //       update
  //   );
  //   // console.log(`this._data`, this._data);

  //   // if (justDataUpdating) {
  //   //   return;
  //   // }

  //   this.updateElement();
  // }

}
