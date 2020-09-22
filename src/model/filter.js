import Observer from "../utils/observer.js";
import {FilterType} from "../const.js";

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeType = FilterType.ALL;
  }

  set(updateType, filter) {
    this._activeType = filter;
    this._notify(updateType, filter);
  }

  get() {
    return this._activeType;
  }
}
