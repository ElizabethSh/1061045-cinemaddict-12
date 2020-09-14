import AbstractView from "./abstract.js";
import {formatReleaseData, formatFilmDuration, capitalizeFirstLetter} from "../utils/common.js";

const createGenreItemTemplate = (genre) => {
  return `
  <span class="film-details__genre">${genre}</span>`;
};

const createFilmInfoTemplate = (film) => {
  const {
    title,
    description,
    poster,
    rating,
    releaseDate,
    genres,
    director,
    writers,
    actors,
    runtime,
    ageRating,
    original,
    country
  } = film;

  const releaseFilmDate = formatReleaseData(releaseDate);
  const filmDuration = formatFilmDuration(runtime);
  const filmRating = rating.toFixed(1);
  const filmDescription = capitalizeFirstLetter(description);

  const createGenresTemplate = () => {
    return genres.map((genre) => createGenreItemTemplate(genre)).join(``);
  };

  const genreTemplate = createGenresTemplate();

  return (
    `<div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./${poster}" alt="">

        <p class="film-details__age">${ageRating}+</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${title}</h3>
            <p class="film-details__title-original">Original: ${original}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${filmRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${releaseFilmDate}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${filmDuration}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${country}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
            <td class="film-details__cell">
              ${genreTemplate}
            </td>
          </tr>
        </table>

        <p class="film-details__film-description">
          ${filmDescription}
        </p>
      </div>
    </div>`
  );
};

export default class FilmInfo extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
  }

  _getTemplate() {
    return createFilmInfoTemplate(this._film);
  }
}
