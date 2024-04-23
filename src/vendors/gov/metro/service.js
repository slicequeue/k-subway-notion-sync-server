const SearchSubwayStationItem = require('./dtos/SearchSubwayStationItem');
const SearchSubwayStationResponse = require('./dtos/SearchSubwayStationResponse');
const StationTimeTableItem = require('./dtos/StationTimeTableItem');
const StationTimeTableResponse = require('./dtos/StationTimeTableResponse');
const metroApi = require('./api');

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
  dailyTypeCode,
  upDownTypeCode,
  pageNo = 1,
  numOfRows = 10,
  filterNonArrive = true,
) {
  const body = await metroApi.getStationTimetable(subwayStationId, dailyTypeCode, upDownTypeCode, pageNo, numOfRows);
  let data = extractItemArrayOrDefualtEmptyArray(body).map(each => new StationTimeTableItem(each));

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
  getStationTimetable
}
