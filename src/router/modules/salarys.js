import Layout from '@/layout'
export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: '',
      name: 'salarys', // 权限的标识
      component: () => import('@/views/salarys'),
      meta: {
        title: '工资',
        icon: 'money'
      }

    }
  ]
}
