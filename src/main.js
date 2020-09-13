import ProfileView from "./view/profile.js";
import FooterStatisticView from "./view/footer-statistic.js";
// import StatisticsView from "./view/stats.js";
import MovieListPresenter from "./presenter/movie-list.js";
import FilmsModel from "./model/films.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition} from "./utils/render.js";
import {MenuItem, UpdateType} from "./const.js";
import Api from "./api.js";

import FilterPresenter from "./presenter/filter.js";

const AUTORIZATION = `Basic 4h7fbdskj854j`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const footerStatistic = siteFooter.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const movieListPresenter = new MovieListPresenter(siteMain, filmsModel, commentsModel, filterModel, api);

// HEADER
render(siteHeader, new ProfileView(), RenderPosition.BEFOREEND);

// MAIN

// MAIN-NAVIGATION
const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      // Скрыть доску
      movieListPresenter.destroy();
      // Показать статистику
      break;

    case MenuItem.FILTERS:
      // Скрыть статистику
      // Показать доску c выбранным фильтром
  }
};

const filterPresenter = new FilterPresenter(siteMain, filterModel, filmsModel, handleSiteMenuClick);
filterPresenter.init();

// временно закомментировано

// const statisticsComponent = new StatisticsView();
// render(siteMain, statisticsComponent.getElement(), RenderPosition.BEFOREEND);

// MOVIE-LIST
movieListPresenter.init();

// FOOTER
render(footerStatistic, new FooterStatisticView(filmsModel.getFilms()).getElement(), RenderPosition.BEFOREEND);

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
