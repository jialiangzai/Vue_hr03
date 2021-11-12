import request from '@/utils/request'
// 获取真实的接口数据
export function getDepartments () {
  return request({
    url: '/company/department'
  })
}
