
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import VueRouter from 'vue-router'
Vue.use(Router)


const router = new VueRouter({
  mode: 'history',
  routes
})


export default router;