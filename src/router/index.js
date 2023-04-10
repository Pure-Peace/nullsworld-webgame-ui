import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { loadLanguageAsync } from '@/locales'
import { getStore } from '@/utils/common'

let onceLoadI18nLang = loadLanguageAsync.bind(this)

const newRouter = (emitter) => {
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, form, savedPosition) {
      window.scroll({ top: 0, left: 0 })
    }
  })
  router.beforeEach(async (to, from, next) => {
    if (onceLoadI18nLang) {
      await onceLoadI18nLang(getStore('lang'))
    }
    onceLoadI18nLang = null
    emitter.emit('navChange', to?.meta)
    next()
  })
  return router
}

export { newRouter }
