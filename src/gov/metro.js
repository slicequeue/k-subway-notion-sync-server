const Axios = require('axios');

const config = require('../config/index');
const StationTimeTableItem = require('../dto/StationTimeTableItem');
const StationTimeTableResponse = require('../dto/StationTimeTableResponse');
const SearchSubwayStationResponse = require('../dto/SearchSubwayStationResponse');
const SearchSubwayStationItem = require('../dto/SearchSubwayStationItem');

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

const extractResponseBody = (res) => {
  const data = res.data;
  if (!data.response || !data.response.header || !data.response.header.resultCode || data.response.header.resultCode != '00') {
    throw Error(`gov metro api error: ${data.body}`);
  }
  return data.response.body;
}

const axios = Axios.create({
  baseURL: API_URL,
  params: {
    serviceKey: config.gov.apiKey,
    _type: DataType.JSON,
  }
});

const extractItemArrayOrDefualtEmptyArray = (body) => {
  let result = [];
  if (body && body.items) {
    if (!Array.isArray(body.items.item)) {
      result = [body.items.item];
    } else {
      result = body.items.item;
    }
  }
  return result;
}

const extractPagingInfoOrDefaultEmptyObject = (body, appendObject = {}) => {
  let paging = {
    numOfRows: Number(body.numOfRows),
    pageNo: body.pageNo,
    totalCount: body.totalCount,
  }

  Object.keys(appendObject).forEach(key => {
    paging[key] = appendObject[key];
  });

  return paging;
}

async function getSubwayList(subwayStationName, pageNo = 1, numOfRows = 10) {
  const res = await axios.get('/getKwrdFndSubwaySttnList', {
    params: {
      subwayStationName,
      pageNo,
      numOfRows,
    }
  });
  const body = extractResponseBody(res);
  const data = extractItemArrayOrDefualtEmptyArray(body).map(each => new SearchSubwayStationItem(each));
  const paging = extractPagingInfoOrDefaultEmptyObject(body);
  return new SearchSubwayStationResponse({data, paging});
}

/**
 * 지하철역별 시간표 목록조회
 * @param {string} subwayStationId *지하철역ID - 지하철역 목록조회에서 조회 가능
 * @param {string} dailyTypeCode *요일구분코드 - DataType
 * @param {string} upDownTypeCode *상하행구분코드 - UpDownTypeCode
 * @param {integer} pageNo 한 페이지 결과 수
 * @param {integer} numOfRows 페이지 번호
 * @param {boolean} filterNonArrive 정차하지 않는 정보 필터링 여부
 * @returns 
 */
async function getStationTimetable(
  subwayStationId,
  dailyTypeCode,
  upDownTypeCode,
  pageNo = 1,
  numOfRows = 10,
  filterNonArrive = true,
) {

  let res = (await axios.get('/getSubwaySttnAcctoSchdulList', {
    params: {
      subwayStationId,
      dailyTypeCode,
      upDownTypeCode,
      pageNo,
      numOfRows,
    }
  }));

  const body = extractResponseBody(res);
  let data = extractItemArrayOrDefualtEmptyArray(body)
    .map(each => new StationTimeTableItem(each));

  let filteredCount = 0;
  if (filterNonArrive) {
    data = data.filter(each => each.arrTime != '0');
    filteredCount = data.length;
  }

  const paging = extractPagingInfoOrDefaultEmptyObject(body, {
    numOfRows,
    filteredNumOfRows: numOfRows - filteredCount,
    filterNonArrive,
  });

  return new StationTimeTableResponse({ data, paging });
}

module.exports = {
  getSubwayList,
  getStationTimetable,
  codes: {
    DailyTypeCode,
    UpDownTypeCode,
  }
}
