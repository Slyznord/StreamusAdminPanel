export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home'),
    meta: {
      isProtected: true
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/Auth')
  }
]
