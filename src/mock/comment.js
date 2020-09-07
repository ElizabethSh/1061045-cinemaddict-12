import moment from "moment";
import {getRandomInteger, generateArrayElement, generateId} from "../utils/common.js";
import {EMOJIS} from "../const.js";

const MAX_DAY_GAP = 7;

const MESSAGES = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`
];

const AUTHOR_NAMES = [
  `Tim Macoveev`,
  `John Doe`,
];

const generateCommentDate = () => {
  const daysGap = getRandomInteger(0, MAX_DAY_GAP);
  const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() - daysGap);
  return new Date(currentDate);
};

const formatDate = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

// функция генерации объекта комментария
export const generateComment = (id) => {
  const date = formatDate(generateCommentDate());
  const emoji = generateArrayElement(EMOJIS);
  const commentMessage = generateArrayElement(MESSAGES);
  const author = generateArrayElement(AUTHOR_NAMES);
  return {
    id: generateId(),
    filmId: id,
    emoji: `${emoji}.png`,
    commentMessage,
    author,
    date
  };
};
