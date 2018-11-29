<template>
  <div>
    <h1 class="hero">Phone Directory Home</h1>
      <b-table responsive :items="items" class="col-md-6 offset-md-3" style="align-items: center; justify-content: center; text-align: center;">
        <span slot="mainNumber" slot-scope="data" v-html="data.value">
        </span>
        <span slot="tollFreeNumber" slot-scope="data" v-html="data.value">
        </span>
      </b-table>
  </div>
</template>

<script>
  const items = [
    {
      mainNumber: '<a href="tel:3307624463">330-762-4463</a>', tollFreeNumber: '<a href="tel:8009684332">800-968-4332</a>', faxNumber: '330-762-6313'
    }
  ]

  export default {
    data () {
      return {
        items: items
      }
    }
  }
</script>

<style>
  .hero {
    height: 30vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .hero .lead {
    font-weight: 200;
    font-size: 1.5rem;
  }
</style>
