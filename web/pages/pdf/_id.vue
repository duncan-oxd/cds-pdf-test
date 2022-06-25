<template>
  <article :class="{ 'pdf-ready': ready }">
    <h1 class="mb-3">PDF ID#{{ $route.params.id }}</h1>

    <p>This could be an ROP report or something...</p>

    <p>
      Results of REST call to <code>https://reqbin.com/echo/get/json</code> is:
    </p>

    <pre class="my-3" v-text="apiData" />

    <p>
      <v-btn color="primary" elevation="2"> vuetify is installed </v-btn>
    </p>

    <p>
      Waiting 3 seconds before converting: <b>{{ counter }}ms</b>
    </p>

    <p v-if="ready">Ready!</p>

    <div class="page-break" />

    <h1>Another page</h1>

    <p>the PDF is 2 pages long!</p>
  </article>
</template>

<script>
export default {
  name: 'PdfPage',

  layout: 'pdf',

  async asyncData({ $axios }) {
    const apiData = await $axios.$get('https://reqbin.com/echo/get/json')

    return {
      apiData,
    }
  },

  data: () => ({
    counter: 3000,
    ready: false,
  }),

  mounted() {
    // make DocRaptor function available on the window
    window.docraptorJavaScriptFinished = this.docraptorJavaScriptFinished

    // delay for some time to simulate async requests / rendering
    const countdown = setInterval(() => {
      this.counter -= 100
      if (this.counter <= 0) {
        clearInterval(countdown)
        this.ready = true
      }
    }, 100)
  },

  methods: {
    docraptorJavaScriptFinished() {
      return this.ready
    },
  },
}
</script>

<style lang="scss" scoped>
h1 {
  color: red;
}

.page-break {
  page-break-after: always;
}
</style>
