import Observer from "../utils/observer.js";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
    this._openedPopup = null;
  }

  set(updateType, films) {
    this._films = films.slice();
    this._notify(updateType);
  }

  get() {
    return this._films;
  }

  setOpenedPopup(filmId) {
    this._openedPopup = filmId;
  }

  getOpenedPopup() {
    return this._openedPopup;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          title: film.film_info.title,
          poster: film.film_info.poster,
          description: film.film_info.description,
          rating: film.film_info.total_rating,
          releaseDate: new Date(film.film_info.release.date),
          writers: film.film_info.writers,
          director: film.film_info.director,
          actors: film.film_info.actors,
          runtime: film.film_info.runtime,
          genres: film.film_info.genre,
          original: film.film_info.alternative_title,
          ageRating: film.film_info.age_rating,
          country: film.film_info.release.release_country,
          isWatchlist: film.user_details.watchlist,
          isHistory: film.user_details.already_watched,
          isFavorites: film.user_details.favorite,
          watchingDate: new Date(film.user_details.watching_date),
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedFilm.film_info.title;
    delete adaptedFilm.film_info.director;
    delete adaptedFilm.film_info.poster;
    delete adaptedFilm.film_info.description;
    delete adaptedFilm.film_info.total_rating;
    delete adaptedFilm.film_info.release.date;
    delete adaptedFilm.film_info.release_country;
    delete adaptedFilm.film_info.writers;
    delete adaptedFilm.film_info.actors;
    delete adaptedFilm.film_info.runtime;
    delete adaptedFilm.film_info.alternative_title;
    delete adaptedFilm.film_info.age_rating;
    delete adaptedFilm.film_info.genre;
    delete adaptedFilm.user_details.watchlist;
    delete adaptedFilm.user_details.already_watched;
    delete adaptedFilm.user_details.favorite;
    delete adaptedFilm.user_details.watching_date;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const userDetale = Object.assign(
        {},
        film.user_details,
        {
          "watchlist": film.isWatchlist,
          "already_watched": film.isHistory,
          "favorite": film.isFavorites,
          "watching_date": film.watchingDate instanceof Date ? film.releaseDate.toISOString() : null
        }
    );

    const releaseDate = Object.assign(
        {},
        film.film_info.release,
        {
          "date": film.releaseDate instanceof Date ? film.releaseDate.toISOString() : null,
          "release_country": film.country
        }
    );

    const filmInfo = Object.assign(
        {},
        film.film_info,
        {
          "title": film.title,
          "director": film.director,
          "poster": film.poster,
          "genre": film.genres,
          "total_rating": film.rating,
          "description": film.description,
          "release": releaseDate,
          "alternative_title": film.original,
          "writers": film.writers,
          "actors": film.actors,
          "runtime": film.runtime,
          "age_rating": film.ageRating
        }
    );

    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "user_details": userDetale
        },
        {
          "film_info": filmInfo
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedFilm.title;
    delete adaptedFilm.poster;
    delete adaptedFilm.genres;
    delete adaptedFilm.rating;
    delete adaptedFilm.description;
    delete adaptedFilm.runtime;
    delete adaptedFilm.original;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.country;
    delete adaptedFilm.isWatchlist;
    delete adaptedFilm.isHistory;
    delete adaptedFilm.isFavorites;
    delete adaptedFilm.watchingDate;

    return adaptedFilm;
  }

}
