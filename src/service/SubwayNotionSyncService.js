
const config = require('../config');
const metroApi = require('../gov/metro');
const notionService = require('../notion/service');
const { stationTimetableItemMapper } = require('./mapper');

const defaultStationId = 'MTRKR10142'; // 구일역
const defaultDailyCode = metroApi.codes.DailyTypeCode.WEEKDAY;
const defaultUpDownCode = metroApi.codes.UpDownTypeCode.UP;
const defaultNotionDatabseId = config.notion.databaseId;

async function syncSubwayTimetableToNotion(stationId = defaultStationId, notionDatabaseId = defaultNotionDatabseId) {
  const stationTimeTableItems = await metroApi.getStationTimetableItems(stationId, defaultDailyCode, defaultUpDownCode, 1, 400, true);

  console.log(stationTimeTableItems);

  await notionService.clearDatabaseAllPages(notionDatabaseId);
  await notionService.createDatabaseAllPages({databaseId: notionDatabaseId, dataList: stationTimeTableItems, mapper: stationTimetableItemMapper.toNotionProperties })
}

module.exports = {

}

const main = async () => {
  await syncSubwayTimetableToNotion();
} 

main().catch(console.error);
