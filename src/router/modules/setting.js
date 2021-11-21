import Layout from '@/layout'
export default {
  path: '/settings',
  component: Layout,
  children: [
    {
      path: '',
      name: 'settings', // 权限的标识
      component: () => import('@/views/setting'),
      meta: {
        title: '公司设置',
        icon: 'setting'
      }

    }
  ]
}
