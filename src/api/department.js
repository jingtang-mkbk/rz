import request from '@/utils/request'

export const getDepartmentList = () => {
  return request({
    url: '/company/department'
  })
}
// 根据id删除部门
export const delDepartment = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 获取员工的简单列表
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}
/**
 *  新增部门接口
 *
 * ****/
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
