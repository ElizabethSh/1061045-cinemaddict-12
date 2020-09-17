export const getRank = (films) => {
  if (films.length > 0 && films.length <= 10) {
    return `novice`;
  }

  if (films.length > 10 && films.length <= 20) {
    return `fan`;
  }

  if (films.length > 20) {
    return `movie buff`;
  }
  return ` `;
};
