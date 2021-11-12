import Layout from '@/layout'
export default {
  path: '/approvals',
  component: Layout,
  children: [
    {
      path: '',
      name: 'approvals', // 权限的标识
      component: () => import('@/router/modules/approvals'),
      meta: {
        title: '审批',
        icon: 'tree-table'
      }

    }
  ]
}
