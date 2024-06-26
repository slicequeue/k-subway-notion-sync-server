
const convertDailyTypeCode = (dailyTypeCode) => {
  switch (dailyTypeCode) {
    case '01', 'WEEKDAY':
      return '평일';
    case '02', 'SATURDAY':
      return '토요일';
    case '03', 'SUNDAY':
      return '공휴일';
    default:
      throw new Error(`convertDailyTypeCode 없는 형식: ${dailyTypeCode}`);
  }
}

const convertUpDownTypeCode = (upDownTypeCode) => {
  switch (upDownTypeCode) {
    case 'U', 'UP': //, 'u':
      return '상행';
    case 'D', 'DOWN':
      return '하행';
    default:
      throw new Error(`convertUpDownTypeCode 없는 형식: ${upDownTypeCode}`)
  }
}

const convertHHMMSS = (plainTimeValue) => {
  let strValue = typeof (plainTimeValue) === 'string' ? plainTimeValue : String(plainTimeValue);

  if (strValue.length !== 6) {
    console.error('strValue:', strValue);
    throw new Error("잘못된 시간 형식입니다. 6자리 문자열이 필요합니다.");
  }

  const hours = strValue.slice(0, 2);
  const minutes = strValue.slice(2, 4);
  const seconds = strValue.slice(4, 6);

  return `${hours}:${minutes}:${seconds}`;
}

const convertEndSubwayStation = (endSubwayStationNm, endSubwayStationId) => {
  let endSubwayStationName = endSubwayStationNm ? endSubwayStationNm : endSubwayStationId;
  return endSubwayStationName ? endSubwayStationName : '';
}

const stationTimetableItemMapper = {
  toNotionProperties: (stationTimetableItem) => {
    const {
      arrTime,
      dailyTypeCode,
      depTime,
      endSubwayStationId,
      endSubwayStationNm,
      upDownTypeCode,
      // subwayRouteId, subwayStationId, subwayStationNm,
    } = stationTimetableItem;

    return {
      "역도착시간(HH:MM:SS)": {
        title: [
          {
            text: {
              content: convertHHMMSS(arrTime),
            },
          },
        ],
      },
      "역출발시간(HH:MM:SS)": {
        rich_text: [
          {
            text: {
              content: (depTime != '0' && depTime.length == 6) ? convertHHMMSS(depTime) : String(depTime),
            },
          },
        ],
      },
      "평일/토요일/공휴일": {
        select: {
          name: convertDailyTypeCode(dailyTypeCode),
        },
      },
      "상행/하행": {
        select: {
          name: convertUpDownTypeCode(upDownTypeCode),
        },
      },
      "종착지": {
        rich_text: [
          {
            text: {
              content: convertEndSubwayStation(endSubwayStationNm, endSubwayStationId),
            },
          },
        ],
      },
    }
  }
}

module.exports = {
  stationTimetableItemMapper,
}
