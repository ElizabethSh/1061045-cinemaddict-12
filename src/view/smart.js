import Abstract from "./abstract.js";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update/* , justDataUpdating*/) {
    if (!update) {
      return;
    }

    this._film = Object.assign(
        {},
        this._film,
        update
    );
    // console.log(`this._data`, this._data);

    // if (justDataUpdating) {
    //   return;
    // }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;

    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null; // Чтобы окончательно "убить" ссылку на prevElement

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
