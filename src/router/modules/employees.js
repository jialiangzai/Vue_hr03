import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees', // 权限的标识
      component: () => import('@/views/employees'),
      meta: {
        title: '员工管理',
        icon: 'people'
      }

    },
    // 员工详情
    {
      path: '/employees/detail/:id',
      component: () => import('@/views/employees/detail'),
      hidden: true, // 不在左侧菜单显示
      meta: {
        title: '员工详情'
      }
    }
  ]
}
