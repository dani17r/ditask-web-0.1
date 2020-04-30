import Vue from 'vue'
import axios from 'axios'

import Tooltip from 'vue-directive-tooltip'
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css'

import autofocus from "vue-autofocus-directive"

Vue.directive("autofocus", autofocus);
Vue.use(Tooltip)

window.axios = axios
window.$ = window.jQuery = require('jquery')
// window.dragscroll = require('./../assets/js/jquery.dragscroll.min.js')
window.UrlApp = 'http://api-resfull.test:9001/'
window.UrlOrigin = window.location.origin+'/'
