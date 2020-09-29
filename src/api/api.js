import FilmsModel from "../model/films.js";
import CommentsModel from "../model/comments.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, autorization) {
    this._endPoint = endPoint; // адрес сервера
    this._autorization = autorization; // данные для авторизации
  }

  // метод будет будет запрашивать на сервере
  // информацию о задачах
  getFilms() {
    // вызываем метод _load и передаем ему url - адрес ресурса
    return this._load({url: `movies`})
    // полученный результат обрабатываем с пом. статич. метода Api.toJSON
    // который вызывает метод json у объекта ответа сервера
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  getComments(film) {
    return this._load({url: `comments/${film.id}`})
    .then(Api.toJSON)
    .then((comments) => comments.map(CommentsModel.adaptToClient));
  }


  updateFilm(film) {
    // вызываем метод _load, но передаем ему немного другие данные
    return this._load({
      // чтобы обновить конкретную задачу нужно обратиться к url=tasks
      // и передать идентификатор задачи (task.id)
      url: `movies/${film.id}`,
      // обновление задачи происходит с пом.
      // метода PUT - полная замена всех данных
      method: Method.PUT,
      // передаем тело запроса - ту задачу, кот. нужно обновить
      // задачу, получ. в параметре стерилизуем с пом.
      // метода stringify() и адаптируем для бэкенда
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      // передаем заголовок, в кот. указываем что данные
      // находятся в формате aplication/json
      headers: new Headers({"Content-Type": `application/json`})
    })
    // получ. запрос обрабатываем с пом. статич. метода Api.toJSON
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  addComment(comment, film) {
    return this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then(Api.toJSON)
    .then(CommentsModel.adaptToClient);
  }

  deleteComment(comment) {
    return this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE
    });
  }

  // метод для синхронизации данных
  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._autorization);

    // вызываем fetch и передаем ему полный путь к желаемому ресурсу
    return fetch(
        // полный путь состоит из имени сервера(this._endPoint) и адреса ресурса (url)
        // например доступ к задачам будет по ресурсу films - это и будет url
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
    // fetch вернет промис - используем then, в кот. передаем колбэк
    .then(Api.checkStatus)
    .catch(Api.catchError);
  }

  // метод для проверки статуса ответа сервера
  static checkStatus(response) {

    // если код статуса меньше 200 или больше 299, то
    // бросить ошибку
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    // иначе - вернуть запрос
    return response;
  }

  // метод который вызывает метод .json у объекта ответа сервера
  static toJSON(response) {
    return response.json();
  }

  // метод для обработки ошибок в .catch
  static catchError(err) {
    throw err;
  }
}
