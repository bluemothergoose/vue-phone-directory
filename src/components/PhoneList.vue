<template>
  <div class="container-fluid">
    <br>
    <h1 class="h1">Phone Directory</h1>
    <br>
    <b-alert :show="loading" variant="info">Loading...</b-alert>
    <b-input-group size="md" prepend="Search" class="mb-3" style="width:100%">
      <input v-model="keyword" type="text" class="form-control"/>
      <b-input-group-text slot="append">
        <b-btn :disabled="!keyword" variant="link" @click="keyword = ''" class="p-0"><font-awesome-icon icon="times"/></b-btn>
      </b-input-group-text>
    </b-input-group>
    <b-row>
      <b-col>
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th class="sortable" @click="sort('lastname')">Last Name</th>
              <th class="sortable" @click="sort('firstname')">First Name</th>
              <th class="sortable" @click="sort('department')">Department</th>
              <th>Title</th>
              <th>Email</th>
              <th>Extension</th>
              <th>Fax</th>
              <th>Cell Phone</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="phoneuser in filteredData" :key="phoneuser.id">
              <td>{{ phoneuser.lastname }}</td>
              <td>{{ phoneuser.firstname }}</td>
              <td>{{ phoneuser.department }}</td>
              <td>{{ phoneuser.title }}</td>
              <td>{{ phoneuser.email }}</td>
              <td>{{ phoneuser.extension }}</td>
              <td>{{ phoneuser.fax }}</td>
              <td>{{ phoneuser.cell }}</td>
            </tr>
          </tbody>
        </table>
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
      activeUser: null,
      keyword: '',
      phoneusers: [],
      currentSort: 'name',
      currentSortDir: 'asc',
      model: {},
      searchQuery: '',
      sortKey: '',
      sortOrders: {}
    }
  },
  async created () {
    this.refreshPhoneUsers()
  },
  methods: {
    async refreshPhoneUsers () {
      this.activeUser = await this.$auth.getUser()
      if (!this.activeUser) {
        this.$router.push('/')
      }
      this.loading = true
      this.phoneusers = await api.getPhoneUsers()
      this.loading = false
    },
    sort: function (s) {
      // if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = s
    }
  },
  computed: {
    filteredData: function () {
      let filterKey = this.keyword && this.keyword.toLowerCase()
      let phoneusers = this.phoneusers

      if (filterKey) {
        phoneusers = phoneusers.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      return phoneusers.sort((a, b) => {
        let modifier = 1
        if (this.currentSortDir === 'desc') modifier = -1
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier
        return 0
      })
    }
  }
}
</script>

<style>
    .sortable{
        cursor: pointer;
    }
</style>