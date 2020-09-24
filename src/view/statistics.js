import SmartView from "./smart.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {StatsPeriod} from "../const.js";
import {getRank, formatUserRank} from "../utils/user-rank.js";
import {
  convertTextToKebabCase,
  convertToTextFromKebabCase
} from "../utils/common.js";
import {
  countWatchedFilmsInDateRange,
  getSortedGenres,
  getHoursAndMinutes,
  getTopGenre,
  getTotalDuration,
} from "../utils/stats.js";

const BAR_HEIGHT = 50;
const timeIntervals = Object.values(StatsPeriod);

const renderFilmsByGenresChart = (statisticCtx, watchedFilms, period) => {
  const watchedFilmsInDateRange = countWatchedFilmsInDateRange(watchedFilms, period);
  const sortedGenres = new Map(getSortedGenres(watchedFilmsInDateRange));
  const labels = [...sortedGenres.keys()];
  const data = [...sortedGenres.values()];
  statisticCtx.height = BAR_HEIGHT * labels.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createPeriodMenuItemTemplate = (timeInterval, activePeriod) => {
  const periodValue = convertTextToKebabCase(timeInterval);
  return `<input type="radio"
    class="statistic__filters-input visually-hidden"
    name="statistic-filter"
    id="statistic-${periodValue}"
    value="${periodValue}"
    ${timeInterval === activePeriod ? `checked` : ``}
    >
  <label for="statistic-${periodValue}" class="statistic__filters-label">
    ${timeInterval}
  </label>`;
};

const createPeriodMenuTemplate = (activePeriod) => {
  return timeIntervals.map((timeInterval) => createPeriodMenuItemTemplate(timeInterval, activePeriod)).join(``);
};

const createStatisticsTemplate = (data) => {
  const {watchedFilms, period} = data;
  const watchedFilmsInDateRange = countWatchedFilmsInDateRange(watchedFilms, period);

  const watchedFilmsCount = watchedFilmsInDateRange.length;
  const totalDuration = getHoursAndMinutes(getTotalDuration(watchedFilmsInDateRange));
  const {hours, minutes} = totalDuration;
  const topGenre = getTopGenre(watchedFilmsInDateRange);
  const rank = formatUserRank(getRank(watchedFilms));

  const periodsMenuTemplate = createPeriodMenuTemplate(period);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      ${periodsMenuTemplate}
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount}<span class="statistic__item-description">movies</span>
        </p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span>${minutes}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
</section>`;
};

export default class Statistics extends SmartView {
  constructor(films, period) {
    super();
    // watchedFilms - всего просмотрено фильмов за все время
    const watchedFilms = films.filter((film) => film.isHistory);

    this._data = {
      watchedFilms,
      period
    };

    this._periodClickHandler = this._periodClickHandler.bind(this);
    this._setCharts();
    this._setPeriod();
    this._filmsByGenresChart = null;
  }

  removeElement() {
    super.removeElement();

    if (this._filmsByGenresChart !== null) {
      this._filmsByGenresChart = null;
    }
  }

  restoreHandlers() {
    this._setCharts();
    this._setPeriod();
  }

  _getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  _setPeriod() {
    this.getElement()
        .querySelector(`.statistic__filters`)
        .addEventListener(`change`, this._periodClickHandler);
  }

  _setCharts() {
    if (this._filmsByGenresChart !== null) {
      this._filmsByGenresChart = null;
    }

    const {watchedFilms, period} = this._data;

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    this._filmsByGenresChart = renderFilmsByGenresChart(statisticCtx, watchedFilms, period);
  }

  _periodClickHandler(evt) {
    evt.preventDefault();
    const periodValue = evt.target.value;
    const adaptedValue = convertToTextFromKebabCase(periodValue);

    this.updateData({
      period: adaptedValue
    });
  }
}
