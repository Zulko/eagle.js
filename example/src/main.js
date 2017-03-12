// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import App from './App'
import Home from './Home'

import Eagle from 'eagle.js'

import slideshows from './slideshows/slideshows.js'
/* eslint-disable no-new */

Vue.use(Eagle)
Vue.use(Router)

var routes = []
slideshows.list.forEach(function (slideshow) {
  routes.push({
    path: '/' + slideshow.infos.path,
    component: slideshow
  })
})
routes.push({ path: '*', component: Home })

routes.push({
  path: '/',
  name: 'Home',
  component: Home
})
console.log(routes)

var router = new Router({
  routes
  // hashbang: true
  // mode: 'history'
})

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
