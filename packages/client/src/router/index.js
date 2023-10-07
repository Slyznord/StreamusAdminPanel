import { createRouter, createWebHashHistory } from 'vue-router'
import { checkAuth } from './middleware'
import routes from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(checkAuth)

export default router
