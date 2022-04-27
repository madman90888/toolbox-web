/**
 * 将时间解析为字符串
 * @param Object|string|number time 日期
 * @param string cFormat  格式
 * @return string|null  返回格式化字符串
 */
 export function parseTime(time: string | number | Date, cFormat?: string): string | void {
  // 传入时间是否为空
  if (arguments.length === 0 || !time) {
    return;
  }
  // 若没有指定时间格式，则使用默认
  const format: string = cFormat || 'y-M-d h:m:s'
  let date: Date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        //time = time.replace(/-/gm, '/')
      }
    }

    // 数字格式判断是否精确到毫秒
    if (typeof time == 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }

  // 定义格式化时间
  const formatObj: any = {
    y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }

  // 正则替换
  const time_str: string = format.replace(/([yMdhmsa])+/g, (result, key) => {
    const value: number = formatObj[key]
    // getDay() 星期天返回0
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 域名验证规则
 */
export const validateZoneName = (rule: any, value: any, callback: any): void => {
  if (!value) {
    callback(new Error("域名列表不能为空"));
  }
  const arr = value.trim().split(/\s+/)
  if (arr.length < 1) {
    return callback(new Error("域名列表不能为空"))
  }
  for (const name of arr) {
    if (!/^\w+\.\w+$/.test(name)) {
      return callback(new Error("格式错误：" + name))
    }
  }
  callback()
}

/**
 * 将域名字符串切割为数组
 * @param nameStr 域名字符串
 * @returns 
 */
export const splitZoneName = (nameStr: string): string[] => {
  return Array.from(new Set(nameStr.trim().split(/\s+/)))
}