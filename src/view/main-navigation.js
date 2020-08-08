const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;
  return `<a href="#${name}" class="main-navigation__item">${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>`;
};

export const createMainNavigationTemplate = (filters) => {
  const filterTemplate = filters.map((filter) => createFilterItemTemplate(filter)).join(``);
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};
