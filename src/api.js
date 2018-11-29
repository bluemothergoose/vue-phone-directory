import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8081/',
  json: true
})

export default {
  async execute (method, resource, data) {
    // inject the accessToken for each request
    let accessToken = await Vue.prototype.$auth.getAccessToken()
    return client({
      method,
      url: resource,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(req => {
      return req.data
    })
  },
  getPhoneUsers () {
    return this.execute('get', '/phone-users')
  },
  getPhoneUser (id) {
    return this.execute('get', `/phone-users/${id}`)
  },
  createPhoneUser (data) {
    return this.execute('post', '/phone-users', data)
  },
  updatePhoneUser (id, data) {
    return this.execute('put', `/phone-users/${id}`, data)
  },
  deletePhoneUser (id) {
    return this.execute('delete', `/phone-users/${id}`)
  }
}
