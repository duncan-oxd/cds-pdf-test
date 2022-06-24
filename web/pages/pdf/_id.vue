<template>
  <main :class="{ 'pdf-ready': ready }">
    <h1 class="mb-3">PDF ID#{{ $route.params.id }}</h1>

    <p>This could be an ROP report or something...</p>

    <p>Results of REST call to <code>https://reqbin.com/echo/get/json</code> is:</p>

    <pre class="my-3" v-text="apiData" />

    <p>
      <v-btn
        color="primary"
        elevation="2"
      >
        vuetify is installed
      </v-btn>
    </p>

    <p>Waiting 3 seconds before converting: <b>{{ counter }}ms</b></p>

    <p v-if="ready">Ready!</p>

  </main>
</template>

<script>
export default {
  name:'PdfPage',

  layout: 'pdf',

  async asyncData({$axios}) {
    const apiData = await $axios.$get('https://reqbin.com/echo/get/json');

    return {
      apiData
    }
  },

  data: () => ({
    counter: 3000,
    ready: false,
  }),

  mounted() {
    const countdown = setInterval(() => {
      this.counter -= 100;
      if (this.counter <= 0) {
        clearInterval(countdown);
        this.ready = true;
      }
    }, 100);
  },
}
</script>

<style lang="scss" scoped>
h1 {
  color: red;
}
</style>
