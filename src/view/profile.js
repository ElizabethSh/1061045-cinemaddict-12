import AbstractView from "./abstract.js";
import {getRank, formatUserRank} from "../utils/user-rank.js";

const createProfileTemplate = (films) => {
  const watchedFilms = films.filter((film) => film.isHistory);
  const rank = formatUserRank(getRank(watchedFilms));
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  _getTemplate() {
    return createProfileTemplate(this._films);
  }
}
