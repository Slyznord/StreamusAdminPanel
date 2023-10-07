import store from '../store'

export async function checkAuth (to, from, next) {
  if (to.matched.some(record => record.meta.isProtected)) {
    if (store.getters['Auth/isLogged']) {
      const { expired } = await store.dispatch('Auth/checkToken')

      if (!expired) {
        return next()
      }
    }

    return next('/auth')
  }

  return next()
}
