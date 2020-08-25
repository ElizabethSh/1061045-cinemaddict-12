import AbstractView from "./abstract.js";

const createExtraListTemplate = (header) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${header}</h2>
      <div class="films-list__container">
      </div>
    </section>`
  );
};

export default class ExtraList extends AbstractView {
  constructor(header) {
    super();
    this._header = header;
  }
  _getTemplate() {
    return createExtraListTemplate(this._header);
  }
}
