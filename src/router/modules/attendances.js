import Layout from '@/layout'
export default {
  path: '/attendances',
  component: Layout,
  children: [
    {
      path: '',
      name: 'attendances', // 权限的标识
      component: () => import('@/views/attendances'),
      meta: {
        title: '考勤',
        icon: 'skill'
      }

    }
  ]
}
