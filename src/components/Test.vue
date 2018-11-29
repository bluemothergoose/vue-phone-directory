<template>
 <grid :data="gridData" :columns="gridColumns"></grid>
</template>

<script>
  import Grid from './Grid'
  import api from '@/api'
  export default {
    name: 'app',
    data () {
      return {
        gridData: [
          { name: 'American alligator', location: 'Southeast United States' },
          { name: 'Chinese alligator', location: 'Eastern China' },
          { name: 'Spectacled caiman', location: 'Central & South America' },
          { name: 'Broad-snouted caiman', location: 'South America' },
          { name: 'Jacaré caiman', location: 'South America' },
          { name: 'Black caiman', location: 'South America' }
        ],
        gridColumns: ['name', 'location']
      }
    },
    async created () {
      this.refreshPhoneUsers()
    },
    methods: {
      async refreshPhoneUsers () {
        this.loading = true
        this.phoneusers = await api.getPhoneUsers()
        this.loading = false
      }
    },
    components: {
      Grid
    }
  }
</script>
