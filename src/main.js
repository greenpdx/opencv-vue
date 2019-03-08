import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'
import * as cv from 'opencv.js'

Vue.prototype.$http = Axios
Vue.prototype.$cv = cv

Vue.config.productionTip = false


let cnt = 0
let info
let tim = setInterval(() => {
  cnt++
  try {
    info = cv.getBuildInformation()
    clearInterval(tim)
    //console.log(cnt, 'INFO\n', info)

    // Now start Vue
    new Vue({
      render: h => h(App),
    }).$mount('#app')
  }
  catch(err) {
    //console.log('try again', cnt)
    if (cnt > 100) clearInterval(tim)
  }
}, 25)
