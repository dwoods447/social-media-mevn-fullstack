import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vuetify from './plugins/vuetify';
import store from './store/store'
import VueCarousel from 'vue-carousel';
Vue.use(VueCarousel);

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
