import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  set(updateType, comments, film) {
    this._comments = comments.slice();
    this._notify(updateType, film);
  }

  get() {
    return this._comments;
  }

  addComment(updateType, update, film) {
    this._comments = [
      ...this._comments,
      update
    ];

    this._notify(updateType, film);
  }

  deleteComment(updateType, update, film) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType, film);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          commentMessage: comment.comment,
          date: new Date(comment.date),
          emoji: comment.emotion
        }
    );

    delete adaptedComment.comment;
    delete adaptedComment.emotion;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          "comment": comment.commentMessage,
          "date": comment.date instanceof Date ? comment.date.toISOString() : null,
          "emotion": comment.emoji
        }
    );

    delete adaptedComment.commentMessage;
    delete adaptedComment.emoji;
    delete adaptedComment.filmId;

    return adaptedComment;
  }
}
