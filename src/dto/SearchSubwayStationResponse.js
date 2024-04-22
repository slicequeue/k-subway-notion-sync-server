
module.exports = class SearchSubwayStationResponse {
  constructor({subwayRouteName, subwayStationId, subwayStationName}) {
    this.routeName = subwayRouteName;
    this.stationId = subwayStationId;
    this.stationName = subwayStationName;
  }    
}
