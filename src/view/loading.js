import AbstractView from "./abstract.js";

const createLoadingMessageTemplate = () => {
  return `<h2 class="films-list__title">Loading...</h2>`;
};

export default class Loading extends AbstractView {
  _getTemplate() {
    return createLoadingMessageTemplate();
  }
}
