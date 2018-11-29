<template>
  <div id="app" class="">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">NIHF</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-nav>
          <b-nav-item to="/">Home</b-nav-item>
          <b-nav-item to="/phone-list" v-bind:hidden="!activeUser">Phone List</b-nav-item>
          <b-nav-item to="/phone-users-manager" v-bind:hidden="activeEmail != 'isstaff@invent.org'">Edit Directory</b-nav-item>
          <b-nav-item class="login-button" href="#" @click.prevent="login" v-if="!activeUser">Login</b-nav-item>
          <b-nav-item class="login-button" href="#" @click.prevent="logout" v-else>Logout</b-nav-item>
        </b-nav>
      </b-collapse>
    </b-navbar>
    <!-- routes will be rendered here -->
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app',
  data () {
    return {
      activeUser: null,
      activeEmail: null
    }
  },
  async created () {
    await this.refreshActiveUser()
  },
  watch: {
    // everytime a route is changed refresh the active/admin user
    '$route': 'refreshActiveUser'
  },
  methods: {
    login () {
      this.$auth.loginRedirect()
    },
    async refreshActiveUser () {
      this.activeUser = await this.$auth.getUser()
      try {
        this.activeEmail = await this.activeUser.email
      } catch (error) {
        console.log('no active user found')
        console.log(error)
      }
    },
    async logout () {
      await this.$auth.logout()
      await this.refreshActiveUser()
      this.activeEmail = null
      this.$router.push('/')
    }
  }
}
</script>
