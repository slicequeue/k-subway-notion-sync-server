
module.exports = class StationTimeTableResponse {
  constructor({
    dailyTypeCode,
    upDownTypeCode,
    data,
    paging,
  }) {
    this.dailyTypeCode = dailyTypeCode;
    this.upDownTypeCode = upDownTypeCode;
    this.data = data;
    this.paging = paging;
  }
}
