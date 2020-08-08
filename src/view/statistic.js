export const createMovieStatisticTemplate = (films) => {
  const filmsCount = films.length;
  return (
    `<p>${filmsCount} movies inside</p>`
  );
};
