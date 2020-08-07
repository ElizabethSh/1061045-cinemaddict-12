import {getRandomInteger} from "../utils.js";

const generateFilmTitle = () => {
  const filmTitles = [
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`,
    `Popeye the Sailor Meets Sindbad the Sailor`,
    `Made for Each Other`,
    `The Great Flamarion`
  ];
  const index = getRandomInteger(0, filmTitles.length - 1);
  return filmTitles[index];
};

const generateDescription = () => {
  const maxSentensies = 5;
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
  const sentencies = text.split(`.`);
  const indexes = [];
  for (let i = 0; i < getRandomInteger(1, maxSentensies); i++) {
    indexes.push(getRandomInteger(0, sentencies.length - 1));
  }
};

// const generateDate = () => {
//   const date = new Date();
//   date.setHours()
//   console.log(date);
// };

const generateComment = () => {
  const emojis = [`smile`, `sleeping`, `puke`, `angry`];
  const emoji = emojis[getRandomInteger(0, emojis.length - 1)];
  return {
    emoji: `${emoji}.png`,
    commentMessage: `commentMessage`,
    author: `author`,
    // data: generateDate()
  };
};

export const generateFilm = () => {
  const maxCommentAmount = 5;
  const title = generateFilmTitle();
  const description = generateDescription();
  const randomNumber = Math.round(Math.random() * maxCommentAmount);
  const comments = new Array(randomNumber).fill().map(generateComment);
  // console.log(title);
  // const titles = title.toLowerCase().split(` `).join(`-`);
  // console.log(titles);
  return {
    title, // Название фильма
    poster: `poster`, // изображение постера фильма
    description, // От 1 до 5 случайных предложений из текста
    comments
  };
};

generateFilm();
