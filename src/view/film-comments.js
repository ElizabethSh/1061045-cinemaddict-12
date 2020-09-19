import {EMOJIS} from "../const.js";
import AbstractView from "./abstract.js";

const BLANK_COMMENT = {
  emoji: `smile`,
  commentMessage: ``,
  date: new Date()
};

const SHAKE_ANIMATION_TIMEOUT = 600;

const createEmojiItemTemplate = (emoji) => {
  return `<input
            class="film-details__emoji-item visually-hidden"
            name="comment-emoji"
            type="radio"
            id="emoji-${emoji}"
            value="${emoji}"
          >
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji-${emoji}">
    </label>`;
};

const createEmojisTemplate = () => {
  return EMOJIS.map((emoji) => createEmojiItemTemplate(emoji)).join(``);
};

const createFilmCommentsTemplate = (comments) => {

  const commentAmount = comments.length;
  const emojisTemplate = createEmojisTemplate();

  return (
    `<div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentAmount}</span></h3>

        <ul class="film-details__comments-list">
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea
              class="film-details__comment-input"
              placeholder="Select reaction below and write comment here"
              name="comment"
              >
            </textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojisTemplate}
          </div>
        </div>

      </section>
    </div>`
  );
};

export default class FilmComments extends AbstractView {
  constructor(comments, film) {
    super();
    this._comments = comments;
    this._film = film;

    this._form = this
      .getElement()
      .querySelector(`.film-details__comment-input`);

    this._newComment = BLANK_COMMENT;
    this._data = this._newComment;

    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._commentMessageInputHandler = this._commentMessageInputHandler.bind(this);
    this._formSubmitClickHandler = this._formSubmitClickHandler.bind(this);

    this.getElement()
        .querySelector(`.film-details__emoji-list`)
        .addEventListener(`change`, this._emojiClickHandler);

    this.getElement()
        .querySelector(`.film-details__comment-input`)
        .addEventListener(`input`, this._commentMessageInputHandler);
  }

  // метод для обновления данных
  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
        {},
        this._data,
        update
    );
  }

  disableForm() {
    this._form.disabled = true;
  }

  enableForm() {
    this._form.disabled = false;
  }

  _getTemplate() {
    return createFilmCommentsTemplate(this._comments);
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
    this.updateData({
      emoji: `${emoji}`
    });
  }

  _formSubmitClickHandler(evt) {
    if ((evt.ctrlKey && evt.keyCode === 13) || (evt.keyCode === 13 && evt.metaKey)) {
      evt.preventDefault();
      this._callback.formSubmit(FilmComments.parseCommentToData(this._data));
    }
  }

  _commentMessageInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      commentMessage: evt.target.value
    });
  }

  setFormSubmitClickHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement()
        .querySelector(`.film-details__comment-input`)
        .addEventListener(`keydown`, this._formSubmitClickHandler);
  }

  shake() {
    this
      .getElement()
      .querySelector(`.film-details__comment-label`)
      .style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this
        .getElement()
        .querySelector(`.film-details__comment-label`)
        .style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  static parseCommentToData(newComment) {
    return Object.assign(
        {},
        newComment
    );
  }

}
