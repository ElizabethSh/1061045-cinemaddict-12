import CommentView from "../view/comment.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

export default class Comment {
  constructor(commentContainer) {
    this._commentContainer = commentContainer;
    this._commentComponent = null;

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(comment) {
    this._comment = comment;

    const prevCommentComponent = this._commentComponent;
    this._commentComponent = new CommentView(this._comment);

    this._commentComponent.setCommentDeleteClickHandler(this._handleDeleteClick);

    if (prevCommentComponent === null) {
      render(this._commentContainer, this._commentComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._commentComponent, prevCommentComponent);
    remove(prevCommentComponent);
  }

  _handleDeleteClick() {
    this._destroy();
  }

  _destroy() {
    remove(this._commentComponent);
  }
}
