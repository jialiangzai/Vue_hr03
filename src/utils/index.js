/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        // win10报错就是丢包了可以注释或者重新下载
        // time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}
// 处理树形结构
// 把后端反过来的平铺数组数据处理为tree组件需要的树形数据
/**
 *
 * @param {*} list 要转换的平铺老数组
 * 转换为 [{name:'',children:''}]
 * treeList存储新的树形结构数据
 * map映射 子pid----》父id 公司的pid是-1 父无pid即''空字符串
 * 根据map映射关系去寻找对应的父级
 */
export function tranListToTreeData (list) {
  const reeList = []
  const map = {}
  list.forEach(item => {
    map[item.id] = item
  })
  // 小蝌蚪找爸爸
  list.forEach(item => {
    // 排除公司
    if (item.pid === '-1') return
    // parent存在子部门虚拟父部门节点
    const parent = map[item.pid]
    if (parent) {
      // 判断是否存在children 首次不存在初始化，之后就push
      // 这里也是为什么不能连续调两次出错原因：list循环中改变了children ;饿了么组件库有内置for递归循环定义了一个键不可重复
      if (!parent.children) {
        parent.children = []
      }
      // 是 且子部门pid= 父部门的id
      parent.children.push(item)
    } else {
      // 顶级部门
      reeList.push(item)
    }
  })
  // console.table(reeList)
  return reeList
}
