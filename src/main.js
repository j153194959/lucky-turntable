// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import axios from 'axios'
import global_ from './components/common/Global'
// import Vconsole from 'vconsole'
import '../static/lib/burial-site/td-h5-website-sdk-3.1.2'

// const vConsole = new Vconsole()
// Vue.use(vConsole)

// import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'
// Vue.use(MintUI)

FastClick.attach(document.body)

// ios 由其它事件外连 click事件需要触发两次
const notNeed = FastClick.notNeeded(document.body)
Vue.prototype.iosClick = function (dom) {
  dom.click()
  if (!notNeed) {
    dom.click()
  }
}

require('es6-promise').polyfill()
Vue.prototype.$ajax = axios
// 设置默认值
// axios.defaults.baseURL = 'http://192.20.102.198:8080/doubleEleven'
axios.defaults.baseURL = 'https://estock.xyzq.com.cn/activity/doubleEleven'
// axios.defaults.baseURL = 'https://estock.xyzq.com.cn/activity2/summer2/summer'
// axios.defaults.baseURL = 'http://jasonwx.vipgz1.idcfengye.com/summer'

Vue.prototype.GLOBAL = global_

Vue.config.productionTip = false

// alert去掉网址显示，不支持ie
window.alert = function (name) {
  var iframe = document.createElement('IFRAME')
  iframe.style.display = 'none'
  iframe.setAttribute('src', 'data:text/plain,')
  document.documentElement.appendChild(iframe)
  window.frames[0].window.alert(name)
  iframe.parentNode.removeChild(iframe)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
