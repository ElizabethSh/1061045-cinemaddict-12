import FooterStatisticView from "./view/footer-statistic.js";
import StatisticsView from "./view/statistics.js";
import MovieListPresenter from "./presenter/movie-list.js";
import FilmsModel from "./model/films.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";
import {remove, render, RenderPosition} from "./utils/render.js";
import {MenuItem, StatsPeriod, UpdateType} from "./const.js";
import Api from "./api.js";
import FilterPresenter from "./presenter/filter.js";

const AUTORIZATION = `Basic 4h7fbdskj854j`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const footerStatistic = siteFooter.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const movieListPresenter = new MovieListPresenter(siteMain, filmsModel, commentsModel, filterModel, api);

// MAIN-NAVIGATION
let statisticsComponent = null;

const handleSiteMenuClick = (menuType, filterType) => {
  switch (menuType) {
    case MenuItem.STATISTICS:
      // Скрыть доску
      movieListPresenter.destroy();

      // Показать статистику
      statisticsComponent = new StatisticsView(filmsModel.get(), StatsPeriod.ALL_TIME);
      render(siteMain, statisticsComponent.getElement(), RenderPosition.BEFOREEND);
      break;


    case MenuItem.FILTERS:
      // Скрыть статистику
      remove(statisticsComponent);
      movieListPresenter.destroy();

      // Показать доску c выбранным фильтром
      filterModel.set(UpdateType.MAJOR, filterType);
      movieListPresenter.init();
  }
};

const filterPresenter = new FilterPresenter(siteMain, filterModel, filmsModel, handleSiteMenuClick);
filterPresenter.init();

// MOVIE-LIST
movieListPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.set(UpdateType.INIT, films);

    movieListPresenter.renderProfile();
    render(footerStatistic, new FooterStatisticView(filmsModel.get()), RenderPosition.BEFOREEND);
  })
  .catch(() => {
    filmsModel.set(UpdateType.INIT, []);
    movieListPresenter.renderProfile();
    render(footerStatistic, new FooterStatisticView(filmsModel.get()), RenderPosition.BEFOREEND);
  });
