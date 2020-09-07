import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

const createFilmsSortingTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  _getTemplate() {
    return createFilmsSortingTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  setActiveButton(sortType) {
    const sortButtons = this.getElement().querySelectorAll(`.sort__button`);
    sortButtons.forEach((it) => it.classList.remove(`sort__button--active`));
    this.getElement().querySelector(`[data-sort-type = ${sortType}]`).classList.add(`sort__button--active`);
  }
}

