import nprogress from "nprogress"

// 格式化時間 -> 2023-11-16 00:12:48
const dateFormat = (time) => {
  const date = time ? time : new Date()

  const currmonth = date.getMonth() + 1
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate() // 日
  const month = currmonth < 10 ? `0${currmonth}` : currmonth // 月
  const year = date.getFullYear() // 年

  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours() // 時
  const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes() // 分
  const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds() // 秒

  return `${year}-${month}-${day} ${hours}:${minute}:${second}`
}

// 如果被拷贝中没有对时间、正则要求兼容,採用此方法
function deepClone2(obj) {
  if (obj && typeof obj === 'object') {
    var newObj = Array.isArray(obj) ? [] : {}
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === 'object') {
          newObj[key] = deepClone(obj[key])
        } else {
          newObj[key] = obj[key]
        }
      }
    }
  } else {
    console.error('输入参数为空或不为对象')
    return '输入参数为空或不为对象'
  }
  return newObj
}

// 數據深拷貝 (數據有時間格式,正則,undefined)
function deepClone(data) {
  const type = judgeType(data)
  let obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    // eslint-disable-next-line
    for (let i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    // 對原型上的方法也拷貝了....
    // eslint-disable-next-line
    for (const key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

function judgeType(obj) {
  // tostring会返回对应不同的标签的构造函数
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

// 取出localStorage
function getLocalStorage(getItemKey) {
  
  return JSON.parse(localStorage.getItem(getItemKey))
}

// 寫入localStorage
function setLocalStorage(setItemName, setItemValue) {
  const orginalData = getLocalStorage(setItemName)
  const newData = {
    ...orginalData,
    ...setItemValue
  }

  return localStorage.setItem(setItemName, JSON.stringify(newData))
}

// 移除localStorage
function removeLocalStorage(removeItemName) {
  const isArray = Array.isArray(removeItemName)

  if (!isArray) return localStorage.removeItem(removeItemName)

  removeItemName.forEach((itemName) => localStorage.removeItem(itemName))
}

// 手機鍵盤點擊“前往”收起鍵盤
function phoneLeaveKeypress() {
  $('.keypress').keypress(function (e) {
    if (e.keyCode === 13) {
      this.blur()
    }
  })
}

// 取亂數
function getRandom(min = 1, max = 20) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 顯示全局loading
function showFullLoading() {
  nprogress.start()
}

// 關閉全局loading
function hideFullLoading() {
  nprogress.done()
}

// 彈窗title name
function getTitle(key) {
  let name = ""
  const objName = {
    manager: "管理員",
    notice: "公告",
    rule: "菜單權限",
    role: "role權限",
    skus: "商品規格",
    coupon: "優惠券",
    goods: "商品管理"
  }

  if(key in objName) name = objName[key]
  return name
}

// 組合api query的數值
function queryParams(query) {
  let q = []
  for(const [key] of Object.entries(query)) {
    if(query[key]){
      // encodeURIComponent() 防止參數丟失需先轉換
      q.push(`${key}=${encodeURIComponent(query[key])}`)
    }
  }
  // 拼接出來的query值 為 ?limit=10&keyword=ceshi
  let res = q.join("&")
  res = res ? `?${res}` : ""

  return res
}

export {
  dateFormat,
  deepClone,
  deepClone2,
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  phoneLeaveKeypress,
  getRandom,
  showFullLoading,
  hideFullLoading,
  queryParams,
  getTitle
}
