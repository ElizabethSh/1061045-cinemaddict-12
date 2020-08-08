const filmToFilterMap = {
  all: (films) => films.length,
  favorites: (films) => films.filter((film) => film.isFavorite).length,
  watchlist: (films) => films.filter((film) => film.isWatchlist).length,
  history: (films) => films.filter((film) => film.isHistory).length
};

const ucFirst = (filterName) => {
  if (!filterName) {
    return filterName;
  }
  return filterName[0].toUpperCase() + filterName.slice(1);
};

export const generateFilters = (films) => {
  return Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: ucFirst(filterName),
      count: countFilms(films)
    };
  });
};

