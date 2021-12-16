import FooterStatisticView from "./view/footer-statistic.js";
import StatisticsView from "./view/statistics.js";
import FilterPresenter from "./presenter/filter.js";
import MovieListPresenter from "./presenter/movie-list.js";
import FilmsModel from "./model/films.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";
import {remove, render, RenderPosition} from "./utils/render.js";
import {MenuItem, StatsPeriod, UpdateType} from "./const.js";
import Api from "./api/api.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const AUTORIZATION = `Basic 0K3RgtC+IPCfkJQg0L3QsCDRgdC80LXRhSE=`;
const END_POINT = `https://15.ecmascript.pages.academy/cinemaddict`;
const STORE_FILMS_PREFIX = `cinemaddict-films-localstorage`;
const STORE_COMMENTS_PREFIX = `cinemaddict-comments-localstorage`;
const STORE_VER = `v15`;
const STORE_FILMS_NAME = `${STORE_FILMS_PREFIX}-${STORE_VER}`;
const STORE_COMMENTS_NAME = `${STORE_COMMENTS_PREFIX}-${STORE_VER}`;

const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const footerStatistic = siteFooter.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTORIZATION);
const filmsStore = new Store(STORE_FILMS_NAME, window.localStorage);
const commentsStore = new Store(STORE_COMMENTS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, filmsStore, commentsStore);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const movieListPresenter = new MovieListPresenter(siteMain, filmsModel, commentsModel, filterModel, apiWithProvider);

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

apiWithProvider.getFilms()
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

window.addEventListener(`load`, () => {
  // регистрируем serviceWorker
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
