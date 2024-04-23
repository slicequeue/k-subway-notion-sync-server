
module.exports = class StationTimeTableResponse {
  constructor({
    data,
    paging,
  }) {
    this.data = data;
    this.paging = paging;
  }
}
