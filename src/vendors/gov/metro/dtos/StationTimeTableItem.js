
module.exports = class StationTimeTableItem {
  constructor({
    arrTime,
    dailyTypeCode,
    depTime,
    endSubwayStationId,
    endSubwayStationNm,
    subwayRouteId,
    subwayStationId,
    subwayStationNm,
    upDownTypeCode,
  }) {
    this.arrTime = arrTime;
    this.dailyTypeCode = dailyTypeCode;
    this.depTime = depTime;
    this.endSubwayStationId = endSubwayStationId;
    this.endSubwayStationNm = endSubwayStationNm;
    this.subwayRouteId = subwayRouteId;
    this.subwayStationId = subwayStationId;
    this.subwayStationNm = subwayStationNm;
    this.upDownTypeCode = upDownTypeCode;
  }
}
