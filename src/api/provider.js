// import {nanoid} from "nanoid";
import FilmsModel from "../model/films.js";
import CommentsModel from "../model/comments.js";

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

// функция преобразует массив в объект
// принимает в качестве параметра МАССИВ с данными
// и перегоняет в объект
const createStoreStructure = (items) => {
  // итерируемся по массиву, создаем новый объект - {},
  // и на каждой итерации добавляем:
  // новый ключ - id фильма, значение - сам объект
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current, // filmId: объект с фильмом
    });
  }, {});
};

export default class Provider {
  constructor(api, filmsStore, commentsStore) {
    this._api = api; // принимает экземпляр класса Api
    this._filmsStore = filmsStore;
    this._commentsStore = commentsStore;
  }

  // метод, который запрашивает фильмы у сервера
  getFilms() {
    // если онлайн
    if (this._isOnline()) {
      // запрашиваем данные у сервера через метод класса Api
      // этот метод класса Api вернет промис с МАССИВОМ объектов
      return this._api.getFilms()
        // резолвим промис с помощью then
        .then((films) => {
          // нужно все полученные фильмы сохранить в хранилище
          // а для этого перевести массив фильмов в объект фильмов
          // для этого используем вспом. функцию createStoreStructure
          // получаем ОБЪЕКТ с объектами фильмов
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));

          // после получения объекта с объектами фильмов
          // сохраняем его в хранилище
          this._filmsStore.setItems(items);

          // возвращаем сами данные - МАССИВ данных (фильмов), полученных с сервера
          return films;
        });
    }
    // если оффлайн, нужно считать данные из хранилища с пом. getItems()
    // и превратить их обратно в массив
    // получаем МАССИВ фильмов
    const storeFilms = Object.values(this._filmsStore.getItems()); // массив

    // нельзя просто вернуть storeFilms (return storeFilms)
    // т.к. код, кот. пользуется классом Api ориентируется на то,
    // что будет возвращен промис, поэтому если просто вернуть массив, все сломается
    // Нужно превратить массив в промис с помощью Promise.resolve,
    // кот. позволяет вернуть зарезолвенный промис и его значением
    // будет то, что передадим ему в кач. параметра - storeFilms
    // т.к. storeFilms сохранен в формате для сервера, его нужно адаптировать для клиента
    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(film) {
    if (this._isOnline()) {
      return this._api.getComments(film)
        .then((comments) => { // получаем массив с объектами комментариев
          comments.forEach((comment) => {
            this._commentsStore.setItem(comment.id, Object.assign({}, CommentsModel.adaptToServer(comment), {movieId: film.id}));
          });
          return comments;
        });
    }
    // если оффлайн, нужно считать данные из хранилища с пом. getItems()
    // и превратить их обратно в массив
    // получаем МАССИВ комментариев
    const storeComments = this._commentsStore.getCommentsByFilmId(film.id);

    return Promise.resolve(storeComments.map((comment) => CommentsModel.adaptToClient(comment)));
  }

  updateFilm(film) {
    // если онлайн
    if (this._isOnline()) {
      // вызываем this._api.updateFilm - выполняем запрос к серверу и обновляем
      // задачи на сервере
      return this._api.updateFilm(film)
      // также обновить задачи нужно и в хранилище
        .then((updatedFilm) => {
          // поэтому вызываем setItem, передаем id обновляемого фильма (key) и
          // адаптируем обновляемый фильм для сервера
          this._filmsStore.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));

          // возвращаем обновленный фильм
          return updatedFilm;
        });
    }

    this._filmsStore.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  // addComment(comment, film) {
  //   if (this._isOnline()) {
  //     return this._api.addComment(comment, film)
  //       .then((newComment) => {
  //         this._commentsStore.setItem(newComment.id, CommentsModel.adaptToServer(newComment));
  //         return newComment;
  //       });
  //   }

  //   // На случай локального создания данных мы должны сами создать `id`.
  //   // Иначе наша модель будет не полной, и это может привнести баги
  //   const localNewCommentId = nanoid();
  //   const localNewComment = Object.assign({}, comment, {id: localNewCommentId});

  //   this._commentsStore.setItem(localNewComment.id, CommentsModel.adaptToServer(localNewComment));

  //   return Promise.resolve(localNewComment);
  // }

  // deleteComment(comment) {
  //   if (this._isOnline()) {
  //     return this._api.deleteComment(comment)
  //       .then(() => this._commentsStore.removeItem(comment.id));
  //   }

  //   this._commentsStore.removeItem(comment.id);

  //   return Promise.resolve();
  // }

  sync() {
    if (this._isOnline()) {
      const storeFilms = Object.values(this._filmsStore.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          // Забираем из ответа синхронизированные фильмы
          const updatedFilms = getSyncedFilms(response.updated);

          // Добавляем синхронизированные фильмы в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...updatedFilms]);

          this._filmsStore.setItems(items);
        });
    }
    return Promise.reject(new Error(`Sync data failed`));
  }

  // метод для проверки онлайн или офлайн
  _isOnline() {
    return window.navigator.onLine;
  }
}
