const SearchSubwayStationItem = require('./dtos/SearchSubwayStationItem');
const SearchSubwayStationResponse = require('./dtos/SearchSubwayStationResponse');
const StationTimeTableItem = require('./dtos/StationTimeTableItem');
const StationTimeTableResponse = require('./dtos/StationTimeTableResponse');
const metroApi = require('./api');
const {
  DailyTypeCode,
  UpDownTypeCode,
} = metroApi.codes;

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

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

async function getStationTimetable(
  subwayStationId,
  dailyTypeCode,
  upDownTypeCode,
  pageNo = 1,
  numOfRows = 10,
  filterNonArrive = true,
) {
  const body = await metroApi.getStationTimetable(subwayStationId, dailyTypeCode, upDownTypeCode, pageNo, numOfRows);
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
  return new StationTimeTableResponse({ data, paging });
}

function generateCombinations(arrays, index = 0) {
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
) {
  const dailyTypeCodes = Object.values(DailyTypeCode);
  const upDownTypeCodes = Object.values(UpDownTypeCode);

  const allArgs = generateCombinations([dailyTypeCodes, upDownTypeCodes]);

  for (let args of allArgs) {
    const result = await getStationTimetable(subwayStationId, args[0], args[1], pageNo, numOfRows, filterNonArrive);
    console.log(result);
  }

}

module.exports = {
  getSubwayList,
  getStationTimetable,
  getStationAllTimetable: getStationAllArgsTimetable,
}

const main = async () => {
  // const dailyTypeCodes = Object.values(DailyTypeCode);
  // const upDownTypeCodes = Object.values(UpDownTypeCode);

  // console.log(generateCombinations([dailyTypeCodes, upDownTypeCodes]));
  const subwayStationId = 'MTRS152548';
  getStationAllArgsTimetable(subwayStationId);
}

main().catch(console.error);
