import he from "he";
import SmartView from "./smart.js";
import {formatDate, capitalizeFirstLetter} from "../utils/common.js";

const createCommentItemTemplate = (comment) => {
  const {emoji, date, commentMessage, author, isDisabled, isDeleting} = comment;
  const commentDate = formatDate(date);
  const userComment = capitalizeFirstLetter(commentMessage);
  return (
    `<li class="film-details__comment">
       <span class="film-details__comment-emoji">
         <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
       </span>
       <div>
         <p class="film-details__comment-text">${he.encode(userComment)}</p>
         <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${commentDate}</span>
            <button class="film-details__comment-delete" ${isDisabled ? `disabled` : ``}>
              ${isDeleting ? `Deleting...` : `Delete`}
            </button>
         </p>
       </div>
     </li>`
  );
};

export default class Comment extends SmartView {
  constructor(comment) {
    super();
    this._data = Comment.parseCommentToData(comment);

    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
  }

  restoreHandlers() {
    this.setDeleteButtonClickHandler(this._callback.deleteClick);
  }

  _getTemplate() {
    return createCommentItemTemplate(this._data);
  }

  setDeleteButtonClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement()
        .querySelector(`.film-details__comment-delete`)
        .addEventListener(`click`, this._deleteButtonClickHandler);
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(Comment.parseDataToComment(this._data));
  }

  static parseCommentToData(comment) {
    return Object.assign(
        {},
        comment,
        {
          isDisabled: false,
          isDeleting: false
        }
    );
  }

  static parseDataToComment(data) {
    data = Object.assign({}, data);

    delete data.isDeleting;

    return data;
  }
}
