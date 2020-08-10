import {createProfileTemplate} from "./view/profile.js";
import {createMainNavigationTemplate} from "./view/main-navigation.js";
import {createFilmsSortingTemplate} from "./view/film-sorting.js";
import {createContentTemplate} from "./view/content.js";
import {createAllFilmListTemplate} from "./view/all-film-list.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createTopRatedListTemplate} from "./view/top-rated-list.js";
import {createMostCommentedTemplate} from "./view/most-commented-list.js";
import {createMovieStatisticTemplate} from "./view/statistic.js";
import {createPopupTemplate} from "./view/popup.js";
import {createFilmInfoTemplate} from "./view/film-info.js";
import {createFilmDetailsControlsTemplate} from "./view/film-control.js";
import {createFilmCommentsTemplate} from "./view/comment.js";
import {generateFilm} from "./mock/film-card-mock";
import {generateFilters} from "./mock/filter-mock";

const MAX_FILMS_CARD = 11; // 11, чтобы было видно как работают фильтры
const MAX_FILMS_PER_STEP = 5;
const MAX_EXTRA_FILMS_CARD = 2;

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const footerStatistic = siteFooter.querySelector(`.footer__statistics`);

const films = new Array(MAX_FILMS_CARD).fill().map(generateFilm);
const filters = generateFilters(films);

const render = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

// header
render(siteHeader, createProfileTemplate(), `beforeend`);

// main
render(siteMain, createMainNavigationTemplate(filters), `beforeend`);
render(siteMain, createFilmsSortingTemplate(), `beforeend`);

render(siteMain, createContentTemplate(), `beforeend`);

const siteContent = siteMain.querySelector(`.films`);
render(siteContent, createAllFilmListTemplate(), `afterbegin`); // All films list
render(siteContent, createTopRatedListTemplate(), `beforeend`); // Top Rated films list
render(siteContent, createMostCommentedTemplate(), `beforeend`);// Most commented films list

const filmsBoard = siteContent.querySelector(`.films-list .films-list__container`);

// создание карточек фильмов в разделе "Все фильмы"
for (let i = 0; i < Math.min(films.length, MAX_FILMS_PER_STEP); i++) {
  render(filmsBoard, createFilmCardTemplate(films[i]), `beforeend`);
}

// если карточек больше 5, показывает 5 карточек и кнопку Show more
if (films.length > MAX_FILMS_PER_STEP) {
  let renderedFilmAmount = MAX_FILMS_PER_STEP;
  render(filmsBoard, createShowMoreButtonTemplate(), `afterend`);

  const showMoreButton = siteContent.querySelector(`.films-list__show-more`);

  // функция для дополнительного показа карточек по 5 штук
  const showCards = () => {
    films.slice(renderedFilmAmount, renderedFilmAmount + MAX_FILMS_PER_STEP)
      .forEach((film) => render(filmsBoard, createFilmCardTemplate(film), `beforeend`));

    renderedFilmAmount += MAX_FILMS_PER_STEP;

    // если показаны все имеющиеся карточки, удаляет кнопку
    if (films.length <= renderedFilmAmount) {
      showMoreButton.remove();
    }
  };

  const onShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    showCards();
  };

  showMoreButton.addEventListener(`click`, onShowMoreButtonClick); // для дальнейшего удаления этого обработчика
}

const extraFilmsLists = siteContent.querySelectorAll(`.films-list--extra .films-list__container`);
extraFilmsLists.forEach(function (it) {
  for (let i = 0; i < MAX_EXTRA_FILMS_CARD; i++) {
    render(it, createFilmCardTemplate(films[i]), `beforeend`);
  }
});

// footer
render(footerStatistic, createMovieStatisticTemplate(films), `beforeend`);

// popup
render(siteFooter, createPopupTemplate(), `afterend`);
const filmInfo = document.querySelector(`.form-details__top-container`);
render(filmInfo, createFilmInfoTemplate(films[0]), `beforeend`);
render(filmInfo, createFilmDetailsControlsTemplate(), `beforeend`);
render(filmInfo, createFilmCommentsTemplate(films[0]), `afterend`);
