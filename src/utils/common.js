// функция превращает первую букву строки в заглавную
export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return string;
  }
  return string[0].toUpperCase() + string.slice(1);
};

// функция генерации случайного числа из диапозона
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
