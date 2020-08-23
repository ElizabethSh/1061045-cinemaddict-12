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
    this._renderFilmCard(film);
  }

  _renderFilmCard(film) {
    const popup = new PopupPresenter(body);
    render(this._filmCardContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
    // обработчик открытия попапа на постер
    this._filmCardComponent.setPosterClickHandler(() => {
      popup.init(film);
    });

    // обработчик открытия попапа на title
    this._filmCardComponent.setTitleClickHandler(() => {
      popup.init(film);
    });

    // обработчик открытия попапа на кол-во комментариев в карточке
    this._filmCardComponent.setCommentAmountClickHandler(() => {
      popup.init(film);
    });
  }
}
