import Abstract from "../view/abstract.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export const render = (container, child, position) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  if (child instanceof Abstract) {
    child = child.getElement();
  }
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
    case RenderPosition.AFTEREND:
      container.after(child);
  }
};

export const renderTemplate = (container, template, position) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }
  container.insertAdjacentHTML(position, template);
};

// функция превращает шаблонную строку с разметкой в DOM-элемент
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }
  component.getElement().remove();
  component.removeElement();
};

