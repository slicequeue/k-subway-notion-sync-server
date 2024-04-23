
const config = require('../../config');
const metroApi = require('../../vendors/gov/metro/api');
const metroService = require('../../vendors/gov/metro/service');
const notionService = require('../../vendors/notion/service');
const { stationTimetableItemMapper } = require('./mapper');

const defaultStationId = 'MTRKR10142'; // 구일역
const defaultDailyCode = metroApi.codes.DailyTypeCode.WEEKDAY;
const defaultUpDownCode = metroApi.codes.UpDownTypeCode.UP;
const defaultNotionDatabseId = config.notion.databaseId;


/**
 * 지하철 시간표 노션 동기화
 * @param {string} stationId 정거장 코드
 * @param {string} dailyCodeKey 평일/토요일/공휴일 코드 - metroApi.codes.DailyTypeCode
 * @param {string} upDownCodeKey 상행/하행 코드 - metroApi.codes.UpDownTypeCode
 * @param {string} notionDatabaseId 노션 데이터베이스 아이디
 */
async function syncSubwayTimetableToNotion(
  stationId = defaultStationId, 
  dailyCode = defaultDailyCode,
  upDownCode = defaultUpDownCode,
  notionDatabaseId = defaultNotionDatabseId,
) {
  const {
    data: stationTimeTableItems
  } = await metroService.getStationTimetable(
    stationId, dailyCode, upDownCode, 1, 400, true
  );

  await notionService.clearDatabaseAllPages(notionDatabaseId);
  await notionService.createDatabaseAllPages({databaseId: notionDatabaseId, dataList: stationTimeTableItems, mapper: stationTimetableItemMapper.toNotionProperties })
}

module.exports = {
  syncSubwayTimetableToNotion,
}
