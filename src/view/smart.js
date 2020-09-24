import AbstractView from "./abstract.js";
import {update} from "../utils/common.js";

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  updateData(updatedData) {
    this._data = update(this._data, updatedData);

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
