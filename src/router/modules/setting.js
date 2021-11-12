import Layout from '@/layout'
export default {
  path: '/setting',
  component: Layout,
  children: [
    {
      path: '',
      name: 'setting', // 权限的标识
      component: () => import('@/router/modules/setting'),
      meta: {
        title: '公司设置',
        icon: 'setting'
      }

    }
  ]
}
