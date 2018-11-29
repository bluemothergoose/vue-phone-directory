import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import PhoneList from '@/components/PhoneList'
import PhoneUsersManager from '@/components/PhoneUsersManager'
import Auth from '@okta/okta-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTimes)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(Auth, {
  issuer: 'https://dev-119828.oktapreview.com/oauth2/default',
  client_id: '0oahd544mnInltxdb0h7',
  redirect_uri: 'http://localhost:8080/implicit/callback',
  scope: 'openid profile email'
})

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/phone-list',
      name: 'PhoneList',
      component: PhoneList
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/phone-users-manager',
      name: 'PhoneUsersManager',
      component: PhoneUsersManager,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router
