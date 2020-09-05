import ProfileView from "./view/profile.js";
import StatisticView from "./view/statistic.js";
import MovieListPresenter from "./presenter/movie-list.js";
import FilmsModel from "./model/films.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";
import {generateFilm} from "./mock/film-card-mock";
import {generateComment} from "./mock/comment.js";
import {render, RenderPosition} from "./utils/render.js";

const MAX_FILMS_CARD = 11; // 11, чтобы было видно как работают фильтры
const MAX_COMMENT_AMOUNT = 5;

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const footerStatistic = siteFooter.querySelector(`.footer__statistics`);

const films = new Array(MAX_FILMS_CARD).fill().map(generateFilm);

const comments = [];

films.forEach((film) => {
  const randomNumber = Math.round(Math.random() * MAX_COMMENT_AMOUNT);
  const filmID = film.id;
  const filmComments = new Array(randomNumber).fill().map(() => generateComment(filmID));
  filmComments.forEach((comment) => comments.push(comment));
});

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

const movieListPresenter = new MovieListPresenter(siteMain, filmsModel, commentsModel, filterModel);

// HEADER
render(siteHeader, new ProfileView(), RenderPosition.BEFOREEND);

// MAIN
movieListPresenter.init();

// FOOTER
render(footerStatistic, new StatisticView(films).getElement(), RenderPosition.BEFOREEND);
