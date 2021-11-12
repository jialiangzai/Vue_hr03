import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees', // 权限的标识
      component: () => import('@/router/modules/employees'),
      meta: {
        title: '员工管理',
        icon: 'people'
      }

    }
  ]
}