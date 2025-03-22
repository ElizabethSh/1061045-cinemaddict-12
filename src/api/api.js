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
    this._endPoint = endPoint;
    this._autorization = autorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  getComments(film) {
    return this._load({url: `comments/${film.id}`})
    .then((response) => response.json())
    .then((comments) => comments.map(CommentsModel.adaptToClient));
  }


  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(FilmsModel.adaptToClient);
  }

  addComment(comment, film) {
    return this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then((response) => response.json())
    .then(CommentsModel.adaptToClient);
  }

  deleteComment(comment) {
    return this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE
    });
  }

  // sync data
  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._autorization);

    return fetch(`${this._endPoint}/${url}`,{method, body, headers})
    .then(Api.checkStatus)
    .catch(Api.catchError);
  }

  // check server status
  static checkStatus(response) {

    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  // error handler
  static catchError(err) {
    throw err;
  }
}
