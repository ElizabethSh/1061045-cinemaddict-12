import {EMOJIS} from "../const.js";
import AbstractView from "./abstract.js";

const createCommentItemTemplate = (comment) => {
  const {emoji, date, commentMessage, author} = comment;
  return `
    <li class="film-details__comment">
       <span class="film-details__comment-emoji">
         <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji-smile">
       </span>
       <div>
         <p class="film-details__comment-text">${commentMessage}</p>
         <p class="film-details__comment-info">
           <span class="film-details__comment-author">${author}</span>
           <span class="film-details__comment-day">${date}</span>
           <button class="film-details__comment-delete">Delete</button>
         </p>
       </div>
     </li>
  `;
};

const createEmojiItemTemplate = (emoji) => {
  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji-${emoji}">
    </label>`;
};

const createEmojisTemplate = () => {
  return EMOJIS.map((emoji) => createEmojiItemTemplate(emoji)).join(``);
};

const createFilmCommentsTemplate = (film) => {

  const createCommentsTemplate = () => {
    return film.comments.map((comment) => createCommentItemTemplate(comment)).join(``);
  };

  const commentAmount = film.comments.length;
  const commentTemplate = createCommentsTemplate();
  const emojisTemplate = createEmojisTemplate();

  return (
    `<div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentAmount}</span></h3>

        <ul class="film-details__comments-list">
          ${commentTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojisTemplate}
          </div>
        </div>
      </section>
    </div>`
  );
};

export default class Comment extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._emojiClickHandler = this._emojiClickHandler.bind(this);

    this.getElement()
        .querySelector(`.film-details__emoji-list`)
        .addEventListener(`change`, this._emojiClickHandler);
  }

  _getTemplate() {
    return createFilmCommentsTemplate(this._film);
  }

  _emojiClickHandler(evt) {
    const userEmoji = this.getElement()
                          .querySelector(`.film-details__add-emoji-label`);
    const emoji = evt.target.value;

    if (evt.target.tagName !== `INPUT`) {
      return;
    }
    evt.preventDefault();

    userEmoji.innerHTML = `<img src="./images/emoji/${emoji}.png" width="60" height="60" alt="emoji-${emoji}">`;
  }
}
