import he from "he";
import Abstract from "./abstract.js";

const createCommentItemTemplate = (comment) => {
  const {emoji, date, commentMessage, author} = comment;
  return (
    `<li class="film-details__comment">
       <span class="film-details__comment-emoji">
         <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji-smile">
       </span>
       <div>
         <p class="film-details__comment-text">${he.encode(commentMessage)}</p>
         <p class="film-details__comment-info">
           <span class="film-details__comment-author">${author}</span>
           <span class="film-details__comment-day">${date}</span>
           <button class="film-details__comment-delete">Delete</button>
         </p>
       </div>
     </li>`
  );
};

export default class Comment extends Abstract {
  constructor(comment) {
    super();
    this._comment = comment;

    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
  }

  _getTemplate() {
    return createCommentItemTemplate(this._comment);
  }

  _commentDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick();
  }

  setCommentDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement()
        .querySelector(`.film-details__comment-delete`)
        .addEventListener(`click`, this._commentDeleteClickHandler);
  }
}
