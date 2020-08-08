import {getRandomInteger} from "../utils.js";

const generateIndex = (array) => {
  const index = getRandomInteger(0, array.length - 1);
  return index;
};

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

  return filmTitles[generateIndex(filmTitles)];
};

const generatePoster = () => {
  const posters = [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`
  ];

  return posters[generateIndex(posters)];
};

const generateDescription = () => {
  const maxSentensies = 5;
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
  const sentencies = text.split(`.`);
  const indexes = [];
  for (let i = 0; i < getRandomInteger(1, maxSentensies); i++) {
    indexes.push(getRandomInteger(0, sentencies.length - 1));
  }
  const description = [];
  indexes.forEach((index) => {
    description.push(sentencies[index]);
  });
  return description.join(`.`);
};

const generateDate = () => {
  const maxDayGap = 7;
  const daysGap = getRandomInteger(0, maxDayGap);
  const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() - daysGap);
  return new Date(currentDate);
};

const formatDate = (date) => {
  const dd = date.getDate();
  const mm = date.getMonth();
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${year}/${mm}/${dd} ${hour}:${minutes}`;
};

const generateEmoji = () => {
  const emojis = [`smile`, `sleeping`, `puke`, `angry`];
  return emojis[generateIndex(emojis)];
};

const generateCommentMessage = () => {
  const messages = [
    `Interesting setting and a good cast`,
    `Booooooooooring`,
    `Very very old. Meh`,
    `Almost two hours? Seriously?`
  ];
  return messages[generateIndex(messages)];
};

const generateAutorName = () => {
  const autorNames = [
    `Tim Macoveev`,
    `John Doe`,
  ];
  return autorNames[generateIndex(autorNames)];
};

const generateComment = () => {
  const date = formatDate(generateDate());
  const emoji = generateEmoji();
  const commentMessage = generateCommentMessage();
  const author = generateAutorName();
  return {
    emoji: `${emoji}.png`,
    commentMessage,
    author,
    date
  };
};

export const generateFilm = () => {
  const title = generateFilmTitle();
  const description = generateDescription();
  const poster = generatePoster();
  const maxCommentAmount = 5;
  const randomNumber = Math.round(Math.random() * maxCommentAmount);
  const comments = new Array(randomNumber).fill().map(generateComment);

  return {
    title, // Название фильма
    poster, // изображение постера фильма
    description, // От 1 до 5 случайных предложений из текста
    comments
  };
};
