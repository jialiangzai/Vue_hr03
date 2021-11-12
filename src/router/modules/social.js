import Layout from '@/layout'
export default {
  path: '/social',
  component: Layout,
  children: [
    {
      path: '',
      name: 'social', // 权限的标识
      component: () => import('@/router/modules/social'),
      meta: {
        title: '社保',
        icon: 'table'
      }

    }
  ]
}
