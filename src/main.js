// Functions
import { createApp, markRaw, computed } from 'vue'
import { newRouter } from '@/router'
import i18n from '@/locales'
import { createPinia } from 'pinia'
import mitt from 'mitt'
import { axios } from '@/backends/base'
import { vfmPlugin } from 'vue-final-modal'

// Pina Stores
import { useWallet } from '@/stores/wallet'
import { useParamStore } from '@/stores/paramStore'

// Components
import App from '@/App.vue'
import {
  message,
  notification,
  Radio,
  RadioGroup,
  Pagination,
  Tooltip,
  Spin,
  Skeleton,
  Image,
  Affix,
  Dropdown,
  Menu,
  MenuItem,
  Checkbox,
  ConfigProvider
} from 'ant-design-vue'
import ColorButton from '@/components/Common/ColorButton.vue'
import CustomDropdown from '@/components/Common/CustomDropdown.vue'
import NeedWalletConnect from '@/components/Common/NeedWalletConnect.vue'

// Styles
import '@/styles/custom-ant-design.less'
import '@/styles/tailwind.css'

// Create objecs
const emitter = mitt()
const app = createApp(App)
const pinia = createPinia()
const router = newRouter(emitter)

// Plugins init
pinia.use(() => ({
  route: computed(() => markRaw(router.currentRoute.value))
}))

// Use Plugins
app.use(pinia)
app.use(router)
app.use(vfmPlugin)
app.use(i18n)

// Use Components
app.use(Radio)
app.use(RadioGroup)
app.use(Pagination)
app.use(Tooltip)
app.use(Spin)
app.use(Skeleton)
app.use(Image)
app.use(Affix)
app.use(Dropdown)
app.use(Menu)
app.use(MenuItem)
app.use(Checkbox)
app.use(ConfigProvider)
app.component('ColorButton', ColorButton)
app.component('CustomDropdown', CustomDropdown)
app.component('NeedWalletConnect', NeedWalletConnect)

// Global
app.config.globalProperties.$emitter = emitter
app.config.globalProperties.$axios = axios
app.config.globalProperties.$message = message
app.config.globalProperties.$notification = notification

// Global store
app.config.globalProperties.wallet = useWallet(app.config.globalProperties)
app.config.globalProperties.paramStore = useParamStore()

// Mount
app.mount('#app')
