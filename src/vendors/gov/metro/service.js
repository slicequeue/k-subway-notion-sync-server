const SearchSubwayStationItem = require('./dtos/SearchSubwayStationItem');
const SearchSubwayStationResponse = require('./dtos/SearchSubwayStationResponse');
const StationTimeTableItem = require('./dtos/StationTimeTableItem');
const StationTimeTableResponse = require('./dtos/StationTimeTableResponse');
const metroApi = require('./api');
const { getKeyByValue } = require('../../../common/utils/objectUtil');
const { tic, toc, sleep } = require('../../../common/utils/timeUtil');
const { DailyTypeCode, UpDownTypeCode } = require('./types/codes');
const { getCodeValues, getCodeKeyByValue } = require('./types/utils');

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

async function getSubwayList(subwayStationName, pageNo, numOfRows) {
  const body = await metroApi.getSubwayList(subwayStationName, pageNo, numOfRows);
  const data = extractItemArrayOrDefualtEmptyArray(body).map(each => new SearchSubwayStationItem(each));
  const paging = extractPagingInfoOrDefaultEmptyObject(body);
  return new SearchSubwayStationResponse({ data, paging });
}

async function getStationTimetable(
  subwayStationId,
  dailyTypeCodeValue,
  upDownTypeCodeValue,
  pageNo = 1,
  numOfRows = 10,
  filterNonArrive = true,
) {
  const body = await metroApi.getStationTimetable(subwayStationId, dailyTypeCodeValue, upDownTypeCodeValue, pageNo, numOfRows);
  let data = extractItemArrayOrDefualtEmptyArray(body).map(each => {
    each.dailyTypeCode = getKeyByValue(DailyTypeCode, each.dailyTypeCode);
    each.upDownTypeCode = getKeyByValue(UpDownTypeCode, each.upDownTypeCode);
    return each;
  }).map(each => new StationTimeTableItem(each));

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
  return new StationTimeTableResponse({ 
    dailyTypeCode: getCodeKeyByValue(DailyTypeCode, dailyTypeCodeValue),
    upDownTypeCode: getCodeKeyByValue(UpDownTypeCode, upDownTypeCodeValue),
    data, 
    paging 
  });
}

const generateCombinations = (arrays, index = 0) => {
  if (index === arrays.length) {
    return ['']; // 조합의 종료점
  }

  const result = [];
  const nextCombinations = generateCombinations(arrays, index + 1);

  for (const item of arrays[index]) {
    for (const combination of nextCombinations) {
      result.push([item, ...combination]);
    }
  }

  return result;
}

async function getStationAllArgsTimetable(
  subwayStationId,
  pageNo = 1,
  numOfRows = 400,
  filterNonArrive = true,
  untilDelayMsec = 1000
) {
  const dailyTypeCodes  = getCodeValues(DailyTypeCode);
  const upDownTypeCodes = getCodeValues(UpDownTypeCode);

  const allArgs = generateCombinations([dailyTypeCodes, upDownTypeCodes]);
  const results = [];
  for (let args of allArgs) {
    const msec = tic();
    results.push(await getStationTimetable(subwayStationId, args[0], args[1], pageNo, numOfRows, filterNonArrive))
    const gap = toc(msec);
    if (gap < untilDelayMsec) {
      await sleep(untilDelayMsec - gap);
    }
  }
  return results;
}

module.exports = {
  getSubwayList,
  getStationTimetable,
  getStationAllArgsTimetable,
}
