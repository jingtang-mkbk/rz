import dayjs from 'dayjs'

export function dateformat(val) {
  return dayjs(val).format('YYYY年MM月DD日HH时mm分ss秒')
}
