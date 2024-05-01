
/**
 * 요일구분코드
 */
const DailyTypeCode = Object.freeze({
  /** 평일 */
  WEEKDAY: '01',
  /** 토요일 */
  SATURDAY: '02',
  /** 일요일(공휴일) */
  SUNDAY: '03',
});

/**
 * 상하행구분코드
 */
const UpDownTypeCode = Object.freeze({
  /** 상행 - 서울방향 */
  UP: 'U',
  /** 하행 - 서울반대방향 */
  DOWN: 'D',
});

module.exports = {
  DailyTypeCode,
  UpDownTypeCode,
}
