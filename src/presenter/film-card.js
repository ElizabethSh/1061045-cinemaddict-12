import FilmCardView from "../view/film-card.js";
import PopupPresenter from "../presenter/popup.js";
import {render, RenderPosition} from "../utils/render.js";

const body = document.querySelector(`body`);

export default class FilmCard {
  constructor(container) {
    this._filmCardContainer = container;
  }

  init(film) {
    this._film = film;
    this._filmCardComponent = new FilmCardView(film);

    this._render(film);
  }

  _render(film) {
    // обработчик открытия попапа на постер
    this._filmCardComponent.setPosterClickHandler(() => {
      this._renderPopup(film);
    });

    // обработчик открытия попапа на title
    this._filmCardComponent.setTitleClickHandler(() => {
      this._renderPopup(film);
    });

    // обработчик открытия попапа на кол-во комментариев в карточке
    this._filmCardComponent.setCommentAmountClickHandler(() => {
      this._renderPopup(film);
    });

    render(this._filmCardContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  _renderPopup(film) {
    const popup = new PopupPresenter(body);
    popup.init(film);
  }
}
