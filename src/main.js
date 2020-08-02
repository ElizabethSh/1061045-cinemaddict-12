import {createProfileTemplate} from "./view/profile.js";
import {createMainNavigationTemplate} from "./view/main-navigation.js";
import {createFilmsSortingTemplate} from "./view/film-sorting.js";
import {createContentTemplate} from "./view/content.js";
import {createAllFilmListTemplate} from "./view/all-film-list.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createTopRatedListTemplate} from "./view/top-rated-list.js";
import {createMostCommentedTemplate} from "./view/most-commented-list.js";
import {createMovieStatisticTemplate} from "./view/statistic.js";
import {createPopupTemplate} from "./view/popup.js";
import {createFilmInfoTemplate} from "./view/film-info.js";
import {createFilmDetailsControlsTemplate} from "./view/film-control.js";
import {createFilmCommentsTemplate} from "./view/comment.js";

const MAX_FILMS_CARD = 5;
const MAX_EXTRA_FILMS_CARD = 2;

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const footerStatistic = siteFooter.querySelector(`.footer__statistics`);

const render = (container, template, position) => {
  container.insertAdjacentHTML(position, template);
};

// header
render(siteHeader, createProfileTemplate(), `beforeend`);

// main
render(siteMain, createMainNavigationTemplate(), `beforeend`);
render(siteMain, createFilmsSortingTemplate(), `beforeend`);

render(siteMain, createContentTemplate(), `beforeend`);

const siteContent = siteMain.querySelector(`.films`);
render(siteContent, createAllFilmListTemplate(), `afterbegin`); // All films list
render(siteContent, createTopRatedListTemplate(), `beforeend`); // Top Rated films list
render(siteContent, createMostCommentedTemplate(), `beforeend`);// Most commented films list

const filmsBoard = siteContent.querySelector(`.films-list .films-list__container`);
for (let i = 0; i < MAX_FILMS_CARD; i++) {
  render(filmsBoard, createFilmCardTemplate(), `beforeend`);
}

const extraFilmsLists = siteContent.querySelectorAll(`.films-list--extra .films-list__container`);
extraFilmsLists.forEach(function (it) {
  for (let i = 0; i < MAX_EXTRA_FILMS_CARD; i++) {
    render(it, createFilmCardTemplate(), `beforeend`);
  }
});

// footer
render(footerStatistic, createMovieStatisticTemplate(), `beforeend`);

// popup
render(siteFooter, createPopupTemplate(), `afterend`);
const filmInfo = document.querySelector(`.form-details__top-container`);
render(filmInfo, createFilmInfoTemplate(), `beforeend`);
render(filmInfo, createFilmDetailsControlsTemplate(), `beforeend`);
render(filmInfo, createFilmCommentsTemplate(), `afterend`);
