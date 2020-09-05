import {getRandomInteger, generateArrayElement} from "../utils/common.js";

const MAX_SENTENCES = 5;
const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
const MAX_FILM_DAY_GAP = 365;
const MAX_RATING = 10;

const FILM_TITLES = [
  `The Dance of Life`,
  `Sagebrush Trail`,
  `The Man with the Golden Arm`,
  `Santa Claus Conquers the Martians`,
  `Popeye the Sailor Meets Sindbad the Sailor`,
  `Made for Each Other`,
  `The Great Flamarion`
];

const POSTERS = [
  `made-for-each-other.png`,
  `popeye-meets-sinbad.png`,
  `sagebrush-trail.jpg`,
  `santa-claus-conquers-the-martians.jpg`,
  `the-dance-of-life.jpg`,
  `the-great-flamarion.jpg`,
  `the-man-with-the-golden-arm.jpg`
];

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateDescription = () => {
  const sentencies = TEXT.split(`.`);
  const indexes = [];
  for (let i = 0; i < getRandomInteger(1, MAX_SENTENCES); i++) {
    indexes.push(getRandomInteger(0, sentencies.length - 1));
  }
  const description = [];
  indexes.forEach((index) => {
    description.push(sentencies[index]);
  });
  return description.join(`.`);
};

const generateRating = () => {
  return (getRandomInteger(0, MAX_RATING - 1) + Math.random()).toFixed(1);
};

const generateFilmDate = () => {
  const daysGap = getRandomInteger(0, MAX_FILM_DAY_GAP);
  const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() - daysGap);
  return new Date(currentDate);
};

// функция генерации объекта для описания фильма
export const generateFilm = () => {
  const title = generateArrayElement(FILM_TITLES);
  const poster = generateArrayElement(POSTERS);
  const description = generateDescription();
  const rating = generateRating();
  const releaseDate = generateFilmDate();

  return {
    id: generateId(),
    title,
    poster,
    description,
    rating,
    releaseDate,
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    isHistory: Boolean(getRandomInteger(0, 1)),
    isFavorites: Boolean(getRandomInteger(0, 1))
  };
};
