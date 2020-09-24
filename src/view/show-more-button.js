import AbstractView from "./abstract.js";

const createShowMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this); // привязываем обработчик к контексту(текущему классу)
  }

  _getTemplate() {
    return createShowMoreButtonTemplate();
  }

  // метод добавления обработчика на элемент
  setClickHandler(callback) {
    this._callback.click = callback; // записываем колбэк в объект с колбеками этого класса
    this.getElement().addEventListener(`click`, this._clickHandler); // навешиваем обработчик на элемент
  }

  // функция-обработчик
  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(); // вызов функции-обработчика
  }
}
