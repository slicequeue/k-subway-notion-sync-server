const Axios = require('axios');

const config = require('../config/index');

const DataType = {
  XML: 'xml',
  JSON: 'json',
}

/**
 * 요일구분코드
 */
const DailyTypeCode = {
  /** 평일 */
  WEEKDAY: '01',
  /** 토요일 */
  SATURDAY: '02',
  /** 일요일(공휴일) */
  SUNDAY: '03',
}

/**
 * 상하행구분코드
 */
const UpDownTypeCode = {
  /** 상행 - 서울방향 */
  UP: 'U', 
  /** 하행 - 서울반대방향 */
  DOWN: 'D',
}

const API_URL = 'http://apis.data.go.kr/1613000/SubwayInfoService';

const axios = Axios.create({
  baseURL: API_URL,
  params: {
    serviceKey: config.gov.apiKey,
    _type: DataType.JSON,
  }
});

const getSubwayList = async (subwayStationName, pageNo = 1, numOfRows = 10) => {
  return axios.get('/getKwrdFndSubwaySttnList', {
    params: {
      subwayStationName,
      pageNo,
      numOfRows,
    }
  });
}

class StationTimeTableItem {
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

/**
 * 지하철역별 시간표 목록조회
 * @param {string} subwayStationId *지하철역ID - 지하철역 목록조회에서 조회 가능
 * @param {string} dailyTypeCode *요일구분코드 - DataType
 * @param {string} upDownTypeCode *상하행구분코드 - UpDownTypeCode
 * @param {integer} pageNo 한 페이지 결과 수
 * @param {integer} numOfRows 페이지 번호
 * @returns 
 */
const getStationTimetableItems = async (
  subwayStationId, 
  dailyTypeCode, 
  upDownTypeCode, 
  pageNo = 1, 
  numOfRows = 10,
  filterNonStops = true,
) => {
  let res = (await axios.get('/getSubwaySttnAcctoSchdulList', {
    params: {
      subwayStationId,
      dailyTypeCode,
      upDownTypeCode,
      pageNo,
      numOfRows,
    }
  })).data;

  if (!res.response || !res.response.header || !res.response.header.resultCode || res.response.header.resultCode != '00') {
    throw Error(`gov metro api error: ${res.body}`);
  }

  let stationTimeTableItems = res.response.body.items.item.map(each => new StationTimeTableItem(each));

  if (filterNonStops) {
    stationTimeTableItems = stationTimeTableItems.filter(each => each.arrTime != '0');
  }

  return stationTimeTableItems;
}
 
module.exports = {
  getSubwayList,
  getStationTimetableItems,
  codes: {
    DailyTypeCode, 
    UpDownTypeCode,
  }
}


// const main = async () => {
//   const resSubwayList = await getSubwayList('구일');
//   console.log('resSubwayList:', resSubwayList);

//   console.log('---');

//   const filteredStationTimeTableList = await getStationTimetableItems('MTRKR10142', DailyTypeCode.WEEKDAY, UpDownTypeCode.UP, 1, 400);

//   // 정차하지 않는 경우 
//   console.log('resStationTimeTable:', filteredStationTimeTableList);
// }

// main().catch(console.error);
