<template>
  <div class="container-fluid mt-4">
    <h1 class="h1">Phone List <b-btn @click="showModal">Add New</b-btn></h1>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-row>
      <b-col>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Department</th>
              <th>Title</th>
              <th>Email</th>
              <th>EXT</th>
              <th>Fax</th>
              <th>Cell Phone</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="phoneuser in phoneusers" :key="phoneuser.id">
              <td>{{ phoneuser.lastname }}</td>
              <td>{{ phoneuser.firstname }}</td>
              <td>{{ phoneuser.department }}</td>
              <td>{{ phoneuser.title }}</td>
              <td>{{ phoneuser.email }}</td>
              <td>{{ phoneuser.extension }}</td>
              <td>{{ phoneuser.fax }}</td>
              <td>{{ phoneuser.cell }}</td>
              <td class="text-right">
                <b-btn v-b-modal.editUser @click.prevent="populatePhoneUserToEdit(phoneuser)">Edit</b-btn>
                <b-btn @click.prevent="deletePhoneUser(phoneuser.id)" variant="danger">Delete</b-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
      <b-col lg="3">
        <b-modal id="editUser" ref="editUserRef" :title="(model.id ? 'Editing: ' + model.firstname + ' ' + model.lastname : 'New Phone User')">
          <form @submit.prevent="savePhoneUser">
            <b-form-group label="First Name">
              <b-form-input type="text" v-model="model.firstname" required></b-form-input>
            </b-form-group>
            <b-form-group label="Last Name">
              <b-form-input type="text" v-model="model.lastname" required></b-form-input>
            </b-form-group>
            <b-form-group label="Department">
              <b-form-input type="text" v-model="model.department" required></b-form-input>
            </b-form-group>
            <b-form-group label="Job Title">
              <b-form-input type="text" v-model="model.title" required></b-form-input>
            </b-form-group>
            <b-form-group label="Email">
              <b-form-input type="text" v-model="model.email" required></b-form-input>
            </b-form-group>
            <b-form-group label="EXT">
              <b-form-input type="text" v-model="model.extension"></b-form-input>
            </b-form-group>
            <b-form-group label="Fax">
              <b-form-input type="text" v-model="model.fax"></b-form-input>
            </b-form-group>
            <b-form-group label="Cell Phone">
              <b-form-input type="text" v-model="model.cell"></b-form-input>
            </b-form-group>
            <div id="saveUser">
              <b-btn @click="hideModal">Close</b-btn>
              <b-btn type="submit" variant="success" @click="hideModal">Save Phone User</b-btn>
            </div>
          </form>
        </b-modal>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import api from '@/api'
export default {
  data () {
    return {
      loading: false,
      activeEmail: null,
      phoneusers: [],
      model: {}
    }
  },
  async created () {
    this.refreshPhoneUsers()
  },
  methods: {
    hideModal () {
      this.$refs.editUserRef.hide()
    },
    showModal () {
      this.model = {}
      this.$refs.editUserRef.show()
    },
    hideNewUserModal () {
      this.$refs.addUserRef.hide()
    },
    async refreshPhoneUsers () {
      this.activeUser = await this.$auth.getUser()
      if (this.activeUser.email !== 'isstaff@invent.org') {
        this.$router.push('/')
      }
      try {
        this.activeEmail = await this.activeUser.email
        if (this.activeEmail !== 'isstaff@invent.org') {
          this.$router.push('/')
        }
      } catch (error) {
        console.log('no active user found')
        console.log(error)
      }
      this.loading = true
      this.phoneusers = await api.getPhoneUsers()
      this.loading = false
    },
    async populatePhoneUserToEdit (phoneuser) {
      this.$refs.editUserRef.hide()
      this.model = Object.assign({}, phoneuser)
    },
    async savePhoneUser () {
      if (this.model.id) {
        await api.updatePhoneUser(this.model.id, this.model)
      } else {
        await api.createPhoneUser(this.model)
      }
      this.model = {} // reset form
      await this.refreshPhoneUsers()
    },
    async deletePhoneUser (id) {
      if (confirm('Are you sure you want to delete this user?')) {
        // if we are editing a user we deleted, remove it from the form
        if (this.model.id === id) {
          this.model = {}
        }
        await api.deletePhoneUser(id)
        await this.refreshPhoneUsers()
      }
    }
  }
}
</script>

<style>
#editUser___BV_modal_footer_ {
  display: none;
}

#saveUser {
  display: flex;
  justify-content: flex-end;
}
</style>
