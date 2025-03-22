import FilmsModel from "../model/films.js";
import CommentsModel from "../model/comments.js";

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, filmsStore, commentsStore) {
    this._api = api;
    this._filmsStore = filmsStore;
    this._commentsStore = commentsStore;
  }

  getFilms() {
    if (this._isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));

          this._filmsStore.setItems(items);

          return films;
        });
    }
    const storeFilms = Object.values(this._filmsStore.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(film) {
    if (this._isOnline()) {
      return this._api.getComments(film)
        .then((comments) => {
          comments.forEach((comment) => {
            this._commentsStore.setItem(comment.id, Object.assign({}, CommentsModel.adaptToServer(comment), {movieId: film.id}));
          });
          return comments;
        });
    }
    const storeComments = this._commentsStore.getCommentsByFilmId(film.id);

    return Promise.resolve(storeComments.map((comment) => CommentsModel.adaptToClient(comment)));
  }

  updateFilm(film) {
    if (this._isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._filmsStore.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));

          return updatedFilm;
        });
    }

    this._filmsStore.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  sync() {
    if (this._isOnline()) {
      const storeFilms = Object.values(this._filmsStore.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);
          const items = createStoreStructure([...updatedFilms]);

          this._filmsStore.setItems(items);
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }

  // check if online
  _isOnline() {
    return window.navigator.onLine;
  }
}
