
module.exports = class SearchSubwayStationItem {
  constructor({subwayRouteName, subwayStationId, subwayStationName}) {
    this.routeName = subwayRouteName;
    this.stationId = subwayStationId;
    this.stationName = subwayStationName;
  }    
}
