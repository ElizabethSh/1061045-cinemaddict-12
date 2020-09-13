import moment from "moment";

// функция превращает первую букву строки в заглавную
export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
};

export const generateCurrendDate = () => {
  const currentDate = new Date();
  return formatDate(currentDate);
};

export const formatReleaseData = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatDescription = (descriptionText) => {
  if (descriptionText.length < 140) {
    return descriptionText;
  }

  return `${descriptionText.slice(0, 139)}...`;
};

export const formatDate = (date) => {
  return moment(date).format(`YYYY/MM/DD HH:mm`);
};

// не забыть удалить!
export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const formatFilmDuration = (durationInMinutes) => {
  return moment.utc().startOf(`day`).add({minutes: durationInMinutes}).format(`H[h] mm[m]`);
};

// не забыть удалить!
export const generateArrayElement = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

// функция генерации случайного числа из диапозона
// не забыть удалить!
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};


