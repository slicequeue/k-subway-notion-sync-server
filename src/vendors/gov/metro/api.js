const Axios = require('axios');

const config = require('../../../config/index');
const { DataType } = require('./types/constants');

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

async function getSubwayList(subwayStationName, pageNo = 1, numOfRows = 10) {
  const res = await axios.get('/getKwrdFndSubwaySttnList', {
    params: {
      subwayStationName,
      pageNo,
      numOfRows,
    }
  });
  return extractResponseBody(res);
}

/**
 * 지하철역별 시간표 목록조회
 * @param {string} subwayStationId *지하철역ID - 지하철역 목록조회에서 조회 가능
 * @param {string} dailyTypeCodeValue *요일구분코드값 - DataType
 * @param {string} upDownTypeCodeValue *상하행구분코드값 - UpDownTypeCode
 * @param {integer} pageNo 한 페이지 결과 수
 * @param {integer} numOfRows 페이지 번호
 * @param {boolean} filterNonArrive 정차하지 않는 정보 필터링 여부
 * @returns 
 */
async function getStationTimetable(
  subwayStationId,
  dailyTypeCodeValue,
  upDownTypeCodeValue,
  pageNo = 1,
  numOfRows = 10,
) {

  let res = (await axios.get('/getSubwaySttnAcctoSchdulList', {
    params: {
      subwayStationId,
      dailyTypeCode: dailyTypeCodeValue,
      upDownTypeCode: upDownTypeCodeValue,
      pageNo,
      numOfRows,
    }
  }));

  return extractResponseBody(res);
}

module.exports = {
  getSubwayList,
  getStationTimetable,
}
