import Vue from 'vue'
import App from './App'

// 导入时间组件
import MyTime from './components/time.vue'

Vue.config.productionTip = false

// 注册为组件
Vue.component('my-time',MyTime)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
